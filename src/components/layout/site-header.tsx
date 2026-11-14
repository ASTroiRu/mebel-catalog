import { mainNavigation } from "@/content/navigation";
import { Brand } from "./brand";
import { MobileMenu } from "./mobile-menu";
import { NavigationItem } from "./navigation-item";
import { QuoteButton } from "@/components/ui/quote-button";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Brand />
        <nav className="desktop-navigation" aria-label="Основная навигация">
          <ul className="flex items-center gap-6">
            {mainNavigation.map((item) => <li key={item.href}><NavigationItem item={item} /></li>)}
          </ul>
        </nav>
        <div className="header-quote"><QuoteButton /></div>
        <MobileMenu />
      </div>
    </header>
  );
}
