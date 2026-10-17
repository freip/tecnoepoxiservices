import { NextResponse } from 'next/server';
import { company } from '@/content/site';
import { submitQuote, type Lead } from '@/lib/email';
import { validateQuoteRequest, type QuoteRequest } from '@/lib/quote';
import { appendLeadToSheet } from '@/lib/sheet';

/**
 * Quote intake endpoint.
 *
 * A lead goes to two independent places — a row in the Google Sheet and an
 * email to the company inbox — and they are tried TOGETHER, not in sequence.
 *
 * Either one surviving is enough to consider the lead captured. That is the
 * whole point of having two: the sheet keeps working while email is down or
 * unconfigured, and the inbox keeps working if Apps Script is redeployed. Only
 * losing both is a real failure, and only then is the customer told.
 *
 * Where this is expected to go next:
 *   1. AI enrichment — classify the project, suggest a finish, score the lead.
 *   2. CRM hand-off  — forward the enriched lead onward.
 *
 * Each step slots in here without touching any component.
 */

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let payload: Partial<QuoteRequest>;

  try {
    payload = (await request.json()) as Partial<QuoteRequest>;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 });
  }

  // Re-validate server-side: the client checks are for UX, not for trust.
  const errors = validateQuoteRequest(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, message: 'Some details are missing.', errors },
      { status: 422 }
    );
  }

  // Normalise into the shape downstream consumers (CRM, AI step) will receive.
  const lead: Lead = {
    name: String(payload.name ?? '').trim(),
    email: String(payload.email ?? '').trim(),
    phone: String(payload.phone ?? '').trim(),
    projectType: payload.projectType!,
    approximateSize: payload.approximateSize ?? 'not-sure',
    location: String(payload.location ?? '').trim(),
    message: String(payload.message ?? '').trim(),
    photoCount: Number(payload.photoCount ?? 0),
    currentCondition: payload.currentCondition,
    source: payload.source ?? 'landing-page',
    receivedAt: new Date().toISOString(),
  };

  // Run both in parallel: one must not wait on the other, and one failing must
  // not prevent the other from being attempted.
  const [sheet, email] = await Promise.allSettled([
    appendLeadToSheet(lead),
    submitQuote(lead),
  ]);

  if (sheet.status === 'rejected') {
    console.error('[quote] sheet row failed', sheet.reason);
  }
  if (email.status === 'rejected') {
    console.error('[quote] email failed', email.reason);
  }

  if (sheet.status === 'rejected' && email.status === 'rejected') {
    // The lead is the business. Log the whole payload so it stays recoverable
    // from the platform logs even with every destination down...
    console.error('[quote] DELIVERY FAILED — lead not recorded anywhere', { lead });

    // ...and tell the customer the truth. A success screen here would send them
    // away believing we had their request when we do not.
    return NextResponse.json(
      {
        ok: false,
        message: `We could not send that request. Please call us at ${company.phone} or message us on WhatsApp and we will pick it up right away.`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
