import { NextResponse } from 'next/server';
import { validateQuoteRequest, type QuoteRequest } from '@/lib/quote';

/**
 * Quote intake endpoint.
 *
 * v1 validates the payload and logs it. IT DOES NOT YET DELIVER THE LEAD —
 * wire up one of the options below before this page handles real traffic,
 * otherwise submissions are only visible in the server logs.
 *
 * Where to add delivery (in order of how the brief expects this to evolve):
 *   1. Email/persist  — send to the company inbox or write to a database.
 *   2. AI enrichment  — classify the project, suggest a finish, score the lead,
 *                       optionally estimate a price band from the photos.
 *   3. CRM hand-off   — forward the enriched lead to the CRM.
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
  const lead: QuoteRequest & { receivedAt: string } = {
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

  // TODO: replace with real delivery (see the note at the top of this file).
  console.info('[quote] new lead', lead);

  return NextResponse.json({ ok: true });
}
