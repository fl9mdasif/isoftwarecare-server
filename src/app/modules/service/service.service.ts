import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import slugify from '../../utils/slugify';
import { TService } from './interface.service';
import { Service } from './model.service';

const createService = async (payload: TService) => {
  payload.slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);

  const existingSlug = await Service.findOne({ slug: payload.slug });
  if (existingSlug) {
    throw new AppError(httpStatus.CONFLICT, `A service with slug '${payload.slug}' already exists.`, 'Duplicate slug');
  }

  return Service.create(payload);
};

// Public: active services only, manually sorted.
const getAllServices = async () => {
  return Service.find({ isActive: true }).sort({ order: 1 }).populate('category', 'name slug');
};

// Admin: every service regardless of isActive.
const getAllServicesAdmin = async () => {
  return Service.find({}).sort({ order: 1 }).populate('category', 'name slug');
};

const getSingleService = async (idOrSlug: string) => {
  const isObjectId = /^[a-f\d]{24}$/i.test(idOrSlug);
  const service = isObjectId
    ? await Service.findById(idOrSlug).populate('category', 'name slug')
    : await Service.findOne({ slug: idOrSlug }).populate('category', 'name slug');

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found', 'Service not found');
  }
  return service;
};

const updateService = async (id: string, payload: Partial<TService>) => {
  if (payload.slug) {
    payload.slug = slugify(payload.slug);
    const existingSlug = await Service.findOne({ slug: payload.slug, _id: { $ne: id } });
    if (existingSlug) {
      throw new AppError(httpStatus.CONFLICT, `A service with slug '${payload.slug}' already exists.`, 'Duplicate slug');
    }
  }

  const updated = await Service.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found', 'Service not found');
  }
  return updated;
};

const deleteService = async (id: string) => {
  const deleted = await Service.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found', 'Service not found');
  }
  return deleted;
};

export const serviceServices = {
  createService,
  getAllServices,
  getAllServicesAdmin,
  getSingleService,
  updateService,
  deleteService,
};
