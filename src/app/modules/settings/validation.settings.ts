import { z } from 'zod';

const updateSettingsValidationSchema = z.object({
  body: z
    .object({
      fbPixelId: z.string().trim().optional(),
      gaId: z.string().trim().optional(),
      gtmId: z.string().trim().optional(),
      searchConsoleTag: z.string().trim().optional(),
      contactEmail: z.string().trim().email().optional(),
      contactPhone: z.string().trim().optional(),
      whatsappNumber: z.string().trim().optional(),
      officeAddress: z.string().trim().optional(),
      socialLinks: z
        .array(
          z.object({
            platform: z.string().trim().min(1),
            url: z.string().trim().url(),
          }),
        )
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    }),
});

export const settingsValidations = {
  updateSettingsValidationSchema,
};
