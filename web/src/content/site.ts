/**
 * Single source of truth for every piece of copy and every image on the page.
 *
 * CONTENT RULE: nothing in this file is invented. Company facts (founding year,
 * project count, segments, finishes, contact details) come from the supplied
 * company brief. There are no testimonials because none were supplied — the
 * social-proof section uses verifiable figures and real project photography
 * instead of fabricated reviews.
 *
 * To edit the site, edit this file. Components read from it and never hardcode copy.
 */

/**
 * Commercial and industrial share one category: the surface specification and
 * the photography read the same way, and splitting them left the industrial
 * filter with a single project behind it.
 */
export type SpaceId = 'residential' | 'garage' | 'commercial';

export interface ProjectImage {
  src: string;
  alt: string;
  category: SpaceId;
  /** Intrinsic dimensions, used to reserve layout space and avoid distortion. */
  width: number;
  height: number;
}

export const company = {
  name: 'Tecno Epoxy',
  legalName: 'Tecno Epoxy Flooring',
  foundedYear: 2014,
  projectsCompleted: '200+',
  phone: '+1 (508) 271-5230',
  phoneHref: 'tel:+15082715230',
  email: 'tecnoepoxiflooring@gmail.com',
  emailHref: 'mailto:tecnoepoxiflooring@gmail.com',
  /**
   * WhatsApp is a primary contact channel here, not a fallback: a large share of
   * the customer base reaches out that way, and it is the only path where a
   * customer can send photos of the slab — which the quote form cannot do.
   *
   * Digits only, country code first, no "+" or punctuation: that is the format
   * wa.me requires. Defaults to the same line as `phone`; change it here if the
   * business ever moves WhatsApp to a separate number.
   */
  whatsapp: '15082715230',
  address: {
    street: '100 Merrimack Ave',
    city: 'Dracut',
    state: 'MA',
    zip: '01826',
    country: 'United States',
  },
  region: 'Massachusetts',
  website: 'https://www.tecnoepoxiservices.com/',
} as const;

/**
 * Single source of truth for "how long we've been doing this".
 *
 * Derived rather than written out, so the headline and the stat pillar can
 * never drift apart — and neither goes stale on its own. Note this is
 * evaluated when the page is prerendered, so it only advances on a rebuild.
 */
export const yearsInBusiness = new Date().getFullYear() - company.foundedYear;

export const brand = {
  emblem: '/assets/brand/derived/emblem.png',
  watermark: '/assets/brand/derived/watermark.png',
  simplified: '/assets/brand/logo.png',
} as const;

export const nav = [
  { label: 'Transformation', href: '#transformation' },
  { label: 'Spaces', href: '#spaces' },
  { label: 'Work', href: '#work' },
  { label: 'Finishes', href: '#finishes' },
  { label: 'Process', href: '#process' },
] as const;

export const hero = {
  eyebrow: `Epoxy flooring · ${company.region}`,
  headline: ['Quality you can see.', 'Experience you can trust.'],
  subhead:
    'Custom epoxy flooring for residential, commercial and industrial spaces — from the first consultation to the final finish.',
  primaryCta: 'Get a Quote',
  secondaryCta: 'Explore Our Work',
  image: {
    src: '/assets/projects/residential_1.jpg',
    alt: 'Residential basement with a grey metallic epoxy floor reflecting blue accent lighting',
    width: 2048,
    height: 1536,
  },
  credentials: [
    { value: `Since ${company.foundedYear}`, label: 'Installing epoxy floors' },
    { value: company.projectsCompleted, label: 'Projects completed' },
    { value: 'Residential · Commercial · Industrial', label: 'Spaces we cover' },
  ],
} as const;

export const transformation = {
  eyebrow: 'Before / After',
  title: 'See the transformation.',
  intro:
    'The same space, the same light, the same camera angle. The only thing that changed is the floor.',
  ctaLine: 'Want this transformation for your space?',
  cta: 'Get a Quote',
  pairs: [
    {
      id: 'barbershop',
      label: 'Barbershop · Commercial',
      caption: 'A worn concrete slab finished in a blue metallic pour with inlaid team graphics.',
      before: {
        src: '/assets/transform/antes1.jpeg',
        alt: 'Barbershop floor before treatment: stained, patchy bare concrete',
      },
      after: {
        src: '/assets/transform/depois1.jpeg',
        alt: 'The same barbershop after: a glossy blue and white metallic epoxy floor with inlaid team logos',
      },
      width: 896,
      height: 1200,
    },
    {
      id: 'basement',
      label: 'Basement · Residential',
      caption: 'A grey slab turned into a mirror-finish silver metallic marble floor.',
      before: {
        src: '/assets/transform/antes2.jpeg',
        alt: 'Residential basement before treatment: dull, marked grey concrete',
      },
      after: {
        src: '/assets/transform/depois2.jpeg',
        alt: 'The same basement after: a high-gloss silver metallic marble epoxy floor',
      },
      width: 1376,
      height: 768,
    },
  ],
} as const;

