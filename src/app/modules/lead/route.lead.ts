import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { leadRateLimiter } from '../../middlewares/rateLimiters';
import { USER_ROLE } from '../auth/const.auth';
import { leadControllers } from './controller.lead';
import { leadValidations } from './validation.lead';

const router = express.Router();

// POST /api/v1/leads — public, the single open write endpoint on the whole
// site. Rate-limited, Zod-validated, honeypot-checked in the service.
router.post(
  '/',
  leadRateLimiter,
  validateRequest(leadValidations.createLeadValidationSchema),
  leadControllers.createLead,
);

router.get('/', auth(USER_ROLE.staff, USER_ROLE.admin, USER_ROLE.superAdmin), leadControllers.getAllLeads);

router.patch(
  '/:leadId/status',
  auth(USER_ROLE.staff, USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(leadValidations.updateLeadStatusValidationSchema),
  leadControllers.updateLeadStatus,
);

export const leadRoutes = router;
