import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, { message: 'Invalid id' });

const createServiceValidationSchema = z.object({
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
    shortDescription: z.string({ message: 'Short description is required' }).trim().min(1),
    fullDescription: z.string({ message: 'Full description is required' }).trim().min(1),
    icon: z.string().optional(),
    category: objectId.optional(),
    order: z.number().int().optional().default(0),
    isActive: z.boolean().optional().default(true),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const updateServiceValidationSchema = z.object({
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
      shortDescription: z.string().trim().min(1).optional(),
      fullDescription: z.string().trim().min(1).optional(),
      icon: z.string().optional(),
      category: objectId.optional(),
      order: z.number().int().optional(),
      isActive: z.boolean().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    }),
});

export const serviceValidations = {
  createServiceValidationSchema,
  updateServiceValidationSchema,
};