export const spaces: {
  id: SpaceId;
  title: string;
  line: string;
  body: string;
  image: { src: string; alt: string; width: number; height: number };
}[] = [
  {
    id: 'garage',
    title: 'Garage',
    line: 'Durable. Seamless. Built to perform.',
    body: 'A surface that takes traffic, tools and weather without staining or lifting — and still looks finished.',
    image: {
      src: '/assets/projects/garage_2.jpg',
      alt: 'Home garage with a deep black gloss epoxy floor, a white sports car parked on it',
      width: 717,
      height: 535,
    },
  },
  {
    id: 'residential',
    title: 'Residential',
    line: 'Beautiful surfaces designed for everyday life.',
    body: 'Basements, entryways and living areas finished in a seamless surface that is simple to clean and hard to wear out.',
    image: {
      src: '/assets/projects/residential_6.jpg',
      alt: 'Finished residential basement with a dark silver metallic epoxy floor',
      width: 2048,
      height: 1536,
    },
  },
  {
    id: 'commercial',
    title: 'Commercial & Industrial',
    line: 'Professional spaces deserve a better finish.',
    body: 'Retail floors, salons and studios where the surface is part of how the business presents itself — and production areas and circulation routes that need to take traffic, cleaning and constant use.',
    image: {
      src: '/assets/projects/commercial_1.jpg',
      alt: 'Dark metallic epoxy floor in a barbershop, reflecting hexagonal ceiling lights',
      width: 1215,
      height: 684,
    },
  },
];

export const galleryFilters: { id: SpaceId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'residential', label: 'Residential' },
  { id: 'garage', label: 'Garage' },
  { id: 'commercial', label: 'Commercial & Industrial' },
];

/**
 * Real project photography only. Images that were work-in-progress shots,
 * mis-rotated, letterboxed or carried a marketing overlay were left out so the
 * gallery reads as a finished portfolio.
 */
export const projects: ProjectImage[] = [
  {
    src: '/assets/projects/residential_1.jpg',
    alt: 'Open residential basement with a grey metallic epoxy floor under blue cove lighting',
    category: 'residential',
    width: 2048,
    height: 1536,
  },
  {
    src: '/assets/projects/commercial_1.jpg',
    alt: 'Barbershop with a dark metallic epoxy floor reflecting hexagonal lights',
    category: 'commercial',
    width: 1215,
    height: 684,
  },
  {
    src: '/assets/projects/garage_2.jpg',
    alt: 'Garage with a black gloss epoxy floor, sports car and jet ski',
    category: 'garage',
    width: 717,
    height: 535,
  },
  {
    src: '/assets/projects/commercial_4.jpg',
    alt: 'Retail clothing store with a white and blue marbled epoxy floor',
    category: 'commercial',
    width: 1284,
    height: 1596,
  },
  {
    src: '/assets/projects/residential_2.jpg',
    alt: 'Living space with a pale pearl metallic epoxy floor',
    category: 'residential',
    width: 1345,
    height: 1006,
  },
  {
    src: '/assets/projects/garage_1.jpg',
    alt: 'Large garage finished with a grey and white flake epoxy floor',
    category: 'garage',
    width: 1600,
    height: 1200,
  },
  {
    src: '/assets/projects/commercial_7.jpg',
    alt: 'Barbershop interior with a light blue metallic epoxy floor and inlaid graphics',
    category: 'commercial',
    width: 1440,
    height: 1920,
  },
  {
    src: '/assets/projects/residential_6.jpg',
    alt: 'Residential basement with a dark silver metallic epoxy floor',
    category: 'residential',
    width: 2048,
    height: 1536,
  },
  {
    src: '/assets/projects/garage_5.jpg',
    alt: 'Garage with a uniform grey flake epoxy floor under hexagonal lighting',
    category: 'garage',
    width: 2304,
    height: 1296,
  },
  {
    src: '/assets/projects/commercial_6.jpg',
    alt: 'Entertainment space with a silver metallic marble epoxy floor',
    category: 'commercial',
    width: 1221,
    height: 690,
  },
  {
    src: '/assets/projects/commercial_5.jpg',
    alt: 'Sneaker retail floor finished in white and blue marbled epoxy',
    category: 'commercial',
    width: 768,
    height: 960,
  },
  {
    src: '/assets/projects/residential_3.jpg',
    alt: 'Basement room with a blue-veined metallic epoxy floor',
    category: 'residential',
    width: 960,
    height: 720,
  },
  {
    src: '/assets/projects/garage_4.jpg',
    alt: 'Garage finished with a blue and white flake epoxy floor',
    category: 'garage',
    width: 2048,
    height: 1536,
  },
  {
    src: '/assets/projects/commercial_3.jpg',
    alt: 'Industrial walkway finished with a durable flake epoxy floor',
    category: 'commercial',
    width: 960,
    height: 960,
  },
  {
    src: '/assets/projects/commercial_8.jpg',
    alt: 'Barbershop chairs on a light blue metallic epoxy floor',
    category: 'commercial',
    width: 1440,
    height: 1920,
  },
  {
    src: '/assets/projects/3residential_2.jpg',
    alt: 'Room finished with a warm bronze and grey metallic epoxy floor',
    category: 'residential',
    width: 717,
    height: 536,
  },
];

