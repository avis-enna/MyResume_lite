/**
 * Input validation schemas and utilities
 * Addresses security concerns from PROJECT_REVIEW_REPORT.txt
 */

import { z } from 'zod';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation - strong password requirements
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Admin login validation
export const adminLoginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(255, 'Email is too long')
    .regex(emailRegex, 'Invalid email format'),
  password: z.string()
    .min(1, 'Password is required')
    .max(128, 'Password is too long'),
  username: z.string().optional() // For backward compatibility
});

// Contact form validation
export const contactSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(255, 'Email is too long'),
  phone: z.string()
    .min(1, 'Phone is required')
    .max(20, 'Phone number is too long')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format'),
  location: z.string()
    .min(1, 'Location is required')
    .max(100, 'Location is too long'),
  linkedin: z.string()
    .url('Invalid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  github: z.string()
    .url('Invalid GitHub URL')
    .optional()
    .or(z.literal(''))
});

// About section validation
export const aboutSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s\-\.]+$/, 'Name contains invalid characters'),
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
  bio: z.object({
    paragraph1: z.string()
      .min(1, 'First paragraph is required')
      .max(1000, 'First paragraph is too long'),
    paragraph2: z.string()
      .min(1, 'Second paragraph is required')
      .max(1000, 'Second paragraph is too long')
  }),
  experience: z.object({
    years: z.number()
      .min(0, 'Years of experience cannot be negative')
      .max(50, 'Years of experience seems too high'),
    description: z.string()
      .min(1, 'Experience description is required')
      .max(500, 'Experience description is too long')
  })
});

// Skills validation
export const skillSchema = z.object({
  name: z.string()
    .min(1, 'Skill name is required')
    .max(50, 'Skill name is too long')
    .regex(/^[a-zA-Z0-9\s\-\.\+\#]+$/, 'Skill name contains invalid characters'),
  level: z.number()
    .min(1, 'Skill level must be at least 1')
    .max(100, 'Skill level cannot exceed 100'),
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category is too long')
    .regex(/^[a-zA-Z\s\-]+$/, 'Category contains invalid characters')
});

export const skillsArraySchema = z.array(skillSchema).max(50, 'Too many skills');

// Blog post validation
export const blogPostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(200, 'Slug is too long')
    .regex(/^[a-z0-9\-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string()
    .min(1, 'Excerpt is required')
    .max(500, 'Excerpt is too long'),
  content: z.string()
    .min(1, 'Content is required')
    .max(50000, 'Content is too long'),
  tags: z.array(z.string().max(30, 'Tag is too long')).max(10, 'Too many tags'),
  published: z.boolean(),
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional()
    .or(z.literal('')),
  readTime: z.number()
    .min(1, 'Read time must be at least 1 minute')
    .max(120, 'Read time seems too high')
    .optional()
});

// Project validation
export const projectSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title is too long'),
  subtitle: z.string()
    .min(1, 'Subtitle is required')
    .max(200, 'Subtitle is too long'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description is too long'),
  longDescription: z.string()
    .min(1, 'Long description is required')
    .max(2000, 'Long description is too long'),
  technologies: z.array(z.string().max(30, 'Technology name is too long'))
    .min(1, 'At least one technology is required')
    .max(20, 'Too many technologies'),
  githubUrl: z.string()
    .url('Invalid GitHub URL')
    .optional()
    .or(z.literal('')),
  liveUrl: z.string()
    .url('Invalid live URL')
    .optional()
    .or(z.literal('')),
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional()
    .or(z.literal(''))
});

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

// Validation helper function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
}

// Rate limiting types
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

export const rateLimitConfigs = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many login attempts'
  },
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: 'Too many contact form submissions'
  },
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many API requests'
  }
} as const;
