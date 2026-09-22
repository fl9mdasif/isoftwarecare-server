import { Document, Model, Types } from 'mongoose';

export type TLeadStatus = 'new' | 'contacted' | 'converted' | 'lost';

export interface TLead {
  name: string;
  email: string;
  phone?: string;
  message: string;
  serviceInterested?: Types.ObjectId;
  budget?: string;
  status: TLeadStatus;
  source?: string;
  note?: string;
}

export interface TLeadDocument extends TLead, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface TLeadModel extends Model<TLeadDocument> {}
