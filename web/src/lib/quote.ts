/**
 * Quote request domain model.
 *
 * FUTURE-PROOFING NOTE
 * --------------------
 * The brief calls for this form to evolve into a conversational, AI-assisted
 * qualification flow ("Let's understand your project" → space type → size →
 * current condition → goals → photos), and eventually to score leads, suggest a
 * finish, estimate a range and hand off to a CRM.
 *
 * Three decisions here make that a change of surface rather than a rewrite:
 *
 *  1. The payload is a flat, typed, serialisable record with stable field names.
 *     A multi-step wizard collects the SAME `QuoteRequest` — only the UI that
 *     gathers it changes. `photoCount` is already carved out for uploads.
 *  2. Answers that will drive an AI recommendation (`projectType`,
 *     `approximateSize`, `currentCondition`) are constrained unions, not free
 *     text, so they can be fed to a model or scoring rule without parsing.
 *  3. Submission goes through one `submitQuoteRequest` adapter. Swapping the
 *     destination — CRM, queue, or an AI enrichment step before either — means
 *     changing that function and the route it calls, nothing in the components.
 */

export const PROJECT_TYPES = ['garage', 'residential', 'commercial', 'other'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const SIZE_RANGES = [
  'under-500',
  '500-1000',
  '1000-2500',
  'over-2500',
  'not-sure',
] as const;
export type SizeRange = (typeof SIZE_RANGES)[number];

/** Not collected in v1. Declared now so the wizard can populate it without a migration. */
export const CONDITIONS = ['new-slab', 'good', 'worn', 'damaged', 'not-sure'] as const;
export type Condition = (typeof CONDITIONS)[number];

export interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  projectType: ProjectType;
  approximateSize: SizeRange;
  location: string;
  message: string;
  /** Reserved for the upload step; v1 records intent only, not the files. */
  photoCount: number;
  /** Reserved for the qualification wizard. */
  currentCondition?: Condition;
  /** Where the lead came from — useful once campaigns point at this page. */
  source?: string;
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  garage: 'Garage',
  residential: 'Residential',
  commercial: 'Commercial',
  other: 'Other',
};

export const SIZE_RANGE_LABELS: Record<SizeRange, string> = {
  'under-500': 'Under 500 sq ft',
  '500-1000': '500 – 1,000 sq ft',
  '1000-2500': '1,000 – 2,500 sq ft',
  'over-2500': 'Over 2,500 sq ft',
  'not-sure': 'Not sure yet',
};

export type QuoteErrors = Partial<Record<keyof QuoteRequest, string>>;

/**
 * Shared validation, run on the client for instant feedback and again on the
 * server so the rules cannot be bypassed by posting directly to the endpoint.
 */
export function validateQuoteRequest(input: Partial<QuoteRequest>): QuoteErrors {
  const errors: QuoteErrors = {};

  if (!input.name?.trim()) {
    errors.name = 'Please tell us your name.';
  }

  const email = input.email?.trim() ?? '';
  const phone = input.phone?.trim() ?? '';

  // One reliable way to reach the customer is enough — don't demand both.
  if (!email && !phone) {
    errors.email = 'Add an email address or a phone number so we can reply.';
  } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'That email address does not look right.';
  } else if (!email && phone.replace(/\D/g, '').length < 7) {
    errors.phone = 'That phone number does not look right.';
  }

  if (!input.projectType || !PROJECT_TYPES.includes(input.projectType)) {
    errors.projectType = 'Choose the type of space.';
  }

  if (input.approximateSize && !SIZE_RANGES.includes(input.approximateSize)) {
    errors.approximateSize = 'Choose an approximate size.';
  }

  return errors;
}

export interface QuoteSubmissionResult {
  ok: boolean;
  message?: string;
}

/**
 * The single outbound path for a quote request.
 *
 * Today it posts to our own API route. To add AI qualification or a CRM
 * hand-off, change what that route does — callers stay untouched.
 */
export async function submitQuoteRequest(
  request: QuoteRequest
): Promise<QuoteSubmissionResult> {
  try {
    const response = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    const data = (await response.json().catch(() => ({}))) as { message?: string };

    if (!response.ok) {
      return { ok: false, message: data.message ?? 'We could not send that. Please try again.' };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: 'Network error. Please try again, or call us directly.',
    };
  }
}
