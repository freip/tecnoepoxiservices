'use client';

import { useEffect } from 'react';

const ENDPOINT = '/api/track/whatsapp';
const SESSION_KEY = 'te-session';

/**
 * Random code kept for the length of the browser tab's visit.
 *
 * It is what separates "six clicks" from "six people": repeat taps carry the
 * same code. Deliberately not a cookie and not persistent — it identifies a
 * visit, never a person, so there is nothing to disclose or consent to.
 */
function sessionCode(): string {
  try {
    let code = sessionStorage.getItem(SESSION_KEY);
    if (!code) {
      code = Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(SESSION_KEY, code);
    }
    return code;
  } catch {
    // Private mode and locked-down browsers throw on storage. The click still
    // counts; it just cannot be grouped with the others from the same visit.
    return '';
  }
}

/** Where the visitor came from: the campaign tag if tagged, else the referrer. */
function trafficSource(): string {
  const utm = new URLSearchParams(window.location.search).get('utm_source');
  if (utm) return utm;

  if (document.referrer) {
    try {
      const host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) return host;
    } catch {
      // Malformed referrer — fall through to direct.
    }
  }

  return 'direto';
}

/**
 * Logs every tap on a WhatsApp link to the Google Sheet.
 *
 * One listener on the document rather than a handler per button: the five
 * WhatsApp CTAs live in five components, two of which are server components,
 * and an `onClick` prop would have to turn those into client components to
 * carry a function across the boundary. A `data-wa-origin` string crosses it
 * for free, so the buttons stay exactly what they were and any WhatsApp link
 * added later is counted without being wired up.
 *
 * Capture phase, so it still runs if something downstream stops propagation.
 */
export function WhatsAppClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest('a[href^="https://wa.me/"]');
      if (!link) return;

      const body = JSON.stringify({
        origin: link.getAttribute('data-wa-origin') ?? 'desconhecida',
        page: window.location.pathname,
        // Width, not user agent: it answers the question the company actually
        // asks of this column — phone in hand, or sitting at a desk.
        device: window.innerWidth < 900 ? 'Mobile' : 'Desktop',
        source: trafficSource(),
        session: sessionCode(),
      });

      // sendBeacon survives the page being backgrounded or replaced, which is
      // exactly what happens next on a phone when WhatsApp takes over. The
      // fetch is the fallback for the browsers that lack it.
      const blob = new Blob([body], { type: 'application/json' });
      if (!navigator.sendBeacon?.(ENDPOINT, blob)) {
        void fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {
          // A dropped click is not worth surfacing to the visitor.
        });
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
