import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { TTestimonial } from './interface.testimonial';
import { Testimonial } from './model.testimonial';

const createTestimonial = async (payload: TTestimonial) => {
  return Testimonial.create(payload);
};

// Public: approved only.
const getApprovedTestimonials = async () => {
  return Testimonial.find({ isApproved: true }).sort({ createdAt: -1 }).populate('relatedPortfolioItem', 'title slug');
};

// Staff/admin: every testimonial regardless of approval state.
const getAllTestimonials = async (query: Record<string, unknown>) => {
  const { isApproved } = query;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (isApproved !== undefined) filter.isApproved = isApproved === 'true' || isApproved === true;

  return Testimonial.find(filter).sort({ createdAt: -1 }).populate('relatedPortfolioItem', 'title slug');
};

const updateTestimonial = async (id: string, payload: Partial<TTestimonial>) => {
  const updated = await Testimonial.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Testimonial not found', 'Testimonial not found');
  }
  return updated;
};

const approveTestimonial = async (id: string) => {
  const updated = await Testimonial.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Testimonial not found', 'Testimonial not found');
  }
  return updated;
};

const deleteTestimonial = async (id: string) => {
  const deleted = await Testimonial.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Testimonial not found', 'Testimonial not found');
  }
  return deleted;
};

export const testimonialServices = {
  createTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  updateTestimonial,
  approveTestimonial,
  deleteTestimonial,
};
