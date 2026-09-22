import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { TLead, TLeadStatus } from './interface.lead';
import { Lead } from './model.lead';

type TCreateLeadInput = Pick<TLead, 'name' | 'email' | 'message'> &
  Partial<Pick<TLead, 'phone' | 'serviceInterested' | 'budget' | 'source'>> & {
    website?: string; // honeypot, never persisted
  };

// The one public write endpoint on the site — only ever builds the document
// from an explicit allowlist of fields. `status`/`note` are never taken from
// the caller, regardless of what a malicious client stuffs into the body.
const createLead = async (payload: TCreateLeadInput) => {
  if (payload.website) {
    // Honeypot tripped — silently drop the submission without telling the
    // bot anything went wrong, but don't hit the database with it.
    return null;
  }

  return Lead.create({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    message: payload.message,
    serviceInterested: payload.serviceInterested,
    budget: payload.budget,
    source: payload.source,
    status: 'new',
  });
};

const getAllLeads = async (query: Record<string, unknown>) => {
  const { status, search, page = 1, limit = 20 } = query;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (search) {
    const term = search as string;
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { email: { $regex: term, $options: 'i' } },
    ];
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('serviceInterested', 'title slug'),
    Lead.countDocuments(filter),
  ]);

  return {
    meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    data: leads,
  };
};

const updateLeadStatus = async (id: string, status: TLeadStatus) => {
  const updated = await Lead.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Lead not found', 'Lead not found');
  }
  return updated;
};

export const leadServices = {
  createLead,
  getAllLeads,
  updateLeadStatus,
};
