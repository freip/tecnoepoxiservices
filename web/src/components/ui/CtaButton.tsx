import type { ReactNode } from 'react';
import styles from './CtaButton.module.css';

type Variant = 'solid' | 'ghost' | 'light';
type Size = 'md' | 'lg';

interface CtaButtonProps {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit';
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  className?: string;
}

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" width="15" height="15" aria-hidden="true">
    <path d="M2.5 8h10M8.75 4.25L12.5 8l-3.75 3.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
}: CtaButtonProps) {
  const classes = [styles.cta, styles[variant], styles[size], className].filter(Boolean).join(' ');

  const inner = (
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
      <a className={classes} href={href}>
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
