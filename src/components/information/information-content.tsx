import Link from 'next/link';
import type { InformationPage } from '@/content/models';
import { QuoteButton } from '@/components/ui/quote-button';

export function InformationContent({ page }: { page: InformationPage }) {
  if (page.slug === 'process') return <>
    <ol className="process-grid information-process">{page.sections.map((section, index) => <li key={section.heading}><span className="step-number">0{index + 1}</span><h2>{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}</li>)}</ol>
    <p className="section-note">Сроки, стоимость и гарантийные условия согласуются для конкретного заказа.</p><Link className="section-link" href="/zamer/">О бесплатном замере →</Link>
  </>;
  if (page.slug === 'faq') return <div className="information-faq">{(page.faqGroups ?? []).map(group => <section className="faq-group" key={group.heading}><h2 className="section-title">{group.heading}</h2><div className="faq-list">{group.items.map(item => <details className="faq-item" key={item.question}><summary>{item.question}<span className="faq-icon" aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></section>)}</div>;
  if (page.slug === 'materials') return <>
    <div className="home-grid four-columns">{(page.materials ?? []).map(material => <article key={material.id} className="material-card"><div className={`material-swatch swatch-${material.id}`} role="img" aria-label={`${material.title}: условный образец, не фотография`} /><h2>{material.title}</h2><p>{material.description}</p></article>)}</div>
    <p className="section-note">Условные образцы, не фотографии материалов поставщика. Цвет, фактуру и подходящую отделку уточняют по реальным образцам. Изображения образцов будут заменены после получения материалов с подтверждёнными правами.</p><Link href="/projects/" className="section-link">Сочетания в концептах →</Link>
  </>;
  if (page.slug === 'contacts') return <>
    <dl className="product-specs contact-details">{(page.contactFields ?? []).map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <p className="section-note">Контактные данные ещё не заполнены. Форма доступна только для проверки интерфейса; связаться через неё нельзя.</p><Link href="/zamer/" className="section-link">Узнать о замере →</Link>
  </>;
  return <div className="information-copy">{page.sections.map(section => <section className="catalog-section" key={section.heading}><h2 className="section-title">{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}</section>)}</div>;
}
export function InformationCta({ measurement = false }: { measurement?: boolean }) {
  return <section className="information-cta"><h2 className="section-title">{measurement ? 'Обсудим ваше помещение' : 'Расскажите о вашей идее'}</h2><QuoteButton intent={measurement ? 'measurement' : 'quote'} label={measurement ? 'Записаться на замер' : undefined} className="mt-6" /><p className="section-note">Демонстрационная форма: данные не отправляются и не сохраняются.</p></section>;
}
