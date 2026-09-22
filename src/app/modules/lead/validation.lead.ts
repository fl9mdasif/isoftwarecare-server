import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, { message: 'Invalid id' });

// `website` is a honeypot: a hidden field real visitors never see or fill in
// the actual form. A bot filling every field in the raw HTML trips it. Kept
// out of TLead entirely — checked in the service, never persisted.
const createLeadValidationSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }).trim().min(1).max(100),
    email: z.string({ message: 'Email is required' }).trim().email(),
    phone: z.string().trim().optional(),
    message: z.string({ message: 'Message is required' }).trim().min(1).max(2000),
    serviceInterested: objectId.optional(),
    budget: z.string().trim().optional(),
    source: z.string().trim().optional(),
    website: z.string().trim().optional().default(''),
  }),
});

const updateLeadStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['new', 'contacted', 'converted', 'lost'], {
      message: 'Status must be one of: new, contacted, converted, lost',
    }),
  }),
});

export const leadValidations = {
  createLeadValidationSchema,
  updateLeadStatusValidationSchema,
};
