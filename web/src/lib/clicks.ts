/** One tap on a WhatsApp button, as the sheet records it. */
export interface WhatsAppClick {
  /** Which button was tapped — `hero`, `header`, `fab`, `form`… */
  origin: string;
  /** Path the click happened on. One-page site today, useful the day it is not. */
  page: string;
  /** `Mobile` or `Desktop`, decided by viewport width. */
  device: string;
  /** utm_source, else the referring host, else `direto`. */
  source: string;
  /** Random per-visit code, so repeat taps by one person stay countable as one. */
  session: string;
}

/**
 * Appends a click as a row in the Google Sheet's WhatsApp tab.
 *
 * Reuses the lead webhook — same Apps Script, same URL, same secret. The
 * `evento` key is what sends the row to the clicks tab instead of the leads
 * tab; omitting it keeps the old lead behaviour, which is why `appendLeadToSheet`
 * never had to change.
 *
 * Kept server-side for the same reason the lead call is: the webhook URL is a
 * password, and anything the browser can read, anyone can read.
 */
export async function appendClickToSheet(click: WhatsAppClick): Promise<void> {
  const url = process.env.LEADS_SHEET_WEBHOOK_URL;
  if (!url) {
    throw new Error('LEADS_SHEET_WEBHOOK_URL is not set — the click cannot be recorded.');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      evento: 'clique-whatsapp',
      origem: click.origin,
      pagina: click.page,
      dispositivo: click.device,
      fonte: click.source,
      sessao: click.session,
      secret: process.env.LEADS_SHEET_SECRET,
    }),
    // Shorter than the lead's 8s: nobody is waiting on this, and a click worth
    // less than a lead should not hold a serverless function open as long.
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Apps Script returned HTTP ${response.status}`);
  }
}
