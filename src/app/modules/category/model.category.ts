import { Schema, model } from 'mongoose';
import { TCategoryDocument, TCategoryModel } from './interface.category';

const categorySchema = new Schema<TCategoryDocument, TCategoryModel>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    thumbnail: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Category = model<TCategoryDocument, TCategoryModel>('Category', categorySchema);
