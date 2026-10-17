import type { ReactNode } from 'react';
import styles from './CtaButton.module.css';

type Variant = 'solid' | 'ghost' | 'light' | 'whatsapp';
type Size = 'md' | 'lg';

interface CtaButtonProps {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  className?: string;
  /** Opens in a new tab. Used by the WhatsApp links so the page is not lost. */
  external?: boolean;
}

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" width="15" height="15" aria-hidden="true">
    <path d="M2.5 8h10M8.75 4.25L12.5 8l-3.75 3.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Official WhatsApp glyph — the recognition is the point, so it is not restyled. */
const WhatsAppMark = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.47 9.47 0 01-4.83-1.32l-.35-.21-3.59.94.96-3.5-.23-.36a9.42 9.42 0 01-1.45-5.04c0-5.22 4.26-9.47 9.5-9.47 2.54 0 4.92.99 6.71 2.78a9.4 9.4 0 012.78 6.7c0 5.22-4.26 9.48-9.49 9.48zM20.46 3.54A11.78 11.78 0 0012.04.06C5.5.06.18 5.38.18 11.92c0 2.09.55 4.13 1.59 5.93L.08 24l6.3-1.65a11.9 11.9 0 005.66 1.44h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.47-8.39z" />
  </svg>
);

/**
 * The single CTA element used site-wide, so every call to action looks and
 * behaves identically. Renders an anchor when given `href`, a button otherwise.
 *
 * The arrow is doubled inside a clipped track: on hover the first glyph exits
 * right while the second enters from the left, so the icon reads as a
 * continuous motion rather than a nudge.
 */
export function CtaButton({
  children,
  href,
  type = 'button',
  variant = 'solid',
  size = 'md',
  disabled,
  className,
  external,
}: CtaButtonProps) {
  const classes = [styles.cta, styles[variant], styles[size], className].filter(Boolean).join(' ');

  // WhatsApp leads with its own mark instead of the arrow: the glyph is what
  // makes the button scannable, and the sliding arrow would only compete.
  const inner =
    variant === 'whatsapp' ? (
      <>
        <span className={styles.mark}>
          <WhatsAppMark />
        </span>
        <span className={styles.label}>{children}</span>
      </>
    ) : (
      <>
        <span className={styles.label}>{children}</span>
        <span className={styles.arrow} aria-hidden="true">
          <span className={styles.arrowLead}>
            <Arrow />
          </span>
          <span className={styles.arrowTrail}>
            <Arrow />
          </span>
        </span>
      </>
    );

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled}>
      {inner}
    </button>
  );
}
