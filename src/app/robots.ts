import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';
import { absoluteUrl } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return siteConfig.demo ? { rules: { userAgent: '*', disallow: '/' } } : { rules: { userAgent: '*', allow: '/' }, sitemap: absoluteUrl('/sitemap.xml') };
}