export const work = {
  eyebrow: 'Selected work',
  title: 'Crafted spaces. Exceptional results.',
  intro: `A selection from more than ${company.projectsCompleted.replace('+', '')} floors installed since ${company.foundedYear}.`,
  cta: 'Get a Quote',
} as const;

/**
 * The six finishes documented in the company brief, each with the sample swatch
 * supplied for it. The swatches are close-ups of the surface itself, so they
 * work as a small texture chip beside the name rather than as project photos.
 */
export const finishes = [
  {
    name: 'Solid Colors',
    description: 'A single, even colour across the whole floor. The most restrained option.',
    swatch: {
      src: '/assets/finishes/coressolidas.avif',
      alt: 'Close-up of a solid-colour epoxy surface',
      width: 600,
      height: 462,
    },
  },
  {
    name: 'Metallic',
    description: 'Pigments moved through the resin so no two installations are ever identical.',
    swatch: {
      src: '/assets/finishes/efeitometalico.avif',
      alt: 'Close-up of a metallic epoxy surface with pigment movement',
      width: 606,
      height: 462,
    },
  },
  {
    name: 'Marble',
    description: 'Veining and depth that reads like stone, poured as one seamless surface.',
    swatch: {
      src: '/assets/finishes/efeitomarmore.avif',
      alt: 'Close-up of a marble-effect epoxy surface',
      width: 612,
      height: 462,
    },
  },
  {
    name: 'Flakes',
    description: 'Broadcast flakes add texture and grip, and hide everyday wear.',
    swatch: {
      src: '/assets/finishes/epoxicomflocos.avif',
      alt: 'Close-up of an epoxy surface with broadcast flakes',
      width: 600,
      height: 438,
    },
  },
  {
    name: 'Sand',
    description: 'A sand-based system for a denser, more tactile finish underfoot.',
    swatch: {
      src: '/assets/finishes/epoxicomareia.avif',
      alt: 'Close-up of a sand-based epoxy surface',
      width: 562,
      height: 414,
    },
  },
  {
    name: 'Metallic Marble',
    description: 'Metallic movement combined with stone-like veining. The most decorative of the six.',
    swatch: {
      src: '/assets/finishes/efeitomarmoremetalico.avif',
      alt: 'Close-up of a metallic marble epoxy surface',
      width: 549,
      height: 414,
    },
  },
] as const;

export const finishesSection = {
  eyebrow: 'Finishes',
  title: 'Six ways to finish a floor.',
  intro:
    'Every floor is specified rather than picked off a shelf. Colour, texture, pattern and level of shine are chosen for the room they go into.',
} as const;

export const why = {
  eyebrow: `Why ${company.name}`,
  title: `${yearsInBusiness} years of finished floors.`,
  pillars: [
    {
      value: `${yearsInBusiness}+`,
      title: 'Years of experience',
      body: `Installing epoxy flooring systems since ${company.foundedYear}.`,
    },
    {
      value: company.projectsCompleted,
      title: 'Completed projects',
      body: 'A documented history of work across the region, not a portfolio of renders.',
    },
    {
      value: '3',
      title: 'Segments served',
      body: 'Residential, commercial and industrial — each with different demands on the surface.',
    },
    {
      value: '6',
      title: 'Finish systems',
      body: 'Solid colours through to metallic marble, specified to the space.',
    },
  ],
} as const;

/**
 * Standard sequence for an epoxy installation. The company brief does not
 * document a named, step-by-step process, so this is described in general terms
 * only — no timelines, guarantees or proprietary method names are claimed.
 */
export const process = {
  eyebrow: 'How it works',
  title: 'Four stages, one surface.',
  steps: [
    {
      number: '01',
      title: 'Consultation',
      body: 'We look at the space, how it gets used, and which finish suits it. You get a quote from that.',
    },
    {
      number: '02',
      title: 'Surface preparation',
      body: 'The existing slab is prepared and repaired. This stage decides how well the floor holds up.',
    },
    {
      number: '03',
      title: 'Installation',
      body: 'The system is applied in coats, with the chosen colour, texture and pattern worked in.',
    },
    {
      number: '04',
      title: 'Final result',
      body: 'The floor cures, gets its final inspection, and the space is handed back ready to use.',
    },
  ],
} as const;

