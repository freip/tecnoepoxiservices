import { company, whatsapp } from '@/content/site';

/**
 * Builds a wa.me deep link.
 *
 * wa.me is the no-account, no-API route into WhatsApp: it opens the native app
 * on mobile and WhatsApp Web on desktop, so it costs nothing and needs no
 * Business Platform approval. The number must be digits only with the country
 * code first — `company.whatsapp` is already stored in that shape.
 */
export function whatsappUrl(message: string = whatsapp.prefill): string {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}
