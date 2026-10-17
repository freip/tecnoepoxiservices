'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { hero, whatsapp } from '@/content/site';
import { whatsappUrl } from '@/lib/whatsapp';
import { CtaButton } from './ui/CtaButton';
import styles from './Hero.module.css';

export function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);

  /**
   * Very light parallax: the image drifts at ~18% of scroll speed while the hero
   * is on screen. Driven by rAF off a passive scroll listener, and disabled
   * outright for reduced-motion and touch-sized viewports where it costs more
   * than it adds.
   */
  useEffect(() => {
    const node = imageRef.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 900px)');
    if (reduced.matches || !wide.matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = Math.min(window.scrollY, window.innerHeight) * 0.18;
      node.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className={styles.hero} id="top">
      <div className={styles.media} ref={imageRef}>
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          quality={82}
          sizes="100vw"
          className={styles.image}
        />
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.shell}>
          <p className={`eyebrow ${styles.eyebrow}`}>{hero.eyebrow}</p>

          <h1 className={styles.headline}>
            {hero.headline.map((line, i) => (
              <span key={line} className={styles.line}>
                <span className={styles.lineInner} style={{ animationDelay: `${240 + i * 130}ms` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className={styles.subhead}>{hero.subhead}</p>

          {/* Two equal ways in — the form and WhatsApp — then the quiet third.
              WhatsApp sits beside the primary rather than below the fold
              because a large share of customers start there. */}
          <div className={styles.ctas}>
            <CtaButton href="#quote" size="lg">
              {hero.primaryCta}
            </CtaButton>
            <CtaButton href={whatsappUrl()} variant="whatsapp" size="lg" external>
              {whatsapp.label}
            </CtaButton>
            <CtaButton href="#work" variant="ghost" size="lg">
              {hero.secondaryCta}
            </CtaButton>
          </div>
        </div>
      </div>

      <div className={styles.credentials}>
        <div className={styles.shell}>
          <dl className={styles.credentialList}>
            {hero.credentials.map((item) => (
              <div key={item.label} className={styles.credential}>
                {/* A long value ("Residential · Commercial · Industrial") cannot
                    carry the same display size as "200+" without wrapping badly,
                    so it steps down a size instead of breaking the strip. */}
                <dt
                  className={[
                    styles.credentialValue,
                    item.value.length > 16 && styles.credentialValueLong,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {item.value}
                </dt>
                <dd className={styles.credentialLabel}>{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
