import Image from 'next/image';
import { brand, company, nav } from '@/content/site';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <div className={styles.brandBlock}>
          {/* The simplified square mark suits the small, quiet footer lockup. */}
          <Image
            src={brand.simplified}
            alt={`${company.legalName} logo`}
            width={400}
            height={400}
            loading="lazy"
            className={styles.mark}
          />
          <p className={styles.tagline}>
            Custom epoxy flooring in {company.region} since {company.foundedYear}.
          </p>
        </div>

        <nav className={styles.links} aria-label="Footer">
          <h2 className={styles.heading}>Explore</h2>
          {nav.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
          <a href="#quote" className={styles.link}>
            Get a Quote
          </a>
        </nav>

        <div className={styles.contactBlock}>
          <h2 className={styles.heading}>Contact</h2>
          <a href={company.phoneHref} className={styles.link}>
            {company.phone}
          </a>
          <a href={company.emailHref} className={styles.link}>
            {company.email}
          </a>
          <address className={styles.address}>
            {company.address.street}
            <br />
            {company.address.city}, {company.address.state} {company.address.zip}
            <br />
            {company.address.country}
          </address>
        </div>
      </div>

      <div className={`shell ${styles.base}`}>
        <p>
          © {new Date().getFullYear()} {company.legalName}. All rights reserved.
        </p>
        <a href={company.website} className={styles.baseLink}>
          tecnoepoxiservices.com
        </a>
      </div>
    </footer>
  );
}
