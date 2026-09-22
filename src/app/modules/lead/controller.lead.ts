import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { leadServices } from './service.lead';

// Always answers with the same "thanks" shape, whether the submission was
// real or silently dropped as spam (service returns null for the honeypot
// case) — a bot probing the endpoint learns nothing from the response.
const createLead = catchAsync(async (req, res) => {
  await leadServices.createLead(req.body);
  response.createSendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Thanks for reaching out! We will get back to you shortly.',
    data: null,
  });
});

const getAllLeads = catchAsync(async (req, res) => {
  const result = await leadServices.getAllLeads(req.query);
  response.getSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Leads retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const updateLeadStatus = catchAsync(async (req, res) => {
  const result = await leadServices.updateLeadStatus((req.params.leadId as string), req.body.status);
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Lead status updated successfully',
    data: result,
  });
});

export const leadControllers = {
  createLead,
  getAllLeads,
  updateLeadStatus,
};
