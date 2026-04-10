import { Router, Request, Response, NextFunction } from 'express';
import { Application } from '../models/Application';
import { authenticate } from '../middleware/auth';
import {
  analyzeJDAndGenerateBullets,
  streamResumeBullets,
  parseJobDescription,
} from '../services/aiService';
import { ApplicationSchema, APPLICATION_STATUSES } from '../types';
import { validate } from '../middleware/validate';
import { aiRateLimiter } from '../middleware/rateLimiter';
import logger from '../config/logger';

const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ userId: req.userId }).sort({
      updatedAt: -1,
    });
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

router.get('/stats', async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ userId: req.userId });

    const total = applications.length;
    const byStatus: Record<string, number> = {};
    APPLICATION_STATUSES.forEach((s) => {
      byStatus[s] = 0;
    });
    applications.forEach((app) => {
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;
    });

    // Weekly activity (applications created in last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyCount = applications.filter(
      (app) => new Date(app.createdAt) >= oneWeekAgo
    ).length;

    // Overdue follow-ups
    const now = new Date();
    const overdueCount = applications.filter(
      (app) =>
        app.followUpDate &&
        new Date(app.followUpDate) < now &&
        app.status !== 'Rejected' &&
        app.status !== 'Offer'
    ).length;

    // In Progress (not rejected, not offer)
    const inProgressCount = applications.filter(
      (app) => app.status !== 'Rejected' && app.status !== 'Offer'
    ).length;

    // Offers Received
    const offersReceived = byStatus['Offer'] || 0;

    // Average Match Score
    const scoredApps = applications.filter(app => (app.matchScore || 0) > 0);
    const averageMatchScore = scoredApps.length > 0 
      ? Math.round(scoredApps.reduce((sum, app) => sum + (app.matchScore || 0), 0) / scoredApps.length)
      : 0;

    res.json({
      total,
      byStatus,
      weeklyCount,
      inProgressCount,
      offersReceived,
      averageMatchScore,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
});

router.post(
  '/',
  validate(ApplicationSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const application = await Application.create({
        ...req.body,
        userId: req.userId,
      });

      res.status(201).json(application);
    } catch (error) {
      logger.error('Create application error:', error);
      res.status(500).json({ message: 'Failed to create application' });
    }
  }
);

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Failed to update application' });
  }
});

// PATCH /api/applications/:id/status — Update only status (for drag-and-drop)
router.patch(
  '/:id/status',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.body;

      if (!status || !APPLICATION_STATUSES.includes(status)) {
        res.status(400).json({
          message: `Invalid status. Must be one of: ${APPLICATION_STATUSES.join(', ')}`,
        });
        return;
      }

      const application = await Application.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { status },
        { new: true }
      );

      if (!application) {
        res.status(404).json({ message: 'Application not found' });
        return;
      }

      res.json(application);
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({ message: 'Failed to update application status' });
    }
  }
);

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete application' });
  }
});

router.post(
  '/parse-jd',
  aiRateLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { jdText } = req.body;

      if (!jdText || jdText.trim().length < 50) {
        res.status(400).json({
          message: 'Please provide a job description with at least 50 characters',
        });
        return;
      }

      // Pass userId for personalized results
      const result = await analyzeJDAndGenerateBullets(jdText, req.userId);

      res.json(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to parse job description';
      logger.error('Parse JD error:', error);
      res.status(500).json({ message });
    }
  }
);

/**
 * SSE Endpoint: Streams real-time AI insights for a job description.
 * First yields extracted structured data, followed by a stream of resume bullets.
 */
router.post(
  '/parse-jd-stream',
  aiRateLimiter,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { jdText } = req.body;

      if (!jdText || jdText.trim().length < 50) {
        res.status(400).json({
          message: 'Please provide a job description with at least 50 characters',
        });
        return;
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const parsed = await parseJobDescription(jdText);

      res.write(
        `data: ${JSON.stringify({ type: 'parsed', data: parsed })}\n\n`
      );

      const bulletStream = streamResumeBullets(jdText);

      for await (const chunk of bulletStream) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to parse job description';

      if (!res.headersSent) {
        res.status(500).json({ message });
      } else {
        res.write(
          `data: ${JSON.stringify({ type: 'error', data: message })}\n\n`
        );
        res.end();
      }
    }
  }
);

router.get('/export/csv', async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ userId: req.userId }).sort({
      dateApplied: -1,
    });

    const headers = [
      'Company',
      'Role',
      'Status',
      'Date Applied',
      'Location',
      'Seniority Level',
      'Salary Range',
      'JD Link',
      'Follow-Up Date',
      'Priority',
      'Match Score',
      'Skills',
      'Nice-to-Have Skills',
      'Notes',
    ];

    const csvRows = [headers.join(',')];

    for (const app of applications) {
      const row = [
        `"${(app.company || '').replace(/"/g, '""')}"`,
        `"${(app.role || '').replace(/"/g, '""')}"`,
        `"${app.status}"`,
        `"${app.dateApplied ? new Date(app.dateApplied).toISOString().split('T')[0] : ''}"`,
        `"${(app.location || '').replace(/"/g, '""')}"`,
        `"${(app.seniorityLevel || '').replace(/"/g, '""')}"`,
        `"${(app.salaryRange || '').replace(/"/g, '""')}"`,
        `"${(app.jdLink || '').replace(/"/g, '""')}"`,
        `"${app.followUpDate ? new Date(app.followUpDate).toISOString().split('T')[0] : ''}"`,
        `"${app.priority || 'Medium'}"`,
        `"${app.matchScore || 0}"`,
        `"${(app.skills || []).join('; ')}"`,
        `"${(app.niceToHaveSkills || []).join('; ')}"`,
        `"${(app.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      ];
      csvRows.push(row.join(','));
    }

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="job-applications-${new Date().toISOString().split('T')[0]}.csv"`
    );
    res.send(csv);
  } catch (error) {
    logger.error('Export CSV error:', error);
    res.status(500).json({ message: 'Failed to export applications' });
  }
});

export default router;
