import Image from 'next/image';
import { finalCta } from '@/content/site';
import { CtaButton } from './ui/CtaButton';
import { Reveal } from './ui/Reveal';
import styles from './FinalCTA.module.css';

export function FinalCTA() {
  return (
    <section className={styles.section}>
      <Image
        src={finalCta.image.src}
        alt=""
        fill
        sizes="100vw"
        quality={80}
        loading="lazy"
        className={styles.image}
        aria-hidden="true"
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={`shell ${styles.inner}`}>
        <Reveal className={styles.content}>
          <h2 className={styles.title}>{finalCta.title}</h2>
          <p className={styles.body}>{finalCta.body}</p>
          <CtaButton href="#quote" size="lg">
            {finalCta.cta}
          </CtaButton>
        </Reveal>
      </div>
    </section>
  );
}
