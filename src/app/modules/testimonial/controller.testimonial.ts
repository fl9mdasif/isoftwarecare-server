import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { testimonialServices } from './service.testimonial';

const createTestimonial = catchAsync(async (req, res) => {
  const result = await testimonialServices.createTestimonial(req.body);
  response.createSendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Testimonial created successfully',
    data: result,
  });
});

const getApprovedTestimonials = catchAsync(async (req, res) => {
  const result = await testimonialServices.getApprovedTestimonials();
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonials retrieved successfully',
    data: result,
  });
});

const getAllTestimonials = catchAsync(async (req, res) => {
  const result = await testimonialServices.getAllTestimonials(req.query);
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonials retrieved successfully',
    data: result,
  });
});

const updateTestimonial = catchAsync(async (req, res) => {
  const result = await testimonialServices.updateTestimonial((req.params.testimonialId as string), req.body);
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial updated successfully',
    data: result,
  });
});

const approveTestimonial = catchAsync(async (req, res) => {
  const result = await testimonialServices.approveTestimonial((req.params.testimonialId as string));
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial approved successfully',
    data: result,
  });
});

const deleteTestimonial = catchAsync(async (req, res) => {
  const result = await testimonialServices.deleteTestimonial((req.params.testimonialId as string));
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial deleted successfully',
    data: result,
  });
});

export const testimonialControllers = {
  createTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  updateTestimonial,
  approveTestimonial,
  deleteTestimonial,
};
