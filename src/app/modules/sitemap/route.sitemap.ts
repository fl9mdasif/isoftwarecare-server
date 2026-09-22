import express from 'express';
import { sitemapControllers } from './controller.sitemap';

const router = express.Router();

// Mounted at the app root as GET /sitemap.xml, not under /api/v1 — see app.ts.
router.get('/', sitemapControllers.getSitemap);

export const sitemapRoutes = router;
