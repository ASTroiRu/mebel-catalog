'use client';
import type { RefObject } from 'react';
import { useQuote } from '@/components/forms/quote-provider';
import type { QuoteRequest } from '@/lib/quote-context';
export function QuoteButton({ className = '', label, categoryId, modelName, intent = 'quote', variant = 'primary', returnFocusRef, onOpen }: QuoteRequest & {
  className?: string; label?: string; variant?: 'primary' | 'link'; returnFocusRef?: RefObject<HTMLElement | null>; onOpen?: () => void;
}) {
  const open = useQuote();
  return <button type="button" className={variant === 'link' ? `quote-link ${className}` : `button button-primary ${className}`}
    aria-haspopup="dialog" data-quote-intent={intent} data-quote-category={categoryId} data-quote-model={modelName}
    onClick={event => { open({ intent, categoryId, modelName }, returnFocusRef?.current ?? event.currentTarget); onOpen?.(); }}>
    {label ?? (intent === 'measurement' ? 'Бесплатный замер' : 'Рассчитать стоимость')}
    {variant === 'primary' && <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" /></svg>}
  </button>;
}
