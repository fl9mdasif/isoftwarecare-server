import { Schema, model } from 'mongoose';
import { TServiceDocument, TServiceModel } from './interface.service';

const serviceSchema = new Schema<TServiceDocument, TServiceModel>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, required: true },
    icon: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true },
);

export const Service = model<TServiceDocument, TServiceModel>('Service', serviceSchema);
