'use client';

import { useId, useRef, useState } from 'react';
import { company, quoteForm } from '@/content/site';
import {
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  SIZE_RANGES,
  SIZE_RANGE_LABELS,
  submitQuoteRequest,
  validateQuoteRequest,
  type ProjectType,
  type QuoteErrors,
  type QuoteRequest,
  type SizeRange,
} from '@/lib/quote';
import { CtaButton } from './ui/CtaButton';
import { Reveal } from './ui/Reveal';
import styles from './QuoteForm.module.css';

const EMPTY: QuoteRequest = {
  name: '',
  email: '',
  phone: '',
  projectType: 'residential',
  approximateSize: 'not-sure',
  location: '',
  message: '',
  photoCount: 0,
  source: 'landing-page',
};

/**
 * Short by design — the brief asks for a premium, low-friction form, not an
 * intake questionnaire. It collects the full `QuoteRequest` shape so the planned
 * step-by-step qualification flow can replace this UI without changing the
 * payload, the validation or the endpoint.
 */
export function QuoteForm() {
  const formId = useId();
  const [values, setValues] = useState<QuoteRequest>(EMPTY);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState('');
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const field = <K extends keyof QuoteRequest>(key: K, value: QuoteRequest[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error as soon as the user edits it.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validateQuoteRequest(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus('idle');
      // Send focus to the first problem so keyboard and screen-reader users
      // are not left guessing what failed.
      const firstKey = Object.keys(found)[0];
      document.getElementById(`${formId}-${firstKey}`)?.focus();
      return;
    }

    setStatus('sending');
    const result = await submitQuoteRequest({ ...values, photoCount: photoNames.length });

    if (result.ok) {
      setStatus('sent');
      setValues(EMPTY);
      setPhotoNames([]);
      if (fileRef.current) fileRef.current.value = '';
    } else {
      setStatus('error');
      setServerMessage(result.message ?? '');
    }
  };

  if (status === 'sent') {
    return (
      <section className={`section ${styles.section}`} id="quote">
        <div className="shell">
          <div className={styles.success} role="status">
            <span className={styles.successMark} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
                <path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <h2 className={styles.successTitle}>{quoteForm.successTitle}</h2>
            <p className={styles.successBody}>{quoteForm.successBody}</p>
            <a className={styles.successPhone} href={company.phoneHref}>
              {company.phone}
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`section ${styles.section}`} id="quote">
      <div className={`shell ${styles.grid}`}>
        <Reveal className={`section-head ${styles.aside}`}>
          <p className="eyebrow">{quoteForm.eyebrow}</p>
          <h2 className={styles.title}>{quoteForm.title}</h2>
          <p className="lede">{quoteForm.intro}</p>

          <dl className={styles.contact}>
            <div>
              <dt>Call</dt>
              <dd>
                <a href={company.phoneHref}>{company.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={company.emailHref}>{company.email}</a>
              </dd>
            </div>
            <div>
              <dt>Visit</dt>
              <dd>
                {company.address.street}
                <br />
                {company.address.city}, {company.address.state} {company.address.zip}
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal className={styles.formWrap}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.row}>
              <Field
                id={`${formId}-name`}
                label="Name"
                required
                error={errors.name}
                value={values.name}
                autoComplete="name"
                onChange={(v) => field('name', v)}
              />
              <Field
                id={`${formId}-location`}
                label="Location"
                placeholder="City or town"
                value={values.location}
                autoComplete="address-level2"
                onChange={(v) => field('location', v)}
              />
            </div>

            <div className={styles.row}>
              <Field
                id={`${formId}-email`}
                label="Email"
                type="email"
                error={errors.email}
                value={values.email}
                autoComplete="email"
                onChange={(v) => field('email', v)}
              />
              <Field
                id={`${formId}-phone`}
                label="Phone"
                type="tel"
                error={errors.phone}
                value={values.phone}
                autoComplete="tel"
                onChange={(v) => field('phone', v)}
              />
            </div>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                Project type <span aria-hidden="true">*</span>
              </legend>
              <div className={styles.choices} id={`${formId}-projectType`} tabIndex={-1}>
                {PROJECT_TYPES.map((type) => (
                  <label
                    key={type}
                    className={[
                      styles.choice,
                      values.projectType === type && styles.choiceActive,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <input
                      type="radio"
                      name="projectType"
                      value={type}
                      checked={values.projectType === type}
                      onChange={() => field('projectType', type as ProjectType)}
                      className="sr-only"
                    />
                    {PROJECT_TYPE_LABELS[type]}
                  </label>
                ))}
              </div>
              {errors.projectType && (
                <p className={styles.error} role="alert">
                  {errors.projectType}
                </p>
              )}
            </fieldset>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-approximateSize`}>
                Approximate size
              </label>
              <div className={styles.selectWrap}>
                <select
                  id={`${formId}-approximateSize`}
                  className={styles.select}
                  value={values.approximateSize}
                  onChange={(e) => field('approximateSize', e.target.value as SizeRange)}
                >
                  {SIZE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {SIZE_RANGE_LABELS[range]}
                    </option>
                  ))}
                </select>
                <span className={styles.selectArrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-message`}>
                Tell us about the space
              </label>
              <textarea
                id={`${formId}-message`}
                className={styles.textarea}
                rows={4}
                value={values.message}
                placeholder="Current condition, what you have in mind, timing…"
                onChange={(e) => field('message', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Photos (optional)</span>
              <label className={styles.upload} htmlFor={`${formId}-photos`}>
                <span className={styles.uploadIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <path
                      d="M12 16V4m0 0L7 9m5-5l5 5M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <span>
                  {photoNames.length > 0
                    ? `${photoNames.length} photo${photoNames.length > 1 ? 's' : ''} selected`
                    : 'Add photos of the space'}
                </span>
              </label>
              <input
                ref={fileRef}
                id={`${formId}-photos`}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) =>
                  setPhotoNames(Array.from(e.target.files ?? []).map((f) => f.name))
                }
              />
              {/* v1 records how many photos were offered; upload transport lands
                  with the AI photo-analysis step. */}
              <p className={styles.hint}>
                Photos help us quote accurately. We&apos;ll ask for them again if needed.
              </p>
            </div>

            {status === 'error' && serverMessage && (
              <p className={styles.formError} role="alert">
                {serverMessage}
              </p>
            )}

            <div className={styles.submitRow}>
              <CtaButton type="submit" size="lg" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : quoteForm.submit}
              </CtaButton>
              <p className={styles.privacy}>
                We use your details only to reply to this request.
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required,
  error,
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        className={[styles.input, error && styles.inputError].filter(Boolean).join(' ')}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p className={styles.error} id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
