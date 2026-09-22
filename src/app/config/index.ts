import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(process.cwd(), '.env') });
} else {
  dotenv.config();
}

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_pass: process.env.SUPER_ADMIN_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  admin_email: process.env.ADMIN_EMAIL,
  // Base URL of the public site — used to build absolute <loc> entries in sitemap.xml.
  site_url: process.env.SITE_URL || 'https://example.com',
  // Comma-separated list of allowed CORS origins for the deployed client,
  // e.g. "https://interactivesoftwarecare.com,https://www.interactivesoftwarecare.com"
  client_urls: (process.env.CLIENT_URL ?? '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
};
