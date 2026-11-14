import type { Category, Product } from '@/content/models';
export const categoryPath = (category: Pick<Category, 'slug'>) => `/catalog/${category.slug}/`;
export const productPath = (category: Pick<Category, 'slug'>, product: Pick<Product, 'slug'>) => `${categoryPath(category)}${product.slug}/`;
