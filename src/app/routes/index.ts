import { Router } from 'express';
import { authRoute } from '../modules/auth/route.auth';
import { userRoutes } from '../modules/user/route.user';
import { categoryRoutes } from '../modules/category/route.category';
import { serviceRoutes } from '../modules/service/route.service';
import { portfolioRoutes } from '../modules/portfolio/route.portfolio';
import { testimonialRoutes } from '../modules/testimonial/route.testimonial';
import { leadRoutes } from '../modules/lead/route.lead';
import { settingsRoutes } from '../modules/settings/route.settings';

const router = Router();

const moduleRoute = [
  { path: '/auth', route: authRoute },
  { path: '/users', route: userRoutes },
  { path: '/categories', route: categoryRoutes },
  { path: '/services', route: serviceRoutes },
  { path: '/portfolio', route: portfolioRoutes },
  { path: '/testimonials', route: testimonialRoutes },
  { path: '/leads', route: leadRoutes },
  { path: '/settings', route: settingsRoutes },
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
