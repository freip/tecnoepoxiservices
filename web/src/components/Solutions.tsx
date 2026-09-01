import Image from 'next/image';
import { brand, finishes, finishesSection } from '@/content/site';
import { Reveal } from './ui/Reveal';
import styles from './Solutions.module.css';

/**
 * Still an editorial list rather than a gallery — the section is the page's
 * quiet moment between two image-heavy ones. Each row carries the supplied
 * sample swatch for that system as a small texture chip: enough to show what
 * the finish looks like without turning the list into cards.
 */
export function Solutions() {
  return (
    <section className={`section ${styles.section}`} id="finishes">
      {/* Watermark is white-on-black artwork; `screen` blending drops the black
          and leaves only the glowing mark over the navy. */}
      <div className={styles.watermark} aria-hidden="true">
        <Image src={brand.watermark} alt="" width={912} height={855} loading="lazy" />
      </div>

      <div className={`shell ${styles.inner}`}>
        <Reveal className={`section-head ${styles.head}`}>
          <p className="eyebrow">{finishesSection.eyebrow}</p>
          <h2 className={styles.title}>{finishesSection.title}</h2>
          <p className="lede">{finishesSection.intro}</p>
        </Reveal>

        <ol className={styles.list}>
          {finishes.map((finish, i) => (
            <Reveal key={finish.name} as="li" className={styles.item} delay={i * 60}>
              <span className={styles.swatch}>
                <Image
                  src={finish.swatch.src}
                  alt={finish.swatch.alt}
                  width={finish.swatch.width}
                  height={finish.swatch.height}
                  sizes="96px"
                  loading="lazy"
                  className={styles.swatchImage}
                />
              </span>
              <div className={styles.copy}>
                <span className={styles.index} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.name}>{finish.name}</h3>
              </div>
              <p className={styles.description}>{finish.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
