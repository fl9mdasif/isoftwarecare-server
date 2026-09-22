import { Schema, model } from 'mongoose';
import { TLeadDocument, TLeadModel } from './interface.lead';

const leadSchema = new Schema<TLeadDocument, TLeadModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    serviceInterested: { type: Schema.Types.ObjectId, ref: 'Service' },
    budget: { type: String, trim: true },
    status: { type: String, enum: ['new', 'contacted', 'converted', 'lost'], default: 'new' },
    source: { type: String, trim: true },
    // Internal only — never selected into any response a public route can hit.
    note: { type: String },
  },
  { timestamps: true },
);

export const Lead = model<TLeadDocument, TLeadModel>('Lead', leadSchema);
