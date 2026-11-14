import { content } from '@/content/repository';
import { categoryPath, productPath } from '@/lib/catalog-paths';
import { benefits, homeFaq, materials, processSteps } from "@/content/local/home";
import { SectionHeading } from "./section-heading";
import { HomeCard } from "./home-card";
import { QuoteButton } from "@/components/ui/quote-button";
import { NavigationItem } from "@/components/layout/navigation-item";

const fourSizes = "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 88px) / 2), 302px";
const threeSizes = "(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 88px) / 2), 411px";

export async function CategoriesSection() {
  const homeCategories = (await content.getCategories()).map(category => ({ ...category, href: categoryPath(category) }));
  return <section id="categories" aria-labelledby="categories-title" className="home-section page-container">
    <SectionHeading id="categories-title" eyebrow="Каталог мебели" title="Для каждой части вашего дома">
      <p>Четыре направления. Индивидуальные размеры, материалы и наполнение.</p>
    </SectionHeading>
    <div className="home-grid four-columns">{homeCategories.map(card => <HomeCard key={card.id} card={card} sizes={fourSizes} available />)}</div>
    <p className="section-note">Здесь показаны примеры интерьеров. Для шкафа-купе пока используется условная схема.</p>
  </section>;
}

export function BenefitsSection() {
  return <section aria-labelledby="benefits-title" className="benefits-section">
    <div className="page-container">
      <SectionHeading id="benefits-title" eyebrow="Наш подход" title="Начинаем с того, как вы живёте" />
      <div className="home-grid four-columns benefits-grid">{benefits.map((item, i) => <article key={item.title}>
        <span className="step-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.description}</p>
      </article>)}</div>
    </div>
  </section>;
}

export async function SolutionsSection() {
  const categories = await content.getCategories();
  const products = await content.getProducts();
  const featuredSolutions = ['product-atmosfera', 'product-vertikal', 'product-privat'].map(id => {
    const product = products.find(item => item.id === id)!;
    const category = categories.find(item => item.id === product.categoryId)!;
    return { ...product, image: category.image, href: productPath(category, product), category: category.title };
  });
  return <section aria-labelledby="solutions-title" className="home-section page-container">
    <SectionHeading id="solutions-title" eyebrow="Идеи для дома" title="Идеи для вашей мебели">
      <p>Кухня с островом, высокий шкаф и гардеробная за стеклом. Выберите то, что ближе вашей задаче.</p>
    </SectionHeading>
    <div className="home-grid three-columns">{featuredSolutions.map(card => <HomeCard key={card.id} card={card} marker={`Демо · ${card.category}`} sizes={threeSizes} available quoteContext={{ categoryId:card.categoryId, modelName:card.title }} />)}</div>
    <p className="section-note">Названия моделей условные. Фотографии иллюстрируют направление, а не конкретное изделие компании.</p>
  </section>;
}

export function ProcessSection() {
  return <section id="process" aria-labelledby="process-title" className="home-section page-container process-section">
    <SectionHeading id="process-title" eyebrow="От идеи до установки" title="Как мы работаем">
      <p>Сначала обсуждаем и согласовываем проект. Затем передаём его партнёрскому производству.</p>
    </SectionHeading>
    <ol className="process-grid">{processSteps.map((step, i) => <li key={step.title}>
      <span className="step-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.description}</p>
    </li>)}</ol>
    <NavigationItem item={{ label: "Подробнее о процессе", href: "/process/", available: true }} className="section-link" />
  </section>;
}

export async function ConceptsSection() {
  const categories = await content.getCategories();
  const homeConcepts = (await content.getConcepts()).map(c => ({ ...c, href: `/projects/${c.slug}/`, image: c.images[0], category: categories.find(category => category.id === c.categoryId)!.title }));
  return <section aria-labelledby="concepts-title" className="home-section page-container">
    <SectionHeading id="concepts-title" eyebrow="Пространство для идей" title="Интерьерные концепты">
      <p>Сочетания цветов, материалов и форм. Это идеи для обсуждения, не выполненные заказы.</p>
    </SectionHeading>
    <div className="home-grid four-columns">{homeConcepts.map(card => <HomeCard key={card.id} card={card} marker={`Концепт · ${card.category}`} sizes={fourSizes} available />)}</div>
    <p className="section-note">Интерьерные референсы и условные схемы, не выполненные заказы компании.</p>
  </section>;
}

export function MaterialsSection() {
  return <section aria-labelledby="materials-title" className="materials-section">
    <div className="page-container">
      <SectionHeading id="materials-title" eyebrow="Фактура и детали" title="Материалы и фурнитура">
        <p>Фасады, полки и столешницы могут сочетать разные материалы. Ручки, петли и направляющие подбираем под конструкцию.</p>
      </SectionHeading>
      <div className="home-grid four-columns">{materials.map(item => <article key={item.id} className="material-card">
        <div className={`material-swatch swatch-${item.id}`} role="img" aria-label={`${item.title}: условный образец фактуры`} />
        <h3>{item.title}</h3><p>{item.description}</p>
      </article>)}</div>
      <p className="section-note">Образцы условные: цвет и фактуру конкретного материала уточняют при выборе.</p>
      <NavigationItem item={{ label: "Подробнее о материалах", href: "/materials/", available: true }} className="section-link" />
    </div>
  </section>;
}

export function FaqSection() {
  return <section aria-labelledby="faq-title" className="home-section page-container faq-section">
    <div><p className="eyebrow">Перед началом</p><h2 id="faq-title" className="section-title">Вопросы<br />и ответы</h2><p className="mt-6 text-muted">О замере, стоимости<br />и процессе заказа.</p></div>
    <div className="faq-list">{homeFaq.map(item => <details key={item.id} className="faq-item">
      <summary>{item.question}<span className="faq-icon" aria-hidden="true" /></summary><p>{item.answer}</p>
    </details>)}</div>
  </section>;
}

export function FinalCtaSection() {
  return <section aria-labelledby="cta-title" className="final-cta page-container">
    <div className="cta-panel"><div><p className="eyebrow">Ваш следующий шаг</p><h2 id="cta-title" className="section-title">Начнём с вашей идеи</h2><p className="mt-5 max-w-lg text-muted">Расскажите, какую мебель вы представляете. Предварительный замер и расчёт бесплатны.</p></div>
      <div className="cta-actions"><QuoteButton /><QuoteButton intent="measurement" variant="link" /><p className="text-xs text-muted">Демо: проверка без отправки заявки.</p></div>
    </div>
  </section>;
}
