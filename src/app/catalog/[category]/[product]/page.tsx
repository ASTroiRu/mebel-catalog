import { buildMetadata } from '@/lib/seo';
import { PageStructuredData } from '@/components/seo/structured-data';
import { notFound } from 'next/navigation';
import { content } from '@/content/repository';
import { categoryPath } from '@/lib/catalog-paths';
import { Breadcrumbs } from '@/components/catalog/breadcrumbs';
import { DemoPrice, ProductCard } from '@/components/catalog/product-card';
import { ImageGallery } from '@/components/gallery/image-gallery';
import { QuoteButton } from '@/components/ui/quote-button';
export const dynamicParams = false;
export async function generateStaticParams() {
  const [categories, products] = await Promise.all([content.getCategories(), content.getProducts()]);
  return products.map(product => ({ category: categories.find(item => item.id === product.categoryId)!.slug, product: product.slug }));
}
type Props = { params: Promise<{ category: string; product: string }> };
export async function generateMetadata({ params }: Props) { const p = await params; const product = await content.getProduct(p.category, p.product); if (!product) notFound(); return buildMetadata(`/catalog/${p.category}/${p.product}/`, product.seo); }
export default async function ProductPage({ params }: Props) {
  const p = await params;
  const [category, product] = await Promise.all([content.getCategory(p.category), content.getProduct(p.category, p.product)]);
  if (!category || !product) notFound();
  const [related, categories] = await Promise.all([content.getRelatedProducts(product.id), content.getCategories()]);
  return <div className="page-container catalog-page"><PageStructuredData path={`/catalog/${p.category}/${p.product}/`} seo={product.seo} type="WebPage" /><Breadcrumbs path={`/catalog/${p.category}/${p.product}/`} items={[{ label:'Каталог', href:'/catalog/' }, { label:category.title, href:categoryPath(category) }, { label:product.title }]} />
    <header className="catalog-intro"><p className="eyebrow">{category.title} · Демонстрационная модель</p><h1 className="page-title">{product.title}</h1><p>{product.description}</p></header>
    <div className="product-overview"><ImageGallery images={product.images} title={product.title} /><aside className="product-summary"><p className="demo-label">Демонстрационная комплектация</p><DemoPrice value={product.demoPriceFrom} /><p className="text-sm text-muted mt-4">Цена условная, приведена для демонстрации интерфейса. Фактическая стоимость зависит от размеров, материалов и комплектации. Не является публичной офертой.</p><QuoteButton className="mt-6" categoryId={category.id} modelName={product.title} /><p className="text-xs text-muted mt-3">Демо: проверка без отправки заявки.</p></aside></div>
    <section className="catalog-section"><h2 className="section-title">Характеристики</h2><p className="section-note">Демонстрационный вариант. Материалы и наполнение согласуются индивидуально.</p><dl className="product-specs"><div><dt>Материал корпуса</dt><dd>{product.bodyMaterial}</dd></div><div><dt>Материал фасадов</dt><dd>{product.facadeMaterial}</dd></div><div><dt>Размеры</dt><dd>{product.dimensions}</dd></div><div><dt>Изготовление</dt><dd>Партнёрское производство</dd></div></dl></section>
    <section className="catalog-section"><h2 className="section-title">О решении «{product.title}»</h2><p className="catalog-copy">{product.details}</p><p className="section-note">Иллюстрации показывают направление и условную схему. Это не фотографии изготовленной модели.</p></section>
    <section className="catalog-section" aria-labelledby="related-title"><h2 id="related-title" className="section-title">Похожие изделия</h2><p className="section-note">Три решения из других категорий. Все цены демонстрационные.</p><div className="home-grid three-columns mt-8">{related.map(item => <ProductCard key={item.id} product={item} category={categories.find(category => category.id === item.categoryId)!} showPrice />)}</div></section>
  </div>;
}
