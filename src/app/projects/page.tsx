import { buildMetadata } from '@/lib/seo';
import { PageStructuredData } from '@/components/seo/structured-data';
import Link from 'next/link';
import { content } from '@/content/repository';
import { Breadcrumbs } from '@/components/catalog/breadcrumbs';
import { HomeCard } from '@/components/home/home-card';
const seo = { title: 'Интерьерные концепты мебели — галерея идей', description: 'Четыре концепта для кухни, шкафа, шкафа-купе и гардеробной. Идеи сочетания материалов и цветов, не выполненные проекты.' };
export const metadata = buildMetadata('/projects/', seo);
export default async function ConceptsPage() {
  const [concepts, categories] = await Promise.all([content.getConcepts(), content.getCategories()]);
  return <div className="page-container catalog-page">
    <PageStructuredData path="/projects/" seo={seo} type="CollectionPage" /><Breadcrumbs path="/projects/" items={[{ label: 'Концепты' }]} />
    <header className="catalog-intro"><p className="eyebrow">Пространство для идей</p><h1 className="page-title">Интерьерные концепты</h1><p>Четыре направления для обсуждения будущей мебели. Это концепты, не выполненные проекты компании.</p></header>
    <div className="home-grid four-columns">{concepts.map(concept => <HomeCard headingLevel={2} key={concept.id} card={{ ...concept, href: `/projects/${concept.slug}/`, image: concept.images[0] }} marker={`Концепт · ${categories.find(c => c.id === concept.categoryId)!.title}`} sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 302px" available />)}</div>
    <p className="section-note">Изображения — интерьерные референсы, условные схемы и палитры. Реальные материалы выбирают по образцам.</p><Link href="/catalog/" className="section-link">Перейти в каталог →</Link>
  </div>;
}