/**
 * Google reviews, transcribed verbatim from the business profile along with the
 * reviewer avatars supplied with them. Nothing here is written by us — if a
 * review changes on Google, change it here too.
 */
export const reviews = {
  title: 'Trusted by Our Customers',
  rating: '5.0',
  ratingLine: 'on Google',
  intro: `See what our customers have to say about their experience with ${company.name}.`,
  items: [
    {
      name: 'Nuith Maximus',
      avatar: '/assets/reviews/nuith-maximus.png',
      body: 'Empresa muito responsável, atendeu as expectativas, muito responsável',
    },
    {
      name: 'Danny Dilip Wadhwani',
      avatar: '/assets/reviews/danny-dilip-wadhwani.png',
      body: 'Fabio did a phenomenal job on my garage floor this weekend. I chose the Tidal Wave finish, and the result is simply beautiful — clean, polished, and done with real precision. He showed up right on time, worked efficiently with his assistant, and completed everything in a single day without cutting any corners. What stood out most was his attention to detail and the pride he clearly takes in his work. Fabio is reliable, highly capable, and delivers exactly what he promises. I’m genuinely impressed — and would recommend him without hesitation.',
    },
    {
      name: 'Jason Mello',
      avatar: '/assets/reviews/jason-mello.png',
      body: 'Tecno Epoxi provides a 5 star experience. Everything from planning the job, to preparing the surface, to the finished product was excellent.',
    },
    {
      name: 'Vicente Cabriotti',
      avatar: '/assets/reviews/vicente-cabriotti.png',
      body: 'Very professional, drove 1 and half hours to give me a quote. Hired on the spot, great pricing. Will be hiring them for my other buildings.',
    },
    {
      name: 'Janice Cataldo',
      avatar: '/assets/reviews/janice-cataldo.png',
      body: 'We recently hired Tecno Epoxi Flooring to apply an epoxy finish to our garage floor. We are thrilled with the results. Fabio, the owner, was professional, very hard working and did a wonderful job. We highly recommend Fabio and his company if you are considering this service.',
    },
  ],
} as const;

export const proof = {
  eyebrow: 'Track record',
  title: 'The work speaks first.',
  body: `Tecno Epoxy has been installing epoxy floors from ${company.address.city}, ${company.address.state} since ${company.foundedYear}. Every photograph on this page is a floor we installed.`,
  // A floor-filling frame: crops well into the tall half-width panel without
  // losing the subject the way a wide interior shot would.
  image: {
    src: '/assets/projects/residential_2.jpg',
    alt: 'Pale pearl metallic epoxy floor reflecting the room above it',
    width: 1345,
    height: 1006,
  },
} as const;

export const finalCta = {
  title: 'Ready to transform your space?',
  body: 'Tell us about the room. We will come back with a quote.',
  cta: 'Get Your Free Quote',
  image: {
    src: '/assets/projects/residential_6.jpg',
    alt: 'Residential basement with a dark silver metallic epoxy floor',
    width: 2048,
    height: 1536,
  },
} as const;

export const quoteForm = {
  eyebrow: 'Request a quote',
  title: "Let's understand your project.",
  intro: 'A few details are enough to get started. We will follow up by phone or email.',
  submit: 'Request My Quote',
  successTitle: 'Request received.',
  successBody: 'Thank you — we will be in touch shortly to talk through your project.',
} as const;

/**
 * WhatsApp copy, kept here so every entry point says the same thing.
 *
 * The label leads with photos on purpose. "Chat on WhatsApp" invites a cold
 * "how much?" that cannot be answered; asking for photos of the slab gets the
 * one thing needed to quote, and it is the single job the form cannot do.
 */
export const whatsapp = {
  label: 'Send Photos on WhatsApp',
  shortLabel: 'WhatsApp',
  /** Pre-filled first message. Keeps the customer from staring at an empty box. */
  prefill: `Hi ${company.name}! I'd like a quote for epoxy flooring. Here are photos of my space:`,
  /** Shown under the form as the alternative route. */
  formAside: 'Prefer to send photos? Message us on WhatsApp and we can quote faster.',
} as const;

export const seo = {
  title: `${company.legalName} — Epoxy Flooring in ${company.address.city}, ${company.address.state}`,
  description: `Custom epoxy flooring for residential, commercial and industrial spaces in ${company.region}. Installing metallic, marble, flake and solid-colour floors since ${company.foundedYear}. Request a free quote.`,
} as const;
