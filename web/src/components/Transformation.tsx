import { transformation } from '@/content/site';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { CtaButton } from './ui/CtaButton';
import { Reveal } from './ui/Reveal';
import styles from './Transformation.module.css';

export function Transformation() {
  const [lead, second] = transformation.pairs;

  return (
    <section className={`section ${styles.section}`} id="transformation">
      <div className="shell">
        <Reveal className={`section-head ${styles.head}`}>
          <p className="eyebrow">{transformation.eyebrow}</p>
          <h2 className={styles.title}>{transformation.title}</h2>
          <p className="lede">{transformation.intro}</p>
        </Reveal>

        {/* Lead transformation, given the most room on the page. */}
        <Reveal className={styles.lead}>
          <BeforeAfterSlider
            before={lead.before}
            after={lead.after}
            width={lead.width}
            height={lead.height}
            label={lead.label}
            caption={lead.caption}
            /* The frame sits in a narrow column here, so the caption is rendered
               in the aside beside it rather than squeezed underneath. */
            showCaption={false}
            sizes="(min-width: 1100px) 26rem, 100vw"
          />
          <div className={styles.leadAside}>
            <div className={styles.leadCaption}>
              <p className={styles.leadLabel}>{lead.label}</p>
              <p className={styles.leadText}>{lead.caption}</p>
            </div>

            <p className={styles.hint}>
              <span className={styles.hintIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path
                    d="M10 7l-4 5 4 5M14 7l4 5-4 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              Drag to compare
            </p>
            <p className={styles.leadNote}>
              Both photographs were taken from the same position. Nothing in the space changed
              except the floor.
            </p>
          </div>
        </Reveal>

        {/* Second transformation, presented more compactly. */}
        <Reveal className={styles.second}>
          <BeforeAfterSlider
            before={second.before}
            after={second.after}
            width={second.width}
            height={second.height}
            label={second.label}
            caption={second.caption}
            sizes="(min-width: 1100px) 72rem, 100vw"
          />
        </Reveal>

        <Reveal className={styles.cta}>
          <p className={styles.ctaLine}>{transformation.ctaLine}</p>
          <CtaButton href="#quote" size="lg">
            {transformation.cta}
          </CtaButton>
        </Reveal>
      </div>
    </section>
  );
}
