import { Document, Model } from 'mongoose';

export interface TSocialLink {
  platform: string;
  url: string;
}

export interface TSettings {
  fbPixelId?: string;
  gaId?: string;
  gtmId?: string;
  searchConsoleTag?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  officeAddress?: string;
  socialLinks?: TSocialLink[];
}

export interface TSettingsDocument extends TSettings, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface TSettingsModel extends Model<TSettingsDocument> {}
