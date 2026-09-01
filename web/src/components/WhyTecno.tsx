import { why } from '@/content/site';
import { Reveal } from './ui/Reveal';
import styles from './WhyTecno.module.css';

/**
 * Differentiators expressed only as figures that can be evidenced: years in
 * operation, completed projects, segments served and documented finish systems.
 * No claims about warranties, certifications or crew size are made, because
 * none were supplied.
 */
export function WhyTecno() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="shell">
        <Reveal className={`section-head ${styles.head}`}>
          <p className="eyebrow">{why.eyebrow}</p>
          <h2 className={styles.title}>{why.title}</h2>
        </Reveal>

        <dl className={styles.grid}>
          {why.pillars.map((pillar, i) => (
            <Reveal key={pillar.title} className={styles.pillar} delay={i * 80}>
              <dt className={styles.value}>{pillar.value}</dt>
              <dd className={styles.detail}>
                <span className={styles.pillarTitle}>{pillar.title}</span>
                <span className={styles.pillarBody}>{pillar.body}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
