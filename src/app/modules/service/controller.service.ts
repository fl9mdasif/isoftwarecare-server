import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { serviceServices } from './service.service';

const createService = catchAsync(async (req, res) => {
  const result = await serviceServices.createService(req.body);
  response.createSendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

const getAllServices = catchAsync(async (req, res) => {
  const result = await serviceServices.getAllServices();
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services retrieved successfully',
    data: result,
  });
});

const getAllServicesAdmin = catchAsync(async (req, res) => {
  const result = await serviceServices.getAllServicesAdmin();
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services retrieved successfully',
    data: result,
  });
});

const getSingleService = catchAsync(async (req, res) => {
  const result = await serviceServices.getSingleService((req.params.serviceId as string));
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service retrieved successfully',
    data: result,
  });
});

const updateService = catchAsync(async (req, res) => {
  const result = await serviceServices.updateService((req.params.serviceId as string), req.body);
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});

const deleteService = catchAsync(async (req, res) => {
  const result = await serviceServices.deleteService((req.params.serviceId as string));
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});

export const serviceControllers = {
  createService,
  getAllServices,
  getAllServicesAdmin,
  getSingleService,
  updateService,
  deleteService,
};
