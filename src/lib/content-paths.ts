import { content } from '@/content/repository';
export async function getContentPaths(): Promise<string[]> {
  const [categories, products, concepts, pages] = await Promise.all([content.getCategories(), content.getProducts(), content.getConcepts(), content.getInformationPages()]);
  return ['/', '/catalog/', ...categories.map(c => `/catalog/${c.slug}/`), ...products.map(p => {
    const category = categories.find(c => c.id === p.categoryId);
    if (!category) throw new Error(`Unknown product category: ${p.categoryId}`);
    return `/catalog/${category.slug}/${p.slug}/`;
  }), '/projects/', ...concepts.map(c => `/projects/${c.slug}/`), ...pages.map(p => `/${p.slug}/`)];
}
