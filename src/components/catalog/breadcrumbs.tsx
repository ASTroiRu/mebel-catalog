import Link from 'next/link';
import { absoluteUrl } from '@/lib/seo';
import { JsonLd } from '@/components/seo/structured-data';
export function Breadcrumbs({ items, path }: { items: readonly { label: string; href?: string }[]; path: string }) {
  const crumbs = [{ label: 'Главная', href: '/' }, ...items];
  return <><JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', '@id': absoluteUrl(path) + '#breadcrumbs', itemListElement: crumbs.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.label, item: absoluteUrl(item.href ?? path) })) }} />
    <nav aria-label="Хлебные крошки" className="breadcrumbs"><ol>{crumbs.map((item, i) => <li key={i}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav></>;
}
