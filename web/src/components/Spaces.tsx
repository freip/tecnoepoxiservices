import Image from 'next/image';
import { spaces } from '@/content/site';
import { Reveal } from './ui/Reveal';
import styles from './Spaces.module.css';

/**
 * Alternating editorial rows — image and text swap sides down the page so the
 * section reads as a sequence of spreads rather than a grid of cards.
 */
export function Spaces() {
  return (
    <section className={`section ${styles.section}`} id="spaces">
      <div className="shell">
        <Reveal className={`section-head ${styles.head}`}>
          <p className="eyebrow">Spaces we transform</p>
          <h2 className={styles.title}>Every floor has a job to do.</h2>
        </Reveal>

        <div className={styles.rows}>
          {spaces.map((space, i) => (
            <Reveal key={space.id} className={styles.row} as="article">
              <div className={styles.media}>
                <Image
                  src={space.image.src}
                  alt={space.image.alt}
                  width={space.image.width}
                  height={space.image.height}
                  sizes="(min-width: 1000px) 52vw, 100vw"
                  quality={80}
                  className={styles.image}
                />
              </div>

              <div className={styles.body}>
                <span className={styles.index} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.name}>{space.title}</h3>
                <p className={styles.line}>{space.line}</p>
                <p className={styles.text}>{space.body}</p>
                <a className={styles.link} href="#quote">
                  <span>Get a quote for a {space.title.toLowerCase()} floor</span>
                  <span className={styles.linkArrow} aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                      <path
                        d="M2.5 8h10M8.75 4.25L12.5 8l-3.75 3.75"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
