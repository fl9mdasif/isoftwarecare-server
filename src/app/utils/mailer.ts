import config from '../config';

const PLUNK_ENDPOINT = 'https://api.useplunk.com/v1/send';

type TMailInput = {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
};

/**
 * Sends one transactional email through Plunk.
 *
 * Never throws and never rejects: every caller sits on a request path whose
 * primary job (persisting a lead) has already succeeded, so a mail outage must
 * not turn a captured lead into a 500 for the prospect. Failures are logged and
 * reported through the boolean return.
 */
export const sendMail = async ({ to, subject, body, replyTo }: TMailInput): Promise<boolean> => {
  if (!config.plunk_secret_key) {
    console.warn('[mailer] PLUNK_SECRET_KEY is not set — skipping email:', subject);
    return false;
  }

  try {
    const res = await fetch(PLUNK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.plunk_secret_key}`,
      },
      body: JSON.stringify({
        to,
        subject,
        body,
        subscribed: false,
        ...(config.mail_from ? { from: config.mail_from, name: config.mail_from_name } : {}),
        ...(replyTo ? { reply: replyTo } : {}),
      }),
      // Plunk occasionally stalls; a hung request would hold the lead response open.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error(`[mailer] Plunk rejected "${subject}" with ${res.status}: ${await res.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`[mailer] Plunk request failed for "${subject}":`, error);
    return false;
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
