import { categoryNavigation, mainNavigation, informationNavigation, type NavigationItem as NavigationItemData } from "@/content/navigation";
import { siteConfig } from "@/lib/config";
import { Brand } from "./brand";
import { NavigationItem } from "./navigation-item";

function FooterNavigation({ title, items }: { title: string; items: readonly NavigationItemData[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="footer-heading">{title}</h2>
      <ul className="footer-links">{items.map((item) => <li key={item.href}><NavigationItem item={item} /></li>)}</ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="mt-6 max-w-64 text-sm leading-7">Мебель по индивидуальным размерам.<br />{siteConfig.region}.</p>
            <p className="mt-4 text-sm text-muted">Предварительный замер и расчёт — бесплатно.</p>
          </div>
          <FooterNavigation title="Каталог" items={categoryNavigation} />
          <FooterNavigation title="Информация" items={[...mainNavigation.slice(1, 4), ...informationNavigation.slice(0, 3)]} />
          <div>
            <h2 className="footer-heading">Контакты</h2>
            <dl className="contact-list">
              <div><dt>Телефон</dt><dd>Демо — не указан</dd></div>
              <div><dt>Электронная почта</dt><dd>Демо — не указана</dd></div>
              <div><dt>Адрес и график связи</dt><dd>Демо — не указаны</dd></div>
            </dl>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Демонстрационная версия. Контакты ожидают подтверждения. Заявки не отправляются.</p>
          <NavigationItem item={informationNavigation[3]} />
        </div>
        <p className="pb-6 text-xs text-muted">Юридические данные: Демо — не указаны.</p>
      </div>
    </footer>
  );
}
