import { buildMetadata } from '@/lib/seo';
import { PageStructuredData } from '@/components/seo/structured-data';
import { HeroSlider } from "@/components/home/hero-slider";
import { HomeImage } from "@/components/home/home-image";
import { heroSlides } from "@/content/local/home";
import { CategoriesSection, BenefitsSection, SolutionsSection, ProcessSection, ConceptsSection, MaterialsSection, FaqSection, FinalCtaSection } from "@/components/home/home-sections";

const seo = { title: 'Мебель на заказ в Москве', description: 'Кухни, шкафы, шкафы-купе и гардеробные по индивидуальным размерам в Москве и Московской области. Демонстрационные решения и интерьерные концепты.' };
export const metadata = buildMetadata('/', seo);
export default function HomePage() {
  return <><PageStructuredData path="/" seo={seo} />
    <section aria-labelledby="home-title" className="home-hero page-container">
      <div className="hero-topline"><p>Мебель на заказ · Москва и Московская область</p><span className="demo-label"><span className="demo-dot" aria-hidden="true" />Демо</span></div>
      <HeroSlider slides={heroSlides.map((slide, index) => ({ id: slide.id, label: slide.label,
        image: <HomeImage image={slide.image} sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1344px) calc(100vw - 64px), 1280px" preload={index === 0} onDemand />,
      }))} />
      <div className="hero-copy">
        <h1 id="home-title" className="page-title">Мебель, с которой<br />дома удобно</h1>
        <div><p className="hero-description">Кухни, шкафы и гардеробные по индивидуальным размерам. Продумываем мебель под ваше пространство и повседневную жизнь.</p>
        </div>
      </div>
      <p className="hero-disclaimer">Интерьерные иллюстрации, не выполненные проекты компании.</p>
    </section>
    <CategoriesSection /><BenefitsSection /><SolutionsSection /><ProcessSection /><ConceptsSection /><MaterialsSection /><FaqSection /><FinalCtaSection />
  </>;
}
