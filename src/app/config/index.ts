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
  // Where new-lead alerts are delivered. Falls back to ADMIN_EMAIL.
  notify_email: process.env.NOTIFY_EMAIL,
  // Gmail SMTP. GMAIL_APP_PASSWORD is a Google App Password (needs 2-Step
  // Verification on the account) — never the account password. Without these,
  // lead emails are skipped and logged rather than failing the request.
  gmail_user: process.env.GMAIL_USER,
  gmail_app_password: process.env.GMAIL_APP_PASSWORD,
  // Defaults to GMAIL_USER. Gmail only allows sending as a verified alias.
  mail_from: process.env.MAIL_FROM,
  mail_from_name: process.env.MAIL_FROM_NAME || 'Interactive Software Care',
  // Base URL of the public site — used to build absolute <loc> entries in sitemap.xml.
  site_url: process.env.SITE_URL || 'https://example.com',
  // Comma-separated list of allowed CORS origins for the deployed client,
  // e.g. "https://interactivesoftwarecare.com,https://www.interactivesoftwarecare.com"
  client_urls: (process.env.CLIENT_URL ?? '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
};
