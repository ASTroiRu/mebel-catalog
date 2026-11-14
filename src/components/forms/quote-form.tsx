'use client';
import Link from 'next/link';
import { containDialogTab } from '@/lib/dialog-focus';
import { useEffect, useRef, useState } from 'react';
import { emptyQuote, validateQuote, type QuoteField, type QuoteValues } from '@/lib/quote-validation';
import type { QuoteCategory, QuoteRequest } from '@/lib/quote-context';

function ErrorText({ field, message }: { field: QuoteField; message?: string }) {
  return message ? <p className="field-error" id={`quote-${field}-error`} role="status">{message}</p> : null;
}

export function QuoteForm({ categories, request, returnFocus, onClose, onSuccess }: {
  categories: readonly QuoteCategory[]; request: QuoteRequest; returnFocus: HTMLElement | null;
  onClose: () => void; onSuccess: () => void;
}) {
  const [values, setValues] = useState<QuoteValues>({ ...emptyQuote, categoryId: request.categoryId ?? '' });
  const [file, setFile] = useState<File | null>(null);
  const [touched, setTouched] = useState<Partial<Record<QuoteField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const errors = validateQuote(values, file, categories.map(item => item.id));
  const title = request.intent === 'measurement' ? 'Записаться на замер' : 'Рассчитать стоимость';
  const modelName = values.categoryId === request.categoryId ? request.modelName : undefined;

  useEffect(() => {
    const modal = dialog.current!;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    heading.current?.focus();
    const viewport = window.visualViewport;
    function size() {
      modal.style.setProperty('--quote-viewport-height', `${viewport?.height ?? window.innerHeight}px`);
      modal.style.setProperty('--quote-viewport-top', `${viewport?.offsetTop ?? 0}px`);
    }
    size();
    viewport?.addEventListener('resize', size);
    viewport?.addEventListener('scroll', size);
    window.addEventListener('resize', size);
    return () => {
      viewport?.removeEventListener('resize', size);
      viewport?.removeEventListener('scroll', size);
      window.removeEventListener('resize', size);
      modal.close();
      document.body.style.overflow = oldOverflow;
      if (returnFocus?.isConnected) returnFocus.focus();
    };
  }, [returnFocus]);

  function touch(field: QuoteField) { setTouched(current => ({ ...current, [field]:true })); }
  function update<K extends keyof QuoteValues>(field: K, value: QuoteValues[K]) {
    setValues(current => ({ ...current, [field]:value }));
    touch(field);
  }
  function error(field: QuoteField) { return (submitted || touched[field]) ? errors[field] : undefined; }
  function errorProps(field: QuoteField) {
    return { 'aria-invalid': !!error(field), 'aria-describedby': error(field) ? `quote-${field}-error` : undefined };
  }
  return <dialog ref={dialog} className="quote-dialog" aria-labelledby="quote-title" aria-describedby="quote-demo-note"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onKeyDown={event => { containDialogTab(event, dialog.current); if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); } }}>
    <div className="quote-dialog-header"><div><p className="eyebrow">Демонстрационная форма</p><h2 ref={heading} tabIndex={-1} id="quote-title">{title}</h2></div><button type="button" className="quote-close" aria-label="Закрыть форму" onClick={onClose}>×</button></div>
    <div className="quote-scroll">
      <p id="quote-demo-note" className="quote-note">Данные и файл остаются только в этой открытой форме. Заявка не отправляется. Для проверки можно использовать вымышленные данные.</p>
      <p className="quote-note">Поля со звёздочкой обязательны.</p>
      {modelName && <p className="quote-model">Модель: <strong>{modelName}</strong> · Демо</p>}
      <form noValidate autoComplete="off" onSubmit={event => {
        event.preventDefault();
        setSubmitted(true);
        const first = Object.keys(errors)[0];
        if (first) { const element = event.currentTarget.elements.namedItem(first); if (element instanceof HTMLElement) element.focus(); return; }
        onSuccess();
      }}>
        <div className="quote-field"><label htmlFor="quote-categoryId">Тип мебели *</label><select id="quote-categoryId" name="categoryId" required value={values.categoryId} onChange={event => update('categoryId', event.target.value)} onBlur={() => touch('categoryId')} {...errorProps('categoryId')}><option value="">Выберите тип мебели</option>{categories.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select><ErrorText field="categoryId" message={error('categoryId')} /></div>
        <fieldset className="quote-dimensions"><legend>Размеры в сантиметрах <span>— необязательно</span></legend><div>{(['width','height','depth'] as const).map((field, i) => <div className="quote-field" key={field}><label htmlFor={`quote-${field}`}>{['Ширина','Высота','Глубина'][i]}</label><input type="text" inputMode="decimal" id={`quote-${field}`} name={field} value={values[field]} placeholder={['180','240','60'][i]} onChange={event => update(field,event.target.value)} onBlur={() => touch(field)} {...errorProps(field)} /><ErrorText field={field} message={error(field)} /></div>)}</div></fieldset>
        <div className="quote-field"><label htmlFor="quote-name">Имя *</label><input id="quote-name" name="name" required value={values.name} onChange={event => update('name',event.target.value)} onBlur={() => touch('name')} {...errorProps('name')} /><ErrorText field="name" message={error('name')} /></div>
        <div className="quote-field"><label htmlFor="quote-phone">Телефон *</label><input id="quote-phone" name="phone" type="tel" inputMode="tel" placeholder="+7 или 8, затем 10 цифр" required value={values.phone} onChange={event => update('phone',event.target.value)} onBlur={() => touch('phone')} {...errorProps('phone')} /><ErrorText field="phone" message={error('phone')} /></div>
        <div className="quote-field"><label htmlFor="quote-comment">Комментарий <span>— необязательно</span></label><textarea id="quote-comment" name="comment" rows={3} value={values.comment} onChange={event => update('comment',event.target.value)} /></div>
        <div className="quote-field"><label htmlFor="quote-file">Эскиз или фото <span>— необязательно</span></label><input ref={fileInput} id="quote-file" name="file" type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={event => { setFile(event.target.files?.[0] ?? null); touch('file'); }} {...errorProps('file')} aria-describedby={error('file') ? 'quote-file-hint quote-file-error' : 'quote-file-hint'} /><p id="quote-file-hint" className="quote-note">JPG, PNG или PDF, до 10 МБ. Файл никуда не загружается.</p>{file && <div className="selected-file"><span>{file.name}</span><button type="button" onClick={() => { setFile(null); if (fileInput.current) fileInput.current.value = ''; }}>Убрать файл</button></div>}<ErrorText field="file" message={error('file')} /></div>
        <div className="quote-field"><label className="consent-label" htmlFor="quote-consent"><input id="quote-consent" name="consent" type="checkbox" required checked={values.consent} onChange={event => update('consent',event.target.checked)} {...errorProps('consent')} /><span>Согласен на обработку персональных данных *</span></label><ErrorText field="consent" message={error('consent')} /><p className="quote-note">В деморежиме данные не передаются и не сохраняются. <Link href="/privacy/" onClick={onClose}>Проект политики конфиденциальности</Link>.</p></div>
        <button className="button button-primary quote-submit" type="submit">Проверить форму</button>
      </form>
    </div>
  </dialog>;
}
