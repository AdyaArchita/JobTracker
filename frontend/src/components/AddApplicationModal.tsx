import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  Building2,
  Calendar,
  Link as LinkIcon,
  DollarSign,
  Briefcase,
  Copy,
  Check,
  Zap,
  Target,
} from 'lucide-react';
import {
  createApplication,
  parseJobDescriptionStream,
} from '../api/applications';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { MatchScore } from './ui/MatchScore';
import {
  CreateApplicationData,
  ApplicationStatus,
  JOB_TYPES,
  LOCATION_TYPES,
} from '../types';
import toast from 'react-hot-toast';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Component: AddApplicationModal
 * Orchestrates the multi-step job application creation flow.
 * Handles AI-powered JD parsing via Server-Sent Events (SSE).
 */
export function AddApplicationModal({
  isOpen,
  onClose,
}: AddApplicationModalProps) {
  const [jdText, setJdText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateApplicationData>({
    company: '',
    role: '',
    status: 'Applied',
    location: 'Remote',
    jobType: 'Full-time',
    dateApplied: new Date().toISOString().split('T')[0],
    skills: [],
    niceToHaveSkills: [],
    seniorityLevel: 'Mid',
    jdText: '',
    jdLink: '',
    notes: '',
    salaryRange: '',
    resumeBullets: [],
    matchScore: 0,
    coverLetterSnippet: '',
    matchReason: '',
    priority: 'Medium',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateApplicationData) => createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application added!', { 
        icon: '🚀',
        style: { borderRadius: '12px', background: '#0f172a', color: '#fff' }
      });
      handleClose();
    },
    onError: () => {
      toast.error('Failed to add application');
    },
  });

  /**
   * Triggers the AI parsing lifecycle. 
   * Updates form state incrementally as the stream yields structured data and resume bullets.
   */
  const handleParse = useCallback(async () => {
    if (!jdText.trim()) {
      toast.error('Please paste a job description first');
      return;
    }

    setIsParsing(true);
    setFormData((prev) => ({ ...prev, resumeBullets: [], jdText }));

    try {
      await parseJobDescriptionStream(
        jdText,
        (parsedData) => {
          setFormData((prev) => ({
            ...prev,
            company: parsedData.company || prev.company,
            role: parsedData.role || prev.role,
            location: parsedData.location || prev.location,
            jobType: parsedData.jobType || prev.jobType,
            skills: parsedData.skills || prev.skills,
            niceToHaveSkills: parsedData.niceToHaveSkills || prev.niceToHaveSkills,
            seniorityLevel: parsedData.seniorityLevel || prev.seniorityLevel,
          }));
        },
        (bullet) => {
          setFormData((prev) => ({
            ...prev,
            resumeBullets: [...(prev.resumeBullets || []), bullet],
          }));
        },
        (error) => {
          toast.error(error);
          setIsParsing(false);
        },
        () => {
          setIsParsing(false);
          toast.success('AI insights generated!', { icon: '✨' });
        }
      );
    } catch (error) {
      toast.error('Failed to parse JD');
      setIsParsing(false);
    }
  }, [jdText]);

  const handleClose = useCallback(() => {
    setJdText('');
    setFormData({
      company: '',
      role: '',
      status: 'Applied',
      location: 'Remote',
      jobType: 'Full-time',
      dateApplied: new Date().toISOString().split('T')[0],
      skills: [],
      niceToHaveSkills: [],
      seniorityLevel: 'Mid',
      jdText: '',
      jdLink: '',
      notes: '',
      salaryRange: '',
      resumeBullets: [],
      matchScore: 0,
      coverLetterSnippet: '',
      matchReason: '',
      priority: 'Medium',
    });
    onClose();
  }, [onClose]);

  const handleCopy = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Copied to clipboard');
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Application" size="2xl">
      <div className="space-y-8 py-4">
        {/* Step 1: AI Parsing Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-surface-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-500" />
              AI Assistant
            </h3>
            {jdText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setJdText('')}
                className="text-xs text-surface-400 hover:text-red-500"
              >
                Clear
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-surface-400">Analysis Input</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-500 uppercase tracking-widest bg-brand-500/5 px-2 py-1 rounded-md border border-brand-500/10">
                <Sparkles className="w-3 h-3" />
                AI Powered-Parser
              </div>
            </div>
          </div>
          
          <Textarea
            label="Job Description"
            id="jd-textarea"
            placeholder="Paste the full job description here..."
            value={jdText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJdText(e.target.value)}
            rows={8}
            className="font-mono text-xs leading-relaxed"
          />
          
          <div className="flex justify-end">
            <Button
              onClick={handleParse}
              isLoading={isParsing}
              icon={<Sparkles className="w-4 h-4" />}
              className="shadow-lg shadow-brand-500/10 w-full sm:w-auto"
              disabled={!jdText.trim()}
            >
              Parse JD with AI
            </Button>
          </div>
        </section>

        <div className="h-[1px] w-full bg-surface-200 dark:bg-white/5" />

        <section className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-surface-400 mb-6">Structured Data</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company"
              id="company-input"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. Google"
              icon={<Building2 className="w-4 h-4" />}
            />
            <Input
              label="Role"
              id="role-input"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Senior Frontend Dev"
              icon={<Briefcase className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1.5 flex flex-col">
              <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                className="input-base !py-2.5 !text-sm border-transparent cursor-pointer"
              >
                <option value="Applied">Applied</option>
                <option value="Phone Screen">Phone Screen</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="space-y-1.5 flex flex-col">
              <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Priority</label>
              <select
                value={formData.priority || 'Medium'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
                className="input-base !py-2.5 !text-sm border-transparent focus:border-brand-500 cursor-pointer"
              >
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🔵 Low Priority</option>
              </select>
            </div>
            <div className="space-y-1.5 flex flex-col">
              <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Job Type</label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="input-base !py-2.5 !text-sm border-transparent cursor-pointer"
              >
                {JOB_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5 flex flex-col">
              <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Location Setting</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-base !py-2.5 !text-sm border-transparent cursor-pointer"
              >
                {LOCATION_TYPES.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <Input
              label="Date Applied"
              type="date"
              value={formData.dateApplied}
              onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Job Link (Optional)"
              value={formData.jdLink || ''}
              onChange={(e) => setFormData({ ...formData, jdLink: e.target.value })}
              placeholder="https://linkedin.com/jobs/..."
              icon={<LinkIcon className="w-4 h-4" />}
            />
            <Input
              label="Salary Range (Optional)"
              value={formData.salaryRange || ''}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              placeholder="e.g. $120k - $150k"
              icon={<DollarSign className="w-4 h-4" />}
            />
          </div>


          {(formData.resumeBullets && formData.resumeBullets.length > 0) ? (
            <div className="space-y-5 p-6 rounded-2xl bg-brand-500/[0.03] border border-brand-500/10 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 border-b border-brand-500/10 pb-4">
                 <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-500" />
                  <h4 className="text-base font-bold text-surface-900 dark:text-white tracking-tight">AI Insights</h4>
                 </div>
                 {formData.matchScore && formData.matchScore > 0 ? (
                    <div className="flex items-center gap-3 bg-white dark:bg-surface-900 px-3 py-1.5 rounded-full shadow-sm border border-brand-500/20">
                      <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">Fit Score</span>
                      <MatchScore score={formData.matchScore} size="sm" />
                    </div>
                 ) : null}
              </div>

              {formData.matchReason && (
                 <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 items-start">
                   <Target className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                   <div>
                     <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1 mt-0.5">Why You Fit</p>
                     <p className="text-sm font-medium text-surface-700 dark:text-surface-200 leading-relaxed">{formData.matchReason}</p>
                   </div>
                 </div>
              )}

              {formData.coverLetterSnippet && (
                <div className="space-y-2 mt-4">
                  <h5 className="text-xs font-bold text-brand-500 uppercase tracking-widest pl-1">Cover Letter Hook</h5>
                  <div className="group relative bg-white/50 dark:bg-white/[0.02] p-4 font-medium rounded-xl border border-transparent hover:border-brand-500/20 transition-all text-sm text-surface-700 dark:text-surface-300 leading-relaxed italic border-l-4 border-l-brand-500">
                    "{formData.coverLetterSnippet}"
                    <button
                        onClick={(e) => { e.preventDefault(); handleCopy(formData.coverLetterSnippet || '', -1); }}
                        className="absolute right-2 top-2 p-1.5 rounded-lg hover:bg-brand-500/10 text-surface-400 hover:text-brand-500 transition-all opacity-0 group-hover:opacity-100 bg-white dark:bg-surface-900 shadow-sm"
                        title="Copy text"
                      >
                        {copiedIndex === -1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2 mt-4">
                <h5 className="text-xs font-bold text-brand-500 uppercase tracking-widest pl-1 pt-2">Tailored Resume Bullets</h5>
                <ul className="space-y-3">
                  {formData.resumeBullets.map((bullet, idx) => (
                    <li key={idx} className="group relative flex items-start gap-3 text-sm text-surface-600 dark:text-surface-400 bg-white/50 dark:bg-white/[0.02] p-3 rounded-xl border border-transparent hover:border-brand-500/20 transition-all pr-10 shadow-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                      <span className="flex-1 leading-relaxed font-medium">{bullet}</span>
                      <button
                        onClick={(e) => { e.preventDefault(); handleCopy(bullet, idx); }}
                        className="absolute right-2 top-2 p-1.5 rounded-lg hover:bg-brand-500/10 text-surface-400 hover:text-brand-500 transition-all opacity-0 group-hover:opacity-100 bg-white dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800"
                        title="Copy bullet"
                      >
                        {copiedIndex === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <Textarea
            label="Additional Notes"
            value={formData.notes || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any interview questions or personal thoughts..."
            rows={3}
          />
        </section>

        <div className="flex justify-end gap-3 pt-6 border-t border-surface-200 dark:border-white/5">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => createMutation.mutate(formData)}
            isLoading={createMutation.isPending}
            className="px-8 shadow-xl shadow-brand-500/20"
          >
            Create Application
          </Button>
        </div>
      </div>
    </Modal>
  );
}
