import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, { message: 'Invalid id' });

const createTestimonialValidationSchema = z.object({
  body: z.object({
    clientName: z.string({ message: 'Client name is required' }).trim().min(1),
    clientRole: z.string().trim().optional(),
    clientCompany: z.string().trim().optional(),
    photo: z.string().optional(),
    quote: z.string({ message: 'Quote is required' }).trim().min(1),
    rating: z.number({ message: 'Rating is required' }).int().min(1).max(5),
    relatedPortfolioItem: objectId.optional(),
    isFeatured: z.boolean().optional().default(false),
  }),
});

const updateTestimonialValidationSchema = z.object({
  body: z
    .object({
      clientName: z.string().trim().min(1).optional(),
      clientRole: z.string().trim().optional(),
      clientCompany: z.string().trim().optional(),
      photo: z.string().optional(),
      quote: z.string().trim().min(1).optional(),
      rating: z.number().int().min(1).max(5).optional(),
      relatedPortfolioItem: objectId.optional(),
      isFeatured: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    }),
});

export const testimonialValidations = {
  createTestimonialValidationSchema,
  updateTestimonialValidationSchema,
};
