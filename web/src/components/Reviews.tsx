import Image from 'next/image';
import { reviews } from '@/content/site';
import styles from './Reviews.module.css';

/** Five filled stars — the rating is 5.0 on every review, so no partial state. */
function Stars() {
  return (
    <span className={styles.stars} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M10 1.6l2.47 5.3 5.53.7-4.08 3.9 1.06 5.6L10 14.4l-4.98 2.7 1.06-5.6L2 7.6l5.53-.7z" />
        </svg>
      ))}
    </span>
  );
}

/** The Google "G", so the source of the reviews is legible at a glance. */
function GoogleMark() {
  return (
    <svg className={styles.googleMark} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l6.9 5.3c4.1-3.8 6.6-9.4 6.6-15.6z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.3c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8 41.2 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.5 28.5c-.5-1.4-.7-2.9-.7-4.5s.3-3.1.7-4.5l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 10z"
      />
      <path
        fill="#EA4335"
        d="M24 10.2c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4 29.9 2 24 2 15.4 2 8 6.8 4.4 14l7.1 5.5c1.8-5.3 6.7-9.3 12.5-9.3z"
      />
    </svg>
  );
}

/**
 * Google reviews as a continuous horizontal marquee.
 *
 * The track holds the list twice and slides exactly half its width, so the loop
 * is seamless. It is presentational only — no controls, no links, no hover
 * targets — and `prefers-reduced-motion` stops the movement (globals.css),
 * leaving the first set readable in place.
 */
export function Reviews() {
  const loop = [...reviews.items, ...reviews.items];

  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <div className="shell">
        <div className={styles.head}>
          <h2 id="reviews-title" className={styles.title}>
            {reviews.title}
          </h2>

          <p className={styles.score}>
            <span className={styles.rating}>{reviews.rating}</span>
            <Stars />
            <span className={styles.label}>{reviews.ratingLine}</span>
            <GoogleMark />
          </p>

          <p className={styles.intro}>{reviews.intro}</p>
        </div>
      </div>

      <div className={styles.viewport}>
        <ul className={styles.track}>
          {loop.map((review, i) => (
            <li
              key={`${review.name}-${i}`}
              className={styles.card}
              /* The second pass is a visual duplicate; screen readers read the first. */
              aria-hidden={i >= reviews.items.length || undefined}
            >
              <div className={styles.person}>
                <Image
                  src={review.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className={styles.avatar}
                  loading="lazy"
                />
                <div className={styles.identity}>
                  <p className={styles.name}>{review.name}</p>
                  <Stars />
                </div>
              </div>
              <p className={styles.body}>{review.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
