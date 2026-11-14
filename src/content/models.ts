export type SeoFields = { title: string; description: string };
export type ContentImage = { src: string; alt: string; position?: string; caption?: string };
export type FaqItem = { question: string; answer: string };
export type Category = {
  id: string; slug: string; title: string; heading: string; description: string;
  image: ContentImage; features: readonly string[]; faq: readonly FaqItem[]; seo: SeoFields;
};
export type Product = {
  id: string; slug: string; categoryId: string; title: string; description: string;
  details: string; bodyMaterial: string; facadeMaterial: string; dimensions: 'Индивидуальные';
  images: readonly (ContentImage & { caption: string })[]; demoPriceFrom: number;
  relatedIds: readonly string[]; seo: SeoFields;
};
export type Concept = {
  id: string; slug: string; title: string; categoryId: string; description: string;
  images: readonly (ContentImage & { caption: string })[]; materials: readonly string[]; colors: readonly string[]; seo: SeoFields;
};
export type InformationPage = {
  contactFields?: readonly { label: string; value: string }[];
  faqGroups?: readonly { heading: string; items: readonly FaqItem[] }[];
  materials?: readonly { id: string; title: string; description: string }[];
  id: string; slug: string; title: string; sections: readonly { heading: string; paragraphs: readonly string[] }[]; seo: SeoFields;
};
export interface ContentRepository {
  getConcepts(): Promise<readonly Concept[]>;
  getConcept(slug: string): Promise<Concept | undefined>;
  getInformationPages(): Promise<readonly InformationPage[]>;
  getInformationPage(slug: string): Promise<InformationPage | undefined>;
  getCategories(): Promise<readonly Category[]>;
  getCategory(slug: string): Promise<Category | undefined>;
  getProducts(categoryId?: string): Promise<readonly Product[]>;
  getProduct(categorySlug: string, productSlug: string): Promise<Product | undefined>;
  getRelatedProducts(productId: string): Promise<readonly Product[]>;
}
