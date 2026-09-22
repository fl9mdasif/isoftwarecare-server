import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, { message: 'Invalid id' });

const createPortfolioValidationSchema = z.object({
  body: z.object({
    title: z.string({ message: 'Title is required' }).trim().min(1),
    slug: z
      .string()
      .trim()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must be lowercase letters, numbers, and hyphens only',
      })
      .optional(),
    client: z.string().trim().optional(),
    description: z.string({ message: 'Description is required' }).trim().min(1),
    techStack: z.array(z.string()).optional().default([]),
    thumbnail: z.string({ message: 'Thumbnail is required' }).trim().min(1),
    gallery: z.array(z.string()).optional().default([]),
    liveUrl: z.string().url().optional(),
    category: objectId,
    isFeatured: z.boolean().optional().default(false),
    order: z.number().int().optional().default(0),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const updatePortfolioValidationSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1).optional(),
      slug: z
        .string()
        .trim()
        .min(1)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
          message: 'Slug must be lowercase letters, numbers, and hyphens only',
        })
        .optional(),
      client: z.string().trim().optional(),
      description: z.string().trim().min(1).optional(),
      techStack: z.array(z.string()).optional(),
      thumbnail: z.string().trim().min(1).optional(),
      gallery: z.array(z.string()).optional(),
      liveUrl: z.string().url().optional(),
      category: objectId.optional(),
      isFeatured: z.boolean().optional(),
      order: z.number().int().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    }),
});

export const portfolioValidations = {
  createPortfolioValidationSchema,
  updatePortfolioValidationSchema,
};
