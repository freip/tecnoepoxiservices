'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import styles from './Reveal.module.css';

interface RevealProps {
  children: ReactNode;
  /** Stagger in ms, for revealing a group of siblings in sequence. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Fades and lifts its children into place the first time they enter the viewport.
 *
 * Starts visible and is only hidden once the observer is confirmed to be running,
 * so content is never trapped invisible if JS fails or IntersectionObserver is
 * unavailable. Users with reduced-motion preferences skip the animation entirely
 * via CSS, and the element unobserves itself after firing once.
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    setShown(false);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={[styles.reveal, shown && styles.shown, className].filter(Boolean).join(' ')}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
