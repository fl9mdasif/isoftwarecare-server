import { Schema, model } from 'mongoose';
import { TTestimonialDocument, TTestimonialModel } from './interface.testimonial';

const testimonialSchema = new Schema<TTestimonialDocument, TTestimonialModel>(
  {
    clientName: { type: String, required: true, trim: true },
    clientRole: { type: String, trim: true },
    clientCompany: { type: String, trim: true },
    photo: { type: String },
    quote: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    relatedPortfolioItem: { type: Schema.Types.ObjectId, ref: 'PortfolioItem' },
    // Deliberately never defaults to true — approval is a staff/admin action,
    // a testimonial never appears publicly the moment it's created.
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Testimonial = model<TTestimonialDocument, TTestimonialModel>('Testimonial', testimonialSchema);
