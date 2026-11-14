import { buildMetadata } from '@/lib/seo';
import { PageStructuredData } from '@/components/seo/structured-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { content } from '@/content/repository';
import { Breadcrumbs } from '@/components/catalog/breadcrumbs';
import { ImageGallery } from '@/components/gallery/image-gallery';
import { QuoteButton } from '@/components/ui/quote-button';
export const dynamicParams = false;
export async function generateStaticParams() { return (await content.getConcepts()).map(c => ({ concept: c.slug })); }
type Props = { params: Promise<{ concept: string }> };
export async function generateMetadata({ params }: Props) {
  const concept = await content.getConcept((await params).concept);
  if (!concept) notFound();
  return buildMetadata(`/projects/${concept.slug}/`, concept.seo);
}
export default async function ConceptPage({ params }: Props) {
  const concept = await content.getConcept((await params).concept);
  if (!concept) notFound();
  const category = (await content.getCategories()).find(c => c.id === concept.categoryId);
  if (!category) notFound();
  return <div className="page-container catalog-page">
    <PageStructuredData path={`/projects/${concept.slug}/`} seo={concept.seo} type="WebPage" /><Breadcrumbs path={`/projects/${concept.slug}/`} items={[{ label: 'Концепты', href: '/projects/' }, { label: concept.title }]} />
    <header className="catalog-intro"><p className="eyebrow">Концепт · {category.title}</p><h1 className="page-title">{concept.title}</h1><p>Интерьерная идея для обсуждения, не выполненный заказ.</p></header>
    <div className="product-overview"><ImageGallery images={concept.images} title={concept.title} /><aside className="product-summary"><h2 className="section-title">Идея интерьера</h2><p className="mt-6">{concept.description}</p><QuoteButton categoryId={category.id} className="mt-6" /><p className="section-note">Демо: проверка без отправки заявки.</p><Link href={`/catalog/${category.slug}/`} className="section-link">{category.title} в каталоге →</Link></aside></div>
    <section className="catalog-section"><h2 className="section-title">Материалы и цветовая гамма</h2><dl className="product-specs"><div><dt>Материалы для обсуждения</dt><dd>{concept.materials.join(', ')}</dd></div><div><dt>Оттенки</dt><dd>{concept.colors.join(', ')}</dd></div></dl><p className="section-note">Это направление подбора, а не спецификация изображённой мебели. Отделку, конструкцию и наполнение согласуют отдельно.</p><Link href="/materials/" className="section-link">О материалах →</Link></section>
  </div>;
}
