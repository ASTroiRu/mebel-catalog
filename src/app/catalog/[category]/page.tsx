import { buildMetadata } from '@/lib/seo';
import { PageStructuredData } from '@/components/seo/structured-data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { content } from '@/content/repository';
import { categoryPath } from '@/lib/catalog-paths';
import { Breadcrumbs } from '@/components/catalog/breadcrumbs';
import { ProductCard } from '@/components/catalog/product-card';
import { QuoteButton } from '@/components/ui/quote-button';
export const dynamicParams = false;
export async function generateStaticParams() { return (await content.getCategories()).map(category => ({ category: category.slug })); }
type Props = { params: Promise<{ category: string }> };
export async function generateMetadata({ params }: Props) { const category = await content.getCategory((await params).category); if (!category) notFound(); return buildMetadata(`/catalog/${category.slug}/`, category.seo); }
export default async function CategoryPage({ params }: Props) {
  const category = await content.getCategory((await params).category); if (!category) notFound();
  const [products, categories] = await Promise.all([content.getProducts(category.id), content.getCategories()]);
  return <div className="page-container catalog-page"><PageStructuredData path={`/catalog/${category.slug}/`} seo={category.seo} type="CollectionPage" /><Breadcrumbs path={`/catalog/${category.slug}/`} items={[{ label:'Каталог', href:'/catalog/' }, { label:category.title }]} />
    <header className="catalog-intro"><p className="eyebrow">Индивидуальная мебель · Демо</p><h1 className="page-title">{category.heading}</h1><p>{category.description}</p></header>
    <div className="category-banner"><Image src={category.image.src} alt={category.image.alt} fill sizes="(max-width: 1344px) 90vw, 1280px" preload style={{ objectFit:'cover', objectPosition:category.image.position }} /></div><p className="section-note">Интерьерная иллюстрация направления, не работа компании.</p>
    <section className="catalog-section" aria-labelledby="models-title"><h2 id="models-title" className="section-title">Демонстрационные модели</h2><div className="home-grid three-columns mt-8">{products.map(product => <ProductCard key={product.id} product={product} category={category} />)}</div></section>
    <section className="catalog-section"><h2 className="section-title">Особенности решения</h2><ul className="feature-list">{category.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>
    <section className="catalog-section"><h2 className="section-title">Как заказать</h2><p className="catalog-copy">Обсуждаем задачу, проводим предварительный замер, проектируем мебель и согласовываем комплектацию. После согласования проект передаётся партнёрскому производству. Условия доставки и установки обсуждаются отдельно.</p></section>
    <section className="catalog-section"><h2 className="section-title mb-6">Вопросы о категории</h2>{category.faq.map(item => <details className="faq-item" key={item.question}><summary>{item.question}<span className="faq-icon" aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</section>
    <section className="cta-panel"><div><h2 className="section-title">Обсудим ваше решение</h2><p className="mt-4">Предварительный замер и расчёт бесплатны.</p></div><div><QuoteButton categoryId={category.id} /><p className="text-xs text-muted mt-3">Демо: проверка без отправки заявки.</p></div></section>
    <nav aria-label="Другие категории" className="catalog-section"><h2 className="section-title mb-5">Другие категории</h2><div className="category-links">{categories.filter(item => item.id !== category.id).map(item => <Link key={item.id} href={categoryPath(item)} className="button button-secondary">{item.title} ↗</Link>)}</div></nav>
  </div>;
}
