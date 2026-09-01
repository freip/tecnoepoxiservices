'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { brand, company, nav } from '@/content/site';
import { CtaButton } from './ui/CtaButton';
import styles from './Header.module.css';

export function Header() {
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Swap to the solid header once the hero has scrolled away.
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu owns the screen.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Escape closes the menu — expected for any full-screen overlay.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className={[styles.header, condensed && styles.condensed].filter(Boolean).join(' ')}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" aria-label={`${company.name} — home`}>
          <Image
            src={brand.emblem}
            alt=""
            width={323}
            height={324}
            className={styles.emblem}
            priority
          />
          <span className={styles.wordmark}>
            Tecno<span className={styles.wordmarkLight}>Epoxy</span>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} className={styles.navLink} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a className={styles.phone} href={company.phoneHref}>
            {company.phone}
          </a>
          <CtaButton href="#quote">Get a Quote</CtaButton>
        </div>

        <button
          className={styles.burger}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          <span className={[styles.burgerBar, menuOpen && styles.barTop].filter(Boolean).join(' ')} />
          <span
            className={[styles.burgerBar, menuOpen && styles.barBottom].filter(Boolean).join(' ')}
          />
        </button>
      </div>

      {/* `inert` rather than `hidden`: the panel has to stay in the layout for
          its open/close transition, but must not be focusable or clickable
          while it is transparent. */}
      <div
        id="mobile-menu"
        className={[styles.mobileMenu, menuOpen && styles.menuOpen].filter(Boolean).join(' ')}
        inert={!menuOpen}
      >
        <nav className={styles.mobileNav} aria-label="Mobile">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.mobileLink}
              style={{ transitionDelay: `${80 + i * 45}ms` }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.mobileFoot}>
          <CtaButton href="#quote" size="lg" className={styles.mobileCta}>
            Get a Quote
          </CtaButton>
          <a className={styles.mobilePhone} href={company.phoneHref}>
            {company.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
