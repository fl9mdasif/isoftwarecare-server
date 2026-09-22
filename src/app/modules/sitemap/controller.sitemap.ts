import catchAsync from '../../utils/catchAsync';
import { sitemapServices } from './service.sitemap';

const getSitemap = catchAsync(async (req, res) => {
  const xml = await sitemapServices.generateSitemap();
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

export const sitemapControllers = {
  getSitemap,
};
