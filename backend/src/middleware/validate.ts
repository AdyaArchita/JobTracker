import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import logger from '../config/logger';

/**
 * @file middleware/validate.ts
 * Generic Zod validation middleware.
 * Intercepts requests, validates the body against a schema, and returns a 400 if invalid.
 */

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Validation failed:', {
          path: req.path,
          errors: error.errors.map(e => e.message),
        });
        
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
};
