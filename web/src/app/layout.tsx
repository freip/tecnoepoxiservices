import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { company, seo } from '@/content/site';
import '@/styles/globals.css';

const body = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const display = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL(company.website),
  title: seo.title,
  description: seo.description,
  keywords: [
    'epoxy flooring',
    'metallic epoxy',
    'garage floor coating',
    'commercial epoxy flooring',
    `epoxy flooring ${company.address.city} ${company.address.state}`,
  ],
  openGraph: {
    title: seo.title,
    description: seo.description,
    type: 'website',
    url: company.website,
    locale: 'en_US',
    siteName: company.legalName,
    images: [{ url: '/assets/projects/residential_1.jpg', width: 2048, height: 1536 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  icons: { icon: '/icon.png', apple: '/icon.png' },
  alternates: { canonical: company.website },
};

export const viewport: Viewport = {
  themeColor: '#071a3a',
  colorScheme: 'dark',
};

/**
 * LocalBusiness structured data. Only fields backed by the company brief are
 * emitted — no invented ratings, review counts or opening hours.
 */
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: company.legalName,
  url: company.website,
  telephone: company.phone,
  email: company.email,
  foundingDate: String(company.foundedYear),
  image: `${company.website}assets/projects/residential_1.jpg`,
  description: seo.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressRegion: company.address.state,
    postalCode: company.address.zip,
    addressCountry: 'US',
  },
  areaServed: company.region,
  knowsAbout: ['Epoxy flooring', 'Metallic epoxy', 'Flake flooring', 'Industrial floor coatings'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          // Static, author-controlled object — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
