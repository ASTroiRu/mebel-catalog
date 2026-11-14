import { buildMetadata } from '@/lib/seo';
import { PageStructuredData } from '@/components/seo/structured-data';
import { notFound } from 'next/navigation';
import { content } from '@/content/repository';
import { Breadcrumbs } from '@/components/catalog/breadcrumbs';
import { InformationContent, InformationCta } from '@/components/information/information-content';
export const dynamicParams = false;
export async function generateStaticParams() { return (await content.getInformationPages()).map(page => ({ information: page.slug })); }
type Props = { params: Promise<{ information: string }> };
export async function generateMetadata({ params }: Props) {
  const page = await content.getInformationPage((await params).information);
  if (!page) notFound();
  return buildMetadata(`/${page.slug}/`, page.seo);
}
export default async function InformationRoute({ params }: Props) {
  const page = await content.getInformationPage((await params).information);
  if (!page) notFound();
  return <div className="page-container catalog-page information-page"><PageStructuredData path={`/${page.slug}/`} seo={page.seo} type={page.slug === 'about' ? 'AboutPage' : page.slug === 'contacts' ? 'ContactPage' : 'WebPage'} /><Breadcrumbs path={`/${page.slug}/`} items={[{ label: page.title }]} />
    <header className="catalog-intro"><p className="eyebrow">{page.slug === 'privacy' ? 'Проект документа · Демо' : 'Мебель по вашим размерам · Демо'}</p><h1 className="page-title">{page.title}</h1></header>
    <InformationContent page={page} />{page.slug !== 'privacy' && <InformationCta measurement={page.slug === 'zamer'} />}
  </div>;
}
