import { NextResponse } from 'next/server';
import { appendClickToSheet } from '@/lib/clicks';

/**
 * WhatsApp click beacon.
 *
 * The browser fires this through `navigator.sendBeacon` the moment a WhatsApp
 * link is tapped, then leaves for WhatsApp. Nothing on the page waits for the
 * answer, which shapes everything here:
 *
 *   - it always answers 204, even when the sheet write fails. A visitor on
 *     their way to WhatsApp cannot act on an error, and a failed click is not
 *     worth a red console on their screen;
 *   - failures are logged instead, so a broken webhook is still visible to us;
 *   - the row is awaited before answering. Returning early would let the
 *     platform freeze the function mid-request and drop the write.
 *
 * A lost click is acceptable. A lost lead is not — that is why this endpoint is
 * separate from /api/quote and never shares its failure path.
 */

export const runtime = 'nodejs';

/** Caps a field before it reaches the sheet. Beacons are unauthenticated. */
function clean(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    await appendClickToSheet({
      origin: clean(body.origin, 40) || 'desconhecida',
      page: clean(body.page, 120) || '/',
      device: clean(body.device, 20),
      source: clean(body.source, 120) || 'direto',
      session: clean(body.session, 20),
    });
  } catch (error) {
    console.error('[track/whatsapp] click not recorded', error);
  }

  return new NextResponse(null, { status: 204 });
}
