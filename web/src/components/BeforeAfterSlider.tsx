'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './BeforeAfterSlider.module.css';

interface ImageSpec {
  src: string;
  alt: string;
}

interface BeforeAfterSliderProps {
  before: ImageSpec;
  after: ImageSpec;
  /** Intrinsic size of the pair — the two photos share a frame, so they must match. */
  width: number;
  height: number;
  label?: string;
  caption?: string;
  /**
   * Set false when the caller places the label and caption itself — the label is
   * still used for the handle's accessible name either way. Needed where the
   * frame sits in a narrow column that would squeeze the caption into a column
   * of single words.
   */
  showCaption?: boolean;
  priority?: boolean;
  sizes?: string;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * Compares the two photographs through a draggable vertical divider.
 *
 * READING ORDER IS BEFORE → AFTER. The finished floor is the base layer, and
 * the original slab is clipped over it from the left edge, so the "before" is
 * always on the left of the divider and the "after" always on the right —
 * matching the corner tags and the way the pair is read.
 *
 * Interaction model:
 *  - Desktop: hovering sweeps the divider; pressing and dragging takes control
 *    until release, so the reveal never fights the pointer.
 *  - Touch: dragging the divider moves it. Pointer Events cover mouse, pen and
 *    touch through one code path.
 *  - Keyboard: the handle is a real slider — arrows step, Home/End jump.
 *
 * The frame keeps the pair's true aspect ratio, so neither photo is distorted.
 */
export function BeforeAfterSlider({
  before,
  after,
  width,
  height,
  label,
  caption,
  showCaption = true,
  priority = false,
  sizes = '(min-width: 1100px) 70vw, 100vw',
}: BeforeAfterSliderProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [engaged, setEngaged] = useState(false);

  const positionFromEvent = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return null;
    const rect = frame.getBoundingClientRect();
    if (rect.width === 0) return null;
    return clamp(((clientX - rect.left) / rect.width) * 100);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore secondary buttons so right-click never grabs the divider.
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const next = positionFromEvent(e.clientX);
    if (next === null) return;
    setDragging(true);
    setEngaged(true);
    setPosition(next);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Hover-to-sweep is a mouse affordance only; touch requires a deliberate drag.
    if (!dragging && e.pointerType !== 'mouse') return;
    if (!dragging && !engaged) return;
    const next = positionFromEvent(e.clientX);
    if (next !== null) setPosition(next);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    const moves: Record<string, number> = {
      ArrowLeft: -step,
      ArrowRight: step,
      ArrowDown: -step,
      ArrowUp: step,
    };

    if (e.key in moves) {
      e.preventDefault();
      setEngaged(true);
      setPosition((p) => clamp(p + moves[e.key]));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setEngaged(true);
      setPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setEngaged(true);
      setPosition(100);
    }
  };

  // Safety net: if a pointer is lost outside the window, stop dragging.
  useEffect(() => {
    if (!dragging) return;
    const stop = () => setDragging(false);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [dragging]);

  return (
    <figure className={styles.wrapper}>
      <div
        ref={frameRef}
        className={[styles.frame, dragging && styles.dragging].filter(Boolean).join(' ')}
        style={{ aspectRatio: `${width} / ${height}` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={() => setEngaged(true)}
        onPointerLeave={() => {
          if (!dragging) setEngaged(false);
        }}
      >
        {/* Base layer: the finished floor, occupying the right of the divider. */}
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={80}
          className={styles.image}
          draggable={false}
        />

        {/* Clipped layer: the original slab, held to the left of the divider. */}
        <div
          className={styles.beforeLayer}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={before.src}
            alt={before.alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={80}
            className={styles.image}
            draggable={false}
          />
        </div>

        {/* Tags fade out as their own side is squeezed away by the divider. */}
        <span
          className={`${styles.tag} ${styles.tagBefore}`}
          style={{ opacity: position < 16 ? 0 : 1 }}
          aria-hidden="true"
        >
          Before
        </span>
        <span
          className={`${styles.tag} ${styles.tagAfter}`}
          style={{ opacity: position > 84 ? 0 : 1 }}
          aria-hidden="true"
        >
          After
        </span>

        <div className={styles.divider} style={{ left: `${position}%` }} aria-hidden="true">
          <span className={styles.dividerLine} />
        </div>

        <div
          className={styles.handle}
          style={{ left: `${position}%` }}
          role="slider"
          tabIndex={0}
          aria-label={
            label
              ? `Compare before and after — ${label}`
              : 'Compare the floor before and after'
          }
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% before, ${100 - Math.round(position)}% after`}
          onKeyDown={handleKeyDown}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <path
              d="M10 7l-4 5 4 5M14 7l4 5-4 5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {showCaption && (label || caption) && (
        <figcaption className={styles.caption}>
          {label && <span className={styles.captionLabel}>{label}</span>}
          {caption && <span className={styles.captionText}>{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}
