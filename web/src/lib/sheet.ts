import type { Lead } from './email';
import { PROJECT_TYPE_LABELS, SIZE_RANGE_LABELS } from './quote';

/**
 * Appends a lead as a row in the Google Sheet.
 *
 * Talks to an Apps Script web app published from the sheet itself, rather than
 * the Sheets API: no Google Cloud project, no service account, no private key
 * in the environment — one secret URL does the whole job.
 *
 * The payload keys are Portuguese to match the sheet's own column names, so the
 * mapping stays readable from either side.
 */
export async function appendLeadToSheet(lead: Lead): Promise<void> {
  const url = process.env.LEADS_SHEET_WEBHOOK_URL;
  if (!url) {
    throw new Error('LEADS_SHEET_WEBHOOK_URL is not set — the sheet row cannot be written.');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: lead.name,
      telefone: lead.phone,
      email: lead.email,
      // Form submissions are always the site. WhatsApp conversations never
      // reach this endpoint, so those rows stay a manual entry.
      origem: 'Site',
      cidade: lead.location,
      // Labels, not the raw union values: the sheet is read by a person, so it
      // gets "500 – 1,000 sq ft", never "500-1000".
      tipo: PROJECT_TYPE_LABELS[lead.projectType],
      tamanho: SIZE_RANGE_LABELS[lead.approximateSize],
      // Only the count — the form cannot carry the files. A number above zero
      // is the cue to ask for them on WhatsApp.
      fotos: lead.photoCount,
      mensagem: lead.message,
      secret: process.env.LEADS_SHEET_SECRET,
    }),
    // Apps Script answers through a redirect to googleusercontent.com, which
    // fetch follows by default. The timeout is what stops a hung script from
    // holding the serverless function open until the platform kills it.
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Apps Script returned HTTP ${response.status}`);
  }

  // A deployment that is not public answers 200 with a Google sign-in page, so
  // the status code alone does not prove the row landed — the body must say so.
  const text = await response.text();
  let payload: { ok?: boolean; error?: string };
  try {
    payload = JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    throw new Error(
      'Apps Script did not return JSON — check that the deployment is set to "Anyone".'
    );
  }

  if (!payload.ok) {
    throw new Error(`Apps Script rejected the lead: ${payload.error ?? 'unknown error'}`);
  }
}
