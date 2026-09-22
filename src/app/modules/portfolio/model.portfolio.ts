import { Schema, model } from 'mongoose';
import { TPortfolioItemDocument, TPortfolioItemModel } from './interface.portfolio';

const portfolioSchema = new Schema<TPortfolioItemDocument, TPortfolioItemModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    client: { type: String, trim: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    thumbnail: { type: String, required: true },
    gallery: { type: [String], default: [] },
    liveUrl: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true },
);

export const PortfolioItem = model<TPortfolioItemDocument, TPortfolioItemModel>('PortfolioItem', portfolioSchema);
