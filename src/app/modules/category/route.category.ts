import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../auth/const.auth';
import { categoryControllers } from './controller.category';
import { categoryValidations } from './validation.category';

const router = express.Router();

// GET /api/v1/categories — public
router.get('/', categoryControllers.getAllCategories);

// GET /api/v1/categories/:categoryId — public (accepts ObjectId or slug)
router.get('/:categoryId', categoryControllers.getSingleCategory);

// POST /api/v1/categories — admin / superAdmin only
router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(categoryValidations.createCategoryValidationSchema),
  categoryControllers.createCategory,
);

// PATCH /api/v1/categories/:categoryId — admin / superAdmin only
router.patch(
  '/:categoryId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(categoryValidations.updateCategoryValidationSchema),
  categoryControllers.updateCategory,
);

// PATCH /api/v1/categories/:categoryId/toggle-status — admin / superAdmin only
router.patch(
  '/:categoryId/toggle-status',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  categoryControllers.toggleCategoryStatus,
);

// DELETE /api/v1/categories/:categoryId — admin / superAdmin only
router.delete(
  '/:categoryId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  categoryControllers.deleteCategory,
);

export const categoryRoutes = router;
