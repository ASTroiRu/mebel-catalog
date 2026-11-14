import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/content/models';
import { categoryPath } from '@/lib/catalog-paths';
export function CategoryCard({ category }: { category: Category }) {
  return <article><Link href={categoryPath(category)} className="product-card-link"><div className="card-photo"><Image src={category.image.src} alt={category.image.alt} fill sizes="(max-width: 639px) 90vw, 45vw" style={{ objectFit:'cover', objectPosition:category.image.position }} /></div><h2 className="mt-5 text-2xl">{category.title}</h2></Link><p className="card-description">{category.description}</p></article>;
}
