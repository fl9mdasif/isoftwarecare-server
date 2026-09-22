import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import slugify from '../../utils/slugify';
import { TPortfolioItem } from './interface.portfolio';
import { PortfolioItem } from './model.portfolio';

const createPortfolioItem = async (payload: TPortfolioItem) => {
  payload.slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);

  const existingSlug = await PortfolioItem.findOne({ slug: payload.slug });
  if (existingSlug) {
    throw new AppError(httpStatus.CONFLICT, `A portfolio item with slug '${payload.slug}' already exists.`, 'Duplicate slug');
  }

  return PortfolioItem.create(payload);
};

const getAllPortfolioItems = async (query: Record<string, unknown>) => {
  const { category, isFeatured } = query;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (category) filter.category = category;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true' || isFeatured === true;

  return PortfolioItem.find(filter).sort({ order: 1 }).populate('category', 'name slug');
};

const getSinglePortfolioItem = async (idOrSlug: string) => {
  const isObjectId = /^[a-f\d]{24}$/i.test(idOrSlug);
  const item = isObjectId
    ? await PortfolioItem.findById(idOrSlug).populate('category', 'name slug')
    : await PortfolioItem.findOne({ slug: idOrSlug }).populate('category', 'name slug');

  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, 'Portfolio item not found', 'Portfolio item not found');
  }
  return item;
};

const updatePortfolioItem = async (id: string, payload: Partial<TPortfolioItem>) => {
  if (payload.slug) {
    payload.slug = slugify(payload.slug);
    const existingSlug = await PortfolioItem.findOne({ slug: payload.slug, _id: { $ne: id } });
    if (existingSlug) {
      throw new AppError(httpStatus.CONFLICT, `A portfolio item with slug '${payload.slug}' already exists.`, 'Duplicate slug');
    }
  }

  const updated = await PortfolioItem.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Portfolio item not found', 'Portfolio item not found');
  }
  return updated;
};

const deletePortfolioItem = async (id: string) => {
  const deleted = await PortfolioItem.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Portfolio item not found', 'Portfolio item not found');
  }
  return deleted;
};

export const portfolioServices = {
  createPortfolioItem,
  getAllPortfolioItems,
  getSinglePortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
};
