export type QuoteCategory = { id: string; slug: string; title: string };
export type QuoteProduct = { categoryId: string; slug: string; title: string };
export type QuoteRequest = { intent?: 'quote' | 'measurement'; categoryId?: string; modelName?: string };
export function resolveQuoteContext(pathname: string, request: QuoteRequest, categories: readonly QuoteCategory[], products: readonly QuoteProduct[]): QuoteRequest {
  const parts = pathname.split('/').filter(Boolean);
  const routeCategory = parts[0] === 'catalog' ? categories.find(item => item.slug === parts[1]) : undefined;
  const category = request.categoryId !== undefined ? categories.find(item => item.id === request.categoryId) : routeCategory;
  const product = category && category.id === routeCategory?.id ? products.find(item => item.categoryId === category.id && item.slug === parts[2]) : undefined;
  return { intent:request.intent ?? (parts[0] === 'zamer' ? 'measurement' : 'quote'), categoryId:category?.id ?? '', modelName:category ? request.modelName ?? (request.categoryId === undefined ? product?.title : undefined) : undefined };
}
