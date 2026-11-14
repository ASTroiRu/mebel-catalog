import type { Metadata } from 'next';
import type { SeoFields } from '@/content/models';
import { siteConfig } from './config';
export function parseSiteOrigin(value?: string): string {
  const url = new URL(value || 'http://127.0.0.1:3017');
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment');
  return url.origin;
}
export function indexingPolicy(demo: boolean, origin: string) {
  const url = new URL(origin);
  if (!demo && (url.protocol !== 'https:' || ['localhost','127.0.0.1','[::1]'].includes(url.hostname))) throw new Error('Public indexing requires a real HTTPS origin and a separate release review');
  return { index: !demo, follow: !demo, nocache: demo };
}
export const siteOrigin = parseSiteOrigin(process.env.SITE_URL);
export const robotsPolicy = indexingPolicy(siteConfig.demo, siteOrigin);
export function absoluteUrl(path: string) { return new URL(path, siteOrigin).href; }
export function buildMetadata(path: string, seo: SeoFields): Metadata {
  const title = `${seo.title} — ${siteConfig.demo ? 'Демо мебели' : 'Мебель на заказ'}`;
  return {
    title: { absolute: title }, description: seo.description,
    alternates: { canonical: absoluteUrl(path) }, robots: robotsPolicy,
    openGraph: { type: 'website', locale: 'ru_RU', title, description: seo.description, url: absoluteUrl(path), siteName: siteConfig.demo ? 'Мебель на заказ · Демо' : siteConfig.name,
      images: [{ url: absoluteUrl('/images/home/kitchen.webp'), alt: 'Интерьерный референс кухни — не выполненный проект компании' }] },
  };
}
export function serializeJsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, '\\u003c'); }
