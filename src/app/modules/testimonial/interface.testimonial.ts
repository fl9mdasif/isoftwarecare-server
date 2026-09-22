import { Document, Model, Types } from 'mongoose';

export interface TTestimonial {
  clientName: string;
  clientRole?: string;
  clientCompany?: string;
  photo?: string;
  quote: string;
  rating: number;
  relatedPortfolioItem?: Types.ObjectId;
  isApproved: boolean;
  isFeatured: boolean;
}

export interface TTestimonialDocument extends TTestimonial, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface TTestimonialModel extends Model<TTestimonialDocument> {}
