import { buildMetadata } from '@/lib/seo';
import { PageStructuredData } from '@/components/seo/structured-data';
import { content } from '@/content/repository';
import { Breadcrumbs } from '@/components/catalog/breadcrumbs';
import { CategoryCard } from '@/components/catalog/category-card';
const seo = { title: 'Каталог мебели на заказ в Москве', description: 'Кухни, шкафы, шкафы-купе и гардеробные по индивидуальным размерам. Демонстрационный каталог четырёх направлений.' };
export const metadata = buildMetadata('/catalog/', seo);
export default async function CatalogPage() {
  const categories = await content.getCategories();
  return <div className="page-container catalog-page"><PageStructuredData path="/catalog/" seo={seo} type="CollectionPage" /><Breadcrumbs path="/catalog/" items={[{ label:'Каталог' }]} /><header className="catalog-intro"><p className="eyebrow">Мебель по вашим размерам</p><h1 className="page-title">Каталог мебели</h1><p>Выберите направление, чтобы познакомиться с демонстрационными решениями.</p></header><div className="catalog-categories">{categories.map(category => <CategoryCard key={category.id} category={category} />)}</div><p className="section-note">Изображения — интерьерные иллюстрации и условные схемы, не выполненные работы компании.</p></div>;
}
