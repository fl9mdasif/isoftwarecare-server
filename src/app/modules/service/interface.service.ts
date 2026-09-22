import { Document, Model, Types } from 'mongoose';

export interface TService {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon?: string;
  category?: Types.ObjectId;
  order: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface TServiceDocument extends TService, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface TServiceModel extends Model<TServiceDocument> {}
