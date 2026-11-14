"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { mainNavigation, informationNavigation } from "@/content/navigation";
import { NavigationItem } from "./navigation-item";
import { QuoteButton } from "@/components/ui/quote-button";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia("(min-width: 1200px)");
    const onResize = () => { if (media.matches) setOpen(false); };
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    onResize();
    media.addEventListener("change", onResize);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      media.removeEventListener("change", onResize);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="mobile-navigation"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
      <button ref={triggerRef} type="button" className="menu-toggle" aria-expanded={open}
        aria-controls="mobile-navigation-panel" onClick={() => setOpen(!open)}>
        <span>{open ? "Закрыть" : "Меню"}</span>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
          {open ? <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" />
            : <path d="M3 6h14M3 14h14" stroke="currentColor" strokeWidth="1.5" />}
        </svg>
      </button>
      <div id="mobile-navigation-panel" className="mobile-panel" hidden={!open}>
        <nav aria-label="Основная мобильная навигация" onClick={event => { if (event.target instanceof Element && event.target.closest("a")) setOpen(false); }}>
          <ul className="mobile-links">
            <li><Link href="/" className="nav-link" onClick={() => setOpen(false)}>Главная</Link></li>
            {mainNavigation.map((item) => <li key={item.href}><NavigationItem item={item} /></li>)}
            {informationNavigation.slice(0, 1).map((item) => <li key={item.href}><NavigationItem item={item} /></li>)}
          </ul>
        </nav>
        <p className="text-sm text-muted mt-5">Демонстрационная версия. Заявки не отправляются.</p>
        <QuoteButton className="mt-5 w-full" returnFocusRef={triggerRef} onOpen={() => setOpen(false)} />
        <p className="text-sm text-muted mt-3">Демо: проверка без отправки заявки.</p>
      </div>
    </div>
  );
}
