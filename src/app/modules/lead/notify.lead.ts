import config from '../../config';
import { escapeHtml, sendMail } from '../../utils/mailer';
import { TLeadDocument } from './interface.lead';

const BRAND = 'Interactive Software Care';
const ACCENT = '#2EE6C5';

const row = (label: string, value?: string) =>
  value
    ? `<tr>
         <td style="padding:6px 16px 6px 0;color:#8590a2;font-size:13px;vertical-align:top;white-space:nowrap">${label}</td>
         <td style="padding:6px 0;color:#12151d;font-size:14px;font-weight:600">${escapeHtml(value)}</td>
       </tr>`
    : '';

const shell = (inner: string) => `
<div style="background:#f4f6fa;padding:28px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e4e8ef">
    <div style="background:#06070a;padding:20px 24px">
      <span style="color:#fff;font-size:15px;font-weight:700;letter-spacing:-.01em">${BRAND}</span>
    </div>
    <div style="padding:24px">${inner}</div>
  </div>
</div>`;

/** The internal alert: everything needed to reply without opening a dashboard. */
const internalAlert = (lead: TLeadDocument, serviceTitle?: string) =>
  shell(`
    <h1 style="margin:0 0 4px;font-size:18px;color:#12151d">New lead from the website</h1>
    <p style="margin:0 0 18px;font-size:13px;color:#8590a2">
      Submitted ${lead.createdAt.toUTCString()}
    </p>
    <table style="border-collapse:collapse;width:100%;margin-bottom:18px">
      ${row('Name', lead.name)}
      ${row('Email', lead.email)}
      ${row('Phone', lead.phone)}
      ${row('Service', serviceTitle)}
      ${row('Budget', lead.budget)}
      ${row('Source', lead.source)}
    </table>
    <div style="border-left:3px solid ${ACCENT};padding:2px 0 2px 14px;margin-bottom:22px">
      <div style="font-size:12px;color:#8590a2;margin-bottom:6px">Project details</div>
      <div style="font-size:14px;color:#12151d;line-height:1.6;white-space:pre-wrap">${escapeHtml(lead.message)}</div>
    </div>
    <a href="mailto:${encodeURIComponent(lead.email)}"
       style="display:inline-block;background:#12151d;color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 18px;border-radius:9px">
      Reply to ${escapeHtml(lead.name)}
    </a>
  `);

/** The prospect's confirmation. Mirrors the promise made on the contact page. */
const autoReply = (lead: TLeadDocument, replyTo: string) =>
  shell(`
    <h1 style="margin:0 0 12px;font-size:18px;color:#12151d">Thanks, we've got your message.</h1>
    <p style="margin:0 0 14px;font-size:14px;color:#454d5c;line-height:1.65">
      Hi ${escapeHtml(lead.name.split(' ')[0] || lead.name)}, thanks for reaching out to ${BRAND}.
    </p>
    <p style="margin:0 0 14px;font-size:14px;color:#454d5c;line-height:1.65">
      An engineer — not a sales rep — will read this and reply within one business day with next steps,
      a rough scope, and any questions we have. If it's urgent, just reply to this email.
    </p>
    <div style="border-left:3px solid ${ACCENT};padding:2px 0 2px 14px;margin:20px 0">
      <div style="font-size:12px;color:#8590a2;margin-bottom:6px">What you sent us</div>
      <div style="font-size:13px;color:#454d5c;line-height:1.6;white-space:pre-wrap">${escapeHtml(lead.message)}</div>
    </div>
    <p style="margin:0;font-size:13px;color:#8590a2">
      — The ${BRAND} team${replyTo ? ` · <a href="mailto:${replyTo}" style="color:#12151d">${replyTo}</a>` : ''}
    </p>
  `);

/**
 * Fires the two lead emails. Awaited by the caller so the work completes before
 * a serverless function freezes, but failures are swallowed — the lead is
 * already in the database and the prospect must still see a success response.
 */
export const notifyNewLead = async (lead: TLeadDocument, serviceTitle?: string) => {
  const inbox = config.notify_email || config.admin_email;
  const tasks: Promise<boolean>[] = [];

  if (inbox) {
    tasks.push(
      sendMail({
        to: inbox,
        subject: `New lead: ${lead.name}${serviceTitle ? ` — ${serviceTitle}` : ''}`,
        body: internalAlert(lead, serviceTitle),
        replyTo: lead.email,
      }),
    );
  } else {
    console.warn('[notifyNewLead] No NOTIFY_EMAIL or ADMIN_EMAIL configured — internal alert not sent.');
  }

  tasks.push(
    sendMail({
      to: lead.email,
      subject: `We received your message — ${BRAND}`,
      body: autoReply(lead, inbox ?? ''),
      replyTo: inbox,
    }),
  );

  await Promise.allSettled(tasks);
};
