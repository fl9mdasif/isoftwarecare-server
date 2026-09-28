import config from '../../config';
import { Service } from '../service/model.service';
import { PortfolioItem } from '../portfolio/model.portfolio';

const escapeXml = (value: string) => value.replace(/&/g, '&amp;');

const urlEntry = (loc: string, lastmod?: Date) => `
  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod.toISOString()}</lastmod>` : ''}
  </url>`;

const generateSitemap = async () => {
  const base = config.site_url.replace(/\/$/, '');

  const [services, portfolioItems] = await Promise.all([
    Service.find({ isActive: true }).select('slug updatedAt'),
    PortfolioItem.find({}).select('slug updatedAt'),
  ]);

  // These paths must match the client's App Router routes exactly. The portfolio
  // module is exposed to visitors as /work, not /portfolio.
  const staticEntries = [
    urlEntry(`${base}/`),
    urlEntry(`${base}/services`),
    urlEntry(`${base}/work`),
    urlEntry(`${base}/book`),
    urlEntry(`${base}/contact`),
  ];

  const serviceEntries = services.map((s) => urlEntry(`${base}/services/${s.slug}`, s.updatedAt));
  const portfolioEntries = portfolioItems.map((p) => urlEntry(`${base}/work/${p.slug}`, p.updatedAt));

  const body = [...staticEntries, ...serviceEntries, ...portfolioEntries].join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}
</urlset>`;
};

export const sitemapServices = {
  generateSitemap,
};
