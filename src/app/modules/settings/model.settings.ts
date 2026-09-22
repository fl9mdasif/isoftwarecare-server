import { Schema, model } from 'mongoose';
import { TSettingsDocument, TSettingsModel } from './interface.settings';

const socialLinkSchema = new Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

// Singleton document — exactly one Settings row ever exists, see service.settings.ts.
const settingsSchema = new Schema<TSettingsDocument, TSettingsModel>(
  {
    fbPixelId: { type: String },
    gaId: { type: String },
    gtmId: { type: String },
    searchConsoleTag: { type: String },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    whatsappNumber: { type: String, trim: true },
    officeAddress: { type: String, trim: true },
    socialLinks: { type: [socialLinkSchema], default: [] },
  },
  { timestamps: true },
);

export const Settings = model<TSettingsDocument, TSettingsModel>('Settings', settingsSchema);
