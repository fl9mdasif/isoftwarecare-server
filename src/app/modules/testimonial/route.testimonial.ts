import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../auth/const.auth';
import { testimonialControllers } from './controller.testimonial';
import { testimonialValidations } from './validation.testimonial';

const router = express.Router();

// Static path before the dynamic :testimonialId route.
router.get(
  '/admin/all',
  auth(USER_ROLE.staff, USER_ROLE.admin, USER_ROLE.superAdmin),
  testimonialControllers.getAllTestimonials,
);

// GET /api/v1/testimonials — public, approved only
router.get('/', testimonialControllers.getApprovedTestimonials);

router.post(
  '/',
  auth(USER_ROLE.staff, USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(testimonialValidations.createTestimonialValidationSchema),
  testimonialControllers.createTestimonial,
);

router.patch(
  '/:testimonialId',
  auth(USER_ROLE.staff, USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(testimonialValidations.updateTestimonialValidationSchema),
  testimonialControllers.updateTestimonial,
);

router.patch(
  '/:testimonialId/approve',
  auth(USER_ROLE.staff, USER_ROLE.admin, USER_ROLE.superAdmin),
  testimonialControllers.approveTestimonial,
);

// Delete stays admin/superAdmin only — staff has no delete access on published content.
router.delete(
  '/:testimonialId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  testimonialControllers.deleteTestimonial,
);

export const testimonialRoutes = router;
