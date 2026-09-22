import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { settingsServices } from './service.settings';

const getSettings = catchAsync(async (req, res) => {
  const result = await settingsServices.getSettings();
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Settings retrieved successfully',
    data: result,
  });
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await settingsServices.updateSettings(req.body);
  response.createSendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Settings updated successfully',
    data: result,
  });
});

export const settingsControllers = {
  getSettings,
  updateSettings,
};
