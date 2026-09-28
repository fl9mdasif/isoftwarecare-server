import nodemailer, { Transporter } from 'nodemailer';
import config from '../config';

type TMailInput = {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
};

let transporter: Transporter | null = null;

/**
 * Gmail SMTP transport, created once and reused.
 *
 * Gmail requires an App Password (not the account password), which means 2-Step
 * Verification must be on for the account. Google renders App Passwords in
 * four space-separated blocks — people paste them exactly as shown, so the
 * spaces are stripped here rather than left to fail as a bad credential.
 */
const getTransporter = (): Transporter | null => {
  if (transporter) return transporter;
  if (!config.gmail_user || !config.gmail_app_password) return null;

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.gmail_user,
      pass: config.gmail_app_password.replace(/\s+/g, ''),
    },
  });

  return transporter;
};

/**
 * Sends one transactional email.
 *
 * Never throws and never rejects: every caller sits on a request path whose
 * primary job (persisting a lead) has already succeeded, so a mail outage must
 * not turn a captured lead into a 500 for the prospect. Failures are logged and
 * reported through the boolean return.
 */
export const sendMail = async ({ to, subject, body, replyTo }: TMailInput): Promise<boolean> => {
  const mail = getTransporter();

  if (!mail) {
    console.warn(`[mailer] GMAIL_USER / GMAIL_APP_PASSWORD not set — skipping email: ${subject}`);
    return false;
  }

  try {
    const info = await mail.sendMail({
      from: `"${config.mail_from_name}" <${config.mail_from || config.gmail_user}>`,
      to,
      subject,
      html: body,
      ...(replyTo ? { replyTo } : {}),
    });
    console.log(`[mailer] sent "${subject}" to ${to} (${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`[mailer] failed to send "${subject}" to ${to}:`, (error as Error).message);
    return false;
  }
};

/** Verifies the SMTP credentials without sending anything. */
export const verifyMailer = async (): Promise<{ ok: boolean; message: string }> => {
  const mail = getTransporter();
  if (!mail) return { ok: false, message: 'GMAIL_USER / GMAIL_APP_PASSWORD are not set in .env' };

  try {
    await mail.verify();
    return { ok: true, message: `SMTP login succeeded as ${config.gmail_user}` };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
};

/** Minimal HTML escape for values interpolated into email bodies. */
export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
