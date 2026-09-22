import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../auth/const.auth';
import { serviceControllers } from './controller.service';
import { serviceValidations } from './validation.service';

const router = express.Router();

// Static paths before the dynamic :serviceId route.
router.get(
  '/admin/all',
  auth(USER_ROLE.staff, USER_ROLE.admin, USER_ROLE.superAdmin),
  serviceControllers.getAllServicesAdmin,
);

// GET /api/v1/services — public, active only
router.get('/', serviceControllers.getAllServices);

// GET /api/v1/services/:serviceId — public (accepts ObjectId or slug)
router.get('/:serviceId', serviceControllers.getSingleService);

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(serviceValidations.createServiceValidationSchema),
  serviceControllers.createService,
);

router.patch(
  '/:serviceId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(serviceValidations.updateServiceValidationSchema),
  serviceControllers.updateService,
);

router.delete('/:serviceId', auth(USER_ROLE.admin, USER_ROLE.superAdmin), serviceControllers.deleteService);

export const serviceRoutes = router;
