import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';
import { absoluteUrl } from '@/lib/seo';
import { getContentPaths } from '@/lib/content-paths';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (siteConfig.demo) return [];
  return (await getContentPaths()).map(path => ({ url: absoluteUrl(path) }));
}
