import type { ContentRepository } from './models';
import { concepts, informationPages } from './local/pages';
import { categories, products } from './local/catalog';

// Replace this adapter when a CMS is selected; route templates use only this contract.
export const content: ContentRepository = {
  async getConcepts() { return concepts; },
  async getConcept(slug) { return concepts.find(item => item.slug === slug); },
  async getInformationPages() { return informationPages; },
  async getInformationPage(slug) { return informationPages.find(item => item.slug === slug); },
  async getCategories() { return categories; },
  async getCategory(slug) { return categories.find(item => item.slug === slug); },
  async getProducts(categoryId) { return categoryId ? products.filter(item => item.categoryId === categoryId) : products; },
  async getProduct(categorySlug, productSlug) {
    const category = categories.find(item => item.slug === categorySlug);
    return category ? products.find(item => item.categoryId === category.id && item.slug === productSlug) : undefined;
  },
  async getRelatedProducts(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return [];
    return product.relatedIds.map(id => {
      const related = products.find(item => item.id === id);
      if (!related || related.id === product.id) throw new Error(`Invalid related product: ${id}`);
      return related;
    });
  },
};
