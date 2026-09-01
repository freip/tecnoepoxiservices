import Image from 'next/image';
import { company, proof } from '@/content/site';
import { Reveal } from './ui/Reveal';
import styles from './Testimonials.module.css';

/**
 * Social proof.
 *
 * No testimonials, reviews or ratings were supplied, and inventing them would be
 * both dishonest and a legal risk — so this renders the documented alternative:
 * verifiable facts (operating since 2014, 200+ projects, a real address) set
 * against real project photography.
 *
 * TO ADD REAL TESTIMONIALS LATER: add a `testimonials` array to content/site.ts
 * and render it in place of `.statement` below. The surrounding layout is
 * already sized for a quote block.
 */
export function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.media}>
        <Image
          src={proof.image.src}
          alt={proof.image.alt}
          fill
          sizes="(min-width: 1000px) 50vw, 100vw"
          quality={80}
          loading="lazy"
          className={styles.image}
        />
      </div>

      <div className={styles.panel}>
        <Reveal className={styles.content}>
          <p className="eyebrow">{proof.eyebrow}</p>
          <h2 className={styles.title}>{proof.title}</h2>
          <p className={styles.statement}>{proof.body}</p>

          <address className={styles.address}>
            <span>{company.address.street}</span>
            <span>
              {company.address.city}, {company.address.state} {company.address.zip}
            </span>
            <a href={company.phoneHref} className={styles.contactLink}>
              {company.phone}
            </a>
          </address>
        </Reveal>
      </div>
    </section>
  );
}
