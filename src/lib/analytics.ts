/** Future adapter boundary. No payloads, logging, storage or transmissions in this MVP. */
export type SiteEvent = 'quote_open' | 'measurement_open' | 'product_view' | 'form_validation_success' | 'catalog_navigation' | 'concept_view';
export interface AnalyticsAdapter { track(event: SiteEvent): void }
export const analytics: AnalyticsAdapter = { track(_event) { /* Deliberately inactive in the demo. */ } };
