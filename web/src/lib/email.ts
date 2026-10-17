import { Resend } from 'resend';
import { company } from '@/content/site';
import {
  PROJECT_TYPE_LABELS,
  SIZE_RANGE_LABELS,
  type QuoteRequest,
} from './quote';
import { whatsappUrl } from './whatsapp';

/**
 * Lead delivery.
 *
 * Two messages leave this file per submission and they are NOT equally
 * important:
 *
 *   1. The notification to the company — this IS the lead. If it fails, the
 *      request must fail loudly, because a lost one is a lost job.
 *   2. The confirmation to the customer — courtesy. If it fails, the lead is
 *      still safe, so it must never take the submission down with it.
 *
 * `submitQuote` below encodes exactly that asymmetry.
 */

export interface Lead extends QuoteRequest {
  receivedAt: string;
}

/**
 * Until the domain is verified in Resend, only `onboarding@resend.dev` can send,
 * and it can only deliver to the address that owns the Resend account. Once the
 * DNS records are in place, set QUOTE_FROM_EMAIL to an address on the real
 * domain so customer-facing mail carries the company name.
 */
const FROM = process.env.QUOTE_FROM_EMAIL ?? 'onboarding@resend.dev';
const TO = process.env.QUOTE_TO_EMAIL ?? company.email;

let client: Resend | null = null;

function resend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('RESEND_API_KEY is not set — quote notifications cannot be sent.');
  }
  // Lazily constructed so a missing key surfaces on the first send, not at
  // build time when the env var legitimately may not be present.
  client ??= new Resend(key);
  return client;
}

/** "Jason · Dracut · Garage · 500 – 1,000 sq ft" — enough to triage without opening. */
function summarise(lead: Lead): string {
  return [
    lead.name,
    lead.location,
    PROJECT_TYPE_LABELS[lead.projectType],
    SIZE_RANGE_LABELS[lead.approximateSize],
  ]
    .filter(Boolean)
    .join(' · ');
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#111827;font-size:14px;">${escapeHtml(value)}</td>
    </tr>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function notificationHtml(lead: Lead): string {
  const contactRows = [
    lead.email && row('Email', lead.email),
    lead.phone && row('Phone', lead.phone),
  ]
    .filter(Boolean)
    .join('');

  return `
<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">New quote request</p>
  <h1 style="margin:0 0 20px;font-size:20px;color:#111827;">${escapeHtml(summarise(lead))}</h1>

  <table style="border-collapse:collapse;width:100%;">
    ${row('Name', lead.name)}
    ${contactRows}
    ${row('Location', lead.location || 'Not given')}
    ${row('Project', PROJECT_TYPE_LABELS[lead.projectType])}
    ${row('Size', SIZE_RANGE_LABELS[lead.approximateSize])}
    ${row('Photos offered', String(lead.photoCount))}
    ${row('Source', lead.source ?? 'landing-page')}
    ${row('Received', new Date(lead.receivedAt).toLocaleString('en-US', { timeZone: 'America/New_York' }))}
  </table>

  ${
    lead.message
      ? `<div style="margin-top:20px;padding:14px 16px;background:#f9fafb;border-left:3px solid #d1d5db;">
           <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(lead.message)}</p>
         </div>`
      : ''
  }

  ${
    lead.photoCount > 0
      ? `<p style="margin:20px 0 0;padding:12px 14px;background:#fffbeb;border:1px solid #fde68a;color:#92400e;font-size:13px;line-height:1.5;">
           This customer selected ${lead.photoCount} photo${lead.photoCount > 1 ? 's' : ''} but the form cannot upload files — ask for them on WhatsApp.
         </p>`
      : ''
  }

  <p style="margin:24px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
    Reply to this email to answer ${escapeHtml(lead.name)} directly${lead.email ? '' : ' — no email given, call or WhatsApp instead'}.
  </p>
</div>`;
}

function confirmationHtml(lead: Lead): string {
  return `
<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;">
  <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">Thanks, ${escapeHtml(lead.name)} — we got your request.</h1>

  <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.65;">
    We will review the details and get back to you shortly to talk through your project.
  </p>

  <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.65;">
    <strong>Want a faster quote?</strong> Send us photos of the space on WhatsApp — seeing the
    current floor is what lets us price accurately without a visit.
  </p>

  <p style="margin:0 0 28px;">
    <a href="${whatsappUrl()}"
       style="display:inline-block;padding:12px 22px;background:#111827;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:6px;">
      Send photos on WhatsApp
    </a>
  </p>

  <table style="border-collapse:collapse;">
    ${row('Call', company.phone)}
    ${row('Email', company.email)}
    ${row('Visit', `${company.address.street}, ${company.address.city}, ${company.address.state} ${company.address.zip}`)}
  </table>

  <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:12px;line-height:1.6;">
    ${escapeHtml(company.legalName)} — epoxy flooring in ${escapeHtml(company.region)} since ${company.foundedYear}.
  </p>
</div>`;
}

/**
 * Delivers one lead. Resolves only when the company notification is safely sent.
 *
 * Throws if that notification fails, so the caller can tell the customer the
 * truth instead of showing a success screen for a lead that never arrived.
 */
export async function submitQuote(lead: Lead): Promise<void> {
  const mail = resend();

  const { error } = await mail.emails.send({
    from: FROM,
    to: TO,
    subject: `New quote — ${summarise(lead)}`,
    html: notificationHtml(lead),
    // One tap on "Reply" answers the customer instead of the robot.
    ...(lead.email ? { replyTo: lead.email } : {}),
  });

  if (error) {
    throw new Error(`Resend rejected the lead notification: ${error.message}`);
  }

  // Courtesy only — a failure here must not cost us the lead we just captured.
  if (lead.email) {
    try {
      await mail.emails.send({
        from: FROM,
        to: lead.email,
        subject: `We received your request — ${company.name}`,
        html: confirmationHtml(lead),
        replyTo: company.email,
      });
    } catch (err) {
      console.error('[quote] confirmation email failed (lead is safe)', err);
    }
  }
}
