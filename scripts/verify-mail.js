/* eslint-disable no-console */
/**
 * Gmail SMTP credential checker.
 *
 *   npm run verify:mail              # log in to SMTP only, sends nothing
 *   npm run verify:mail -- --send    # also send one real test email
 *
 * nodemailer's verify() performs a full SMTP handshake and authentication
 * without queuing a message, so a bad App Password fails here in a second
 * instead of silently swallowing lead notifications in production.
 */
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
const nodemailer = require('nodemailer');

const user = process.env.GMAIL_USER;
const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
const inbox = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
const from = process.env.MAIL_FROM || user;
const fromName = process.env.MAIL_FROM_NAME || 'Interactive Software Care';
const shouldSend = process.argv.includes('--send');

const line = (label, value) => console.log(`  ${label.padEnd(20)} ${value}`);

async function main() {
  console.log('\nGmail SMTP check\n' + '='.repeat(46));
  line('GMAIL_USER', user || 'MISSING');
  line('GMAIL_APP_PASSWORD', pass ? `${pass.length} chars${pass.length === 16 ? ' (ok)' : ' (expected 16)'}` : 'MISSING');
  line('sends as', from || '-');
  line('alert inbox', inbox || 'NONE (set NOTIFY_EMAIL or ADMIN_EMAIL)');

  if (!user || !pass) {
    console.log('\n  FAIL: add GMAIL_USER and GMAIL_APP_PASSWORD to .env.');
    console.log('  App password: myaccount.google.com -> Security -> App passwords');
    console.log('  (2-Step Verification must be enabled first.)\n');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  console.log('-'.repeat(46));

  try {
    await transporter.verify();
    console.log(`  PASS: SMTP login succeeded as ${user}.`);
  } catch (err) {
    console.log('  FAIL: SMTP login rejected.');
    console.log(`  Google said: ${err.message}`);
    console.log('\n  Usual causes:');
    console.log('   - Using the Gmail password instead of an App Password');
    console.log('   - 2-Step Verification not enabled on the account');
    console.log('   - App Password revoked, or generated for a different account\n');
    process.exit(1);
  }

  if (!shouldSend) {
    console.log('  No email sent. Re-run with --send to deliver a test message.\n');
    return;
  }
  if (!inbox) {
    console.log('  Cannot send: no NOTIFY_EMAIL or ADMIN_EMAIL set.\n');
    process.exit(1);
  }

  const info = await transporter.sendMail({
    from: `"${fromName}" <${from}>`,
    to: inbox,
    subject: 'Mail setup test',
    html: '<p>Your Gmail SMTP credentials work. Lead notifications will be delivered.</p>',
  });

  console.log(`  SENT: test email dispatched to ${inbox} (${info.messageId}).`);
  console.log('  Not there within a minute? Check spam.\n');
}

main().catch((err) => {
  console.error('\n  Unexpected failure:', err.message, '\n');
  process.exit(1);
});
