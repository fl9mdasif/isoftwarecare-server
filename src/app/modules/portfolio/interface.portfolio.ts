import { Document, Model, Types } from 'mongoose';

export interface TPortfolioItem {
  title: string;
  slug: string;
  client?: string;
  description: string;
  techStack: string[];
  thumbnail: string;
  gallery?: string[];
  liveUrl?: string;
  category: Types.ObjectId;
  isFeatured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface TPortfolioItemDocument extends TPortfolioItem, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface TPortfolioItemModel extends Model<TPortfolioItemDocument> {}
