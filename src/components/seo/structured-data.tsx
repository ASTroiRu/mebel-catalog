import { absoluteUrl, serializeJsonLd } from '@/lib/seo';
import type { SeoFields } from '@/content/models';
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
export function PageStructuredData({ path, seo, type = 'WebPage' }: { path: string; seo: SeoFields; type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage' }) {
  const url = absoluteUrl(path);
  return <><JsonLd data={{ '@context': 'https://schema.org', '@type': type, '@id': `${url}#webpage`, url, name: seo.title, description: seo.description, inLanguage: 'ru-RU', isPartOf: { '@id': absoluteUrl('/#website') }, ...(path !== '/' ? { breadcrumb: { '@id': `${url}#breadcrumbs` } } : {}) }} />
    {path === '/' && <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', '@id': absoluteUrl('/#website'), url, name: 'Мебель на заказ · Демо', inLanguage: 'ru-RU' }} />}</>;
}
