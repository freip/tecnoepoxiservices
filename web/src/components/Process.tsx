import { process } from '@/content/site';
import { Reveal } from './ui/Reveal';
import styles from './Process.module.css';

export function Process() {
  return (
    <section className={`section on-light ${styles.section}`} id="process">
      <div className="shell">
        <Reveal className={`section-head ${styles.head}`}>
          <p className="eyebrow">{process.eyebrow}</p>
          <h2 className={styles.title}>{process.title}</h2>
        </Reveal>

        <ol className={styles.steps}>
          {process.steps.map((step, i) => (
            <Reveal key={step.number} as="li" className={styles.step} delay={i * 90}>
              <span className={styles.number}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
