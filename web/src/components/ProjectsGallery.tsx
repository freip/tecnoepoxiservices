'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { galleryFilters, projects, work, type SpaceId } from '@/content/site';
import { Lightbox } from './Lightbox';
import { CtaButton } from './ui/CtaButton';
import { Reveal } from './ui/Reveal';
import styles from './ProjectsGallery.module.css';

type Filter = SpaceId | 'all';

/** Pixels per frame at 60fps. Slow enough to read as drift, not as a slideshow. */
const AUTO_SPEED = 0.85;
/**
 * The rail is full-bleed, so on a desktop the pointer sits over it most of the
 * time. Stopping on hover meant the drift almost never ran — instead it eases
 * down to a crawl, which still makes a card easy to aim at and click.
 */
const HOVER_SPEED_FACTOR = 0.18;
/** How long automatic motion stays out of the way after the visitor acts. */
const INTERACTION_PAUSE = 1400;

export function ProjectsGallery() {
  const [filter, setFilter] = useState<Filter>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const railRef = useRef<HTMLDivElement>(null);
  const pausedUntilRef = useRef(0);
  const hoveredRef = useRef(false);
  // Keyboard focus stops the rail outright — a card must not slide away from
  // under someone who has just tabbed onto it.
  const focusedRef = useRef(false);
  // Set while a pointer drag is in progress so the click it ends with does not
  // open the lightbox.
  const draggedRef = useRef(false);

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  // The rail renders the set twice so scrollLeft can wrap back by exactly one
  // copy without the seam ever being visible.
  const looped = useMemo(() => [...visible, ...visible], [visible]);

  const suspendAuto = useCallback(() => {
    pausedUntilRef.current = Date.now() + INTERACTION_PAUSE;
  }, []);

  /**
   * Width of exactly one copy of the set, gap included. Measured from the two
   * cards that start each copy — `scrollWidth / 2` is wrong here, because the
   * rail's horizontal padding is counted once, not twice, and the resulting
   * half-pixel error would show up as a jolt on every lap.
   */
  const loopWidth = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return 0;
    const first = rail.children[0] as HTMLElement | undefined;
    const secondCopy = rail.children[visible.length] as HTMLElement | undefined;
    if (!first || !secondCopy) return 0;
    return secondCopy.offsetLeft - first.offsetLeft;
  }, [visible.length]);

  /** Keeps scrollLeft inside the first copy, so the rail never reaches an end. */
  const wrap = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const width = loopWidth();
    if (width <= 0) return;
    if (rail.scrollLeft >= width) rail.scrollLeft -= width;
    else if (rail.scrollLeft < 0) rail.scrollLeft += width;
  }, [loopWidth]);

  // Continuous drift. Slows to a crawl under the pointer, stops while the
  // lightbox is open or just after an interaction, and never runs at all for
  // reduced-motion visitors.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (openIndex !== null || focusedRef.current) return;
      if (Date.now() < pausedUntilRef.current) return;

      const width = loopWidth();
      if (width <= 0) return;

      const speed = hoveredRef.current ? AUTO_SPEED * HOVER_SPEED_FACTOR : AUTO_SPEED;
      const next = rail.scrollLeft + speed;
      rail.scrollLeft = next >= width ? next - width : next;
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [openIndex, looped.length, loopWidth]);

  // Reset to the start whenever the filter changes the contents of the rail.
  useEffect(() => {
    if (railRef.current) railRef.current.scrollLeft = 0;
  }, [filter]);

  /**
   * Arrow navigation animates scrollLeft itself rather than using native smooth
   * scrolling: the wrap has to run on every frame to keep the loop seamless,
   * and writing scrollLeft would cancel a native smooth scroll mid-flight.
   */
  const animRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const step = useCallback(
    (direction: 1 | -1) => {
      const rail = railRef.current;
      if (!rail) return;

      const card = rail.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 16;
      const distance = (card ? card.offsetWidth + gap : rail.clientWidth * 0.8) * direction;

      cancelAnimationFrame(animRef.current);
      suspendAuto();

      const duration = 520;
      const start = performance.now();
      let applied = 0;

      const run = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = (1 - Math.pow(1 - t, 3)) * distance;
        rail.scrollLeft += eased - applied;
        applied = eased;
        wrap();
        if (t < 1) animRef.current = requestAnimationFrame(run);
      };

      animRef.current = requestAnimationFrame(run);
    },
    [suspendAuto, wrap]
  );

  // ---- Drag to scroll ----

  const dragState = useRef<{ startX: number; startScroll: number; active: boolean }>({
    startX: 0,
    startScroll: 0,
    active: false,
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // Touch already scrolls the rail natively; only take over for mouse and pen.
    if (e.pointerType === 'touch') return;
    const rail = railRef.current;
    if (!rail) return;
    dragState.current = { startX: e.clientX, startScroll: rail.scrollLeft, active: true };
    draggedRef.current = false;
    suspendAuto();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragState.current.active) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 6) {
      draggedRef.current = true;
      rail.setPointerCapture?.(e.pointerId);
    }
    rail.scrollLeft = dragState.current.startScroll - delta;
    wrap();
    suspendAuto();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    railRef.current?.releasePointerCapture?.(e.pointerId);
    suspendAuto();
  };

  return (
    <section className={`section ${styles.section}`} id="work">
      <div className="shell">
        <Reveal className={styles.head}>
          <div className={`section-head ${styles.headText}`}>
            <p className="eyebrow">{work.eyebrow}</p>
            <h2 className={styles.title}>{work.title}</h2>
          </div>
          <p className={`lede ${styles.intro}`}>{work.intro}</p>
        </Reveal>

        <Reveal className={styles.controls}>
          <div className={styles.filterList} role="tablist" aria-label="Filter projects by space">
            {galleryFilters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={[styles.filter, active && styles.filterActive]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => step(-1)}
              aria-controls="work-rail"
            >
              <span className="sr-only">Previous projects</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => step(1)}
              aria-controls="work-rail"
            >
              <span className="sr-only">Next projects</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </Reveal>
      </div>

      {/* The rail breaks out of the shell so the run of photographs bleeds to
          both edges of the screen and reads as continuous. */}
      <div
        className={styles.railWrap}
        onMouseEnter={() => {
          hoveredRef.current = true;
        }}
        onMouseLeave={() => {
          hoveredRef.current = false;
        }}
        onFocusCapture={() => {
          focusedRef.current = true;
        }}
        onBlurCapture={() => {
          focusedRef.current = false;
        }}
      >
        <div
          id="work-rail"
          ref={railRef}
          className={styles.rail}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onScroll={wrap}
          // Only a sideways wheel/trackpad gesture is aimed at the rail; a
          // vertical one is the visitor scrolling the page past it, and must
          // not freeze the drift.
          onWheel={(e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) suspendAuto();
          }}
        >
          {looped.map((project, i) => {
            const realIndex = i % visible.length;
            const isClone = i >= visible.length;
            return (
              <button
                key={`${project.src}-${i}`}
                type="button"
                className={styles.card}
                // The second copy exists only to close the loop visually.
                aria-hidden={isClone || undefined}
                tabIndex={isClone ? -1 : undefined}
                onClick={() => {
                  if (draggedRef.current) return;
                  setOpenIndex(realIndex);
                }}
                aria-label={`View larger: ${project.alt}`}
              >
                <Image
                  src={project.src}
                  alt={isClone ? '' : project.alt}
                  width={project.width}
                  height={project.height}
                  sizes="(min-width: 1200px) 32vw, (min-width: 700px) 46vw, 78vw"
                  quality={78}
                  loading="lazy"
                  className={styles.image}
                  draggable={false}
                />
                <span className={styles.overlay} aria-hidden="true" />
                <span className={styles.meta} aria-hidden="true">
                  <span className={styles.metaCategory}>{project.category}</span>
                  <span className={styles.metaIcon}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                      <path
                        d="M4 10V4h6M20 14v6h-6M20 10V4h-6M4 14v6h6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="shell">
        <Reveal className={styles.cta}>
          <CtaButton href="#quote" size="lg">
            {work.cta}
          </CtaButton>
        </Reveal>
      </div>

      <Lightbox
        items={visible}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
