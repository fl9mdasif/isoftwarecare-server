import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../auth/const.auth';
import { portfolioControllers } from './controller.portfolio';
import { portfolioValidations } from './validation.portfolio';

const router = express.Router();

// GET /api/v1/portfolio — public
router.get('/', portfolioControllers.getAllPortfolioItems);

// GET /api/v1/portfolio/:portfolioId — public (accepts ObjectId or slug)
router.get('/:portfolioId', portfolioControllers.getSinglePortfolioItem);

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(portfolioValidations.createPortfolioValidationSchema),
  portfolioControllers.createPortfolioItem,
);

router.patch(
  '/:portfolioId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(portfolioValidations.updatePortfolioValidationSchema),
  portfolioControllers.updatePortfolioItem,
);

router.delete('/:portfolioId', auth(USER_ROLE.admin, USER_ROLE.superAdmin), portfolioControllers.deletePortfolioItem);

export const portfolioRoutes = router;
