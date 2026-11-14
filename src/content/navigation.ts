export type NavigationItem = {
  readonly label: string;
  readonly href: string;
  readonly available: boolean;
};

export const mainNavigation: readonly NavigationItem[] = [
  { label: "Каталог", href: "/catalog/", available: true },
  { label: "Концепты", href: "/projects/", available: true },
  { label: "Как мы работаем", href: "/process/", available: true },
  { label: "О компании", href: "/about/", available: true },
  { label: "Контакты", href: "/contacts/", available: true },
];

export const categoryNavigation: readonly NavigationItem[] = [
  { label: "Кухни", href: "/catalog/kuhni/", available: true },
  { label: "Шкафы", href: "/catalog/shkafy/", available: true },
  { label: "Шкафы-купе", href: "/catalog/shkafy-kupe/", available: true },
  { label: "Гардеробные", href: "/catalog/garderobnye/", available: true },
];

export const informationNavigation: readonly NavigationItem[] = [
  { label: "Бесплатный замер", href: "/zamer/", available: true },
  { label: "Материалы", href: "/materials/", available: true },
  { label: "Вопросы и ответы", href: "/faq/", available: true },
  { label: "Политика конфиденциальности", href: "/privacy/", available: true },
];
