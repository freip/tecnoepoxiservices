'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import type { ProjectImage } from '@/content/site';
import styles from './Lightbox.module.css';

interface LightboxProps {
  items: ProjectImage[];
  /** Index of the open item, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-screen image viewer.
 *
 * Handles the accessibility obligations of a modal: focus moves in on open and
 * returns to the trigger on close, Tab is trapped inside, Escape dismisses, and
 * background scroll is locked. Arrow keys move between images.
 */
export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const isOpen = index !== null && index >= 0 && index < items.length;
  const total = items.length;

  const go = useCallback(
    (delta: number) => {
      if (index === null || total === 0) return;
      onNavigate((index + delta + total) % total);
    },
    [index, total, onNavigate]
  );

  // Remember what was focused before opening, and restore it on close.
  useEffect(() => {
    if (!isOpen) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => restoreFocusRef.current?.focus?.();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
        return;
      }
      if (e.key !== 'Tab') return;

      // Trap Tab within the dialog.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, go]);

  if (!isOpen) return null;

  const current = items[index];

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Project image viewer"
      ref={dialogRef}
      // Only dismiss on a click of the backdrop itself, not of the image inside it.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
        <span className="sr-only">Close viewer</span>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {total > 1 && (
        <button
          type="button"
          className={`${styles.navButton} ${styles.prev}`}
          onClick={() => go(-1)}
        >
          <span className="sr-only">Previous image</span>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      )}

      <figure className={styles.figure}>
        <div className={styles.imageWrap}>
          {current.video ? (
            // Muted is what makes autoplay allowed at all — the controls are
            // there for anyone who wants the sound back. The poster is the same
            // still the rail showed, so the card and the clip share a first frame.
            <video
              key={current.video}
              className={styles.video}
              src={current.video}
              poster={current.src}
              aria-label={current.alt}
              controls
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="92vw"
              quality={88}
              className={styles.image}
              priority
            />
          )}
        </div>
        <figcaption className={styles.caption}>
          <span className={styles.captionCategory}>{current.category}</span>
          <span className={styles.captionText}>{current.alt}</span>
          <span className={styles.counter}>
            {index + 1} / {total}
          </span>
        </figcaption>
      </figure>

      {total > 1 && (
        <button
          type="button"
          className={`${styles.navButton} ${styles.next}`}
          onClick={() => go(1)}
        >
          <span className="sr-only">Next image</span>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
