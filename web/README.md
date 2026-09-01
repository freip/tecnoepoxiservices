# Tecno Epoxy — Landing Page (v1)

A one-page, conversion-focused landing page for Tecno Epoxy Flooring.

Narrative order: **impact → desire → proof → understanding → trust → quote.**

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run typecheck
```

Node 20+ recommended (built and verified on Node 24).

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **CSS Modules** with a design-token layer in `src/styles/globals.css` — no utility
  framework, so the editorial layout stays readable and easy to adjust
- `next/image` for responsive AVIF/WebP delivery
- No runtime dependencies beyond React and Next

## Editing content

**All copy and image references live in one file: [`src/content/site.ts`](src/content/site.ts).**
Components never hardcode text. To change a headline, swap a photo, reorder the
gallery or update contact details, edit that file only.

### Content rules followed

Everything factual on the page traces back to the supplied company brief:
founded 2014, 200+ projects, Dracut MA, the phone/email/address, the three
segments (residential / commercial / industrial) and the six finish systems.

Two deliberate decisions worth knowing about:

- **No testimonials.** None were supplied, so none were invented. The social
  proof section (`Testimonials.tsx`) shows verifiable figures and real project
  photography instead. It has a documented slot for adding real reviews later.
- **The Process section is described in general terms.** The brief does not
  document a named, step-by-step method, so the four stages avoid claiming
  timelines, warranties or proprietary techniques.

### Photography

Only finished work appears in the gallery. Images that were work-in-progress
shots, mis-rotated, letterboxed, or carried a marketing overlay were excluded.
Tiles crop (`object-fit: cover`) but never stretch, and the Before/After frames
preserve each pair's true aspect ratio.

Brand assets are used as supplied — `scripts/prepare-brand.mjs` only trims empty
padding and resizes (`npm run brand:prepare`); it never recolours or redraws the
mark.

## Component map

| Section | Component |
| --- | --- |
| 01 Hero | `Hero.tsx` |
| 02 Before / After | `Transformation.tsx` + `BeforeAfterSlider.tsx` |
| 03 Spaces we transform | `Spaces.tsx` |
| 04 Our work | `ProjectsGallery.tsx` + `Lightbox.tsx` |
| 05 Solutions / finishes | `Solutions.tsx` |
| 06 Why Tecno | `WhyTecno.tsx` |
| 07 Our process | `Process.tsx` |
| 08 Social proof | `Testimonials.tsx` |
| 09 Final CTA | `FinalCTA.tsx` |
| 10 Quote form | `QuoteForm.tsx` |
| Chrome | `Header.tsx`, `Footer.tsx` |

Shared primitives live in `src/components/ui/` (`CtaButton`, `Reveal`).

## ⚠️ Before going live

**`POST /api/quote` validates and logs submissions but does not yet deliver
them.** Wire up delivery in
[`src/app/api/quote/route.ts`](src/app/api/quote/route.ts) — email, database or
CRM — or quote requests will only appear in the server logs.

## Built to evolve into the AI flow

The brief calls for this form to become a conversational qualification flow and
later feed an AI recommendation and CRM hand-off. Three choices in
[`src/lib/quote.ts`](src/lib/quote.ts) make that a change of surface, not a rewrite:

1. **One typed payload.** `QuoteRequest` is flat and serialisable. A multi-step
   wizard collects the *same* object — only the UI changes. `currentCondition`
   and `photoCount` are already declared for the planned steps.
2. **Constrained answers.** `projectType`, `approximateSize` and
   `currentCondition` are unions, not free text, so they can feed a model or a
   scoring rule without parsing.
3. **One outbound path.** Everything goes through `submitQuoteRequest()` into a
   single API route. Adding AI enrichment or a CRM means changing that route —
   no component touches the network directly.

## Accessibility & performance notes

- Before/After divider is a real `role="slider"`: arrow keys step, Shift+arrow
  jumps, Home/End go to the extremes.
- Lightbox traps focus, restores it on close, and handles Escape / arrow keys.
- Form errors are announced (`role="alert"`) and focus moves to the first
  invalid field.
- `prefers-reduced-motion` disables parallax, reveals and transitions.
- Scroll reveals start *visible* and only hide once the observer is confirmed
  running, so content is never trapped invisible if JS fails.
- Hero image is `priority`; everything below the fold is lazy-loaded.
- Verified: no horizontal overflow at 360 / 390 / 768 px.
