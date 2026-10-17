'use client';

import { useEffect, useState } from 'react';
import { whatsapp } from '@/content/site';
import { whatsappUrl } from '@/lib/whatsapp';
import styles from './WhatsAppFab.module.css';

/**
 * Persistent WhatsApp bubble.
 *
 * Appears only after the hero has scrolled away: in the hero the channel
 * already has a full-size button beside the primary CTA, and two live WhatsApp
 * affordances on one screen is one too many. Past that point this is the only
 * thing keeping the channel one tap away.
 */
export function WhatsAppFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.75);

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <a
      className={[styles.fab, visible && styles.visible].filter(Boolean).join(' ')}
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsapp.label}
      // Mirrors `pointer-events: none` for assistive tech and keyboard users,
      // so the control is not reachable while it is invisible.
      aria-hidden={!visible}
      tabIndex={visible ? undefined : -1}
    >
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.47 9.47 0 01-4.83-1.32l-.35-.21-3.59.94.96-3.5-.23-.36a9.42 9.42 0 01-1.45-5.04c0-5.22 4.26-9.47 9.5-9.47 2.54 0 4.92.99 6.71 2.78a9.4 9.4 0 012.78 6.7c0 5.22-4.26 9.48-9.49 9.48zM20.46 3.54A11.78 11.78 0 0012.04.06C5.5.06.18 5.38.18 11.92c0 2.09.55 4.13 1.59 5.93L.08 24l6.3-1.65a11.9 11.9 0 005.66 1.44h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.47-8.39z" />
        </svg>
      </span>
      <span className={styles.label}>{whatsapp.shortLabel}</span>
    </a>
  );
}
