import Image from 'next/image';
import Link from 'next/link';
import type { Category, Product } from '@/content/models';
import { QuoteButton } from '@/components/ui/quote-button';
import { productPath } from '@/lib/catalog-paths';
export function DemoPrice({ value }: { value: number }) {
  return <div className="demo-price"><p>от {new Intl.NumberFormat('ru-RU').format(value)} ₽</p><span>Демо-цена. Не публичная оферта.</span></div>;
}
export function ProductCard({ product, category, showPrice = false }: { product: Product; category: Category; showPrice?: boolean }) {
  return <article className="home-card"><Link href={productPath(category, product)} className="product-card-link"><div className="card-photo"><Image src={product.images[0].src} alt={product.images[0].alt} fill style={{ objectFit: 'contain' }} sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 411px" /><span className="image-tag">Демонстрационная модель</span></div><h3 className="mt-5 text-xl">{product.title}</h3></Link><p className="card-description">{product.description}</p>{showPrice && <DemoPrice value={product.demoPriceFrom} />}<QuoteButton className="mt-4" categoryId={category.id} modelName={product.title} /></article>;
}
