"use client";

import { useRef, useState, type ReactNode } from "react";

export type HeroSlide = { id: string; label: string; image: ReactNode };

export function HeroSlider({ slides }: { slides: readonly HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  function select(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  return (
    <div className="hero-carousel" role="region" aria-roledescription="карусель" aria-label="Варианты мебели"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          select(index + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}>
      <div className="hero-photo" id="hero-slide" role="group" aria-roledescription="слайд"
        aria-label={`${index + 1} из ${slides.length}: ${slides[index].label}`}
        onTouchStart={(event) => {
          const touch = event.touches.length === 1 ? event.touches[0] : undefined;
          touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          const end = event.changedTouches[0];
          if (!start || !end) return;
          const dx = end.clientX - start.x;
          const dy = end.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) select(index + (dx < 0 ? 1 : -1));
        }}>
        {slides[index].image}
      </div>
      <div className="slider-toolbar">
        <p className="slide-caption" aria-live="polite" aria-atomic="true">
          <span className="tabular-nums">0{index + 1} / 0{slides.length}</span>
          <span>{slides[index].label}</span>
        </p>
        <div className="slide-dots" role="group" aria-label="Выбрать слайд">
          {slides.map((slide, i) => <button key={slide.id} type="button" aria-label={`Показать слайд ${i + 1}: ${slide.label}`}
            aria-current={index === i ? "true" : undefined} aria-controls="hero-slide" onClick={() => select(i)}><span /></button>)}
        </div>
        <div className="slider-buttons">
          <button type="button" className="circle-button" aria-label="Предыдущий слайд" aria-controls="hero-slide" onClick={() => select(index - 1)}><span aria-hidden="true">←</span></button>
          <button type="button" className="circle-button" aria-label="Следующий слайд" aria-controls="hero-slide" onClick={() => select(index + 1)}><span aria-hidden="true">→</span></button>
        </div>
      </div>
    </div>
  );
}
