import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { portfolioServices } from './service.portfolio';

const createPortfolioItem = catchAsync(async (req, res) => {
  const result = await portfolioServices.createPortfolioItem(req.body);
  response.createSendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Portfolio item created successfully',
    data: result,
  });
});

const getAllPortfolioItems = catchAsync(async (req, res) => {
  const result = await portfolioServices.getAllPortfolioItems(req.query);
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio items retrieved successfully',
    data: result,
  });
});

const getSinglePortfolioItem = catchAsync(async (req, res) => {
  const result = await portfolioServices.getSinglePortfolioItem((req.params.portfolioId as string));
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio item retrieved successfully',
    data: result,
  });
});

const updatePortfolioItem = catchAsync(async (req, res) => {
  const result = await portfolioServices.updatePortfolioItem((req.params.portfolioId as string), req.body);
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio item updated successfully',
    data: result,
  });
});

const deletePortfolioItem = catchAsync(async (req, res) => {
  const result = await portfolioServices.deletePortfolioItem((req.params.portfolioId as string));
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio item deleted successfully',
    data: result,
  });
});

export const portfolioControllers = {
  createPortfolioItem,
  getAllPortfolioItems,
  getSinglePortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
};
