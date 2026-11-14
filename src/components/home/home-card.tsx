import { QuoteButton } from "@/components/ui/quote-button";
import type { QuoteRequest } from "@/lib/quote-context";
import type { HomeCard as HomeCardData } from "@/content/local/home";
import { HomeImage } from "./home-image";
import { NavigationItem } from "@/components/layout/navigation-item";

export function HomeCard({ card, marker, sizes, available = false, quoteContext, headingLevel = 3 }: { card: HomeCardData; marker?: string; sizes: string; available?: boolean; quoteContext?: QuoteRequest; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return <article className={quoteContext ? "home-card home-card-with-actions" : "home-card"}>
    <div className="card-photo"><HomeImage image={card.image} sizes={sizes} />{marker && <span className="image-tag">{marker}</span>}</div>
    <div className="card-heading"><Heading>{card.title}</Heading><span className="card-arrow" aria-hidden="true">↗</span></div>
    <p className="card-description">{card.description}</p>
    {quoteContext ? <div className="card-actions">
      <NavigationItem item={{ label: "Подробнее", href: card.href, available }} className="card-link" />
      <QuoteButton {...quoteContext} />
    </div> : <NavigationItem item={{ label: "Подробнее", href: card.href, available }} className="card-link" />}
  </article>;
}
