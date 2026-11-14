'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { DEMO_SUCCESS } from '@/lib/quote-validation';
import { resolveQuoteContext, type QuoteCategory, type QuoteProduct, type QuoteRequest } from '@/lib/quote-context';
import { QuoteForm } from './quote-form';

type OpenQuote = (request?: QuoteRequest, returnFocus?: HTMLElement | null) => void;
const QuoteContext = createContext<OpenQuote | null>(null);
export function useQuote() {
  const open = useContext(QuoteContext);
  if (!open) throw new Error('QuoteButton requires QuoteProvider');
  return open;
}
export function QuoteProvider({ children, categories, products }: { children: ReactNode; categories: readonly QuoteCategory[]; products: readonly QuoteProduct[] }) {
  const [request, setRequest] = useState<QuoteRequest | null>(null);
  const [toast, setToast] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(false), 8000);
    return () => clearTimeout(timeout);
  }, [toast]);
  function open(options: QuoteRequest = {}, target?: HTMLElement | null) {
    returnFocus.current = target ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setToast(false);
    setRequest(resolveQuoteContext(window.location.pathname, options, categories, products));
  }
  return <QuoteContext.Provider value={open}>{children}
    {request && <QuoteForm categories={categories} request={request} returnFocus={returnFocus.current} onClose={() => setRequest(null)} onSuccess={() => { setRequest(null); setToast(true); }} />}
    <div className="quote-toast-region" role="status" aria-live="polite" aria-atomic="true">{toast && <div className="quote-toast"><p>{DEMO_SUCCESS}</p><button type="button" aria-label="Закрыть уведомление" onClick={() => setToast(false)}>×</button></div>}</div>
  </QuoteContext.Provider>;
}
