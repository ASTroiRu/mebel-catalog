import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label={`${siteConfig.name} — главная, демо`}>
      <span className="brand-symbol" aria-hidden="true">
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
          <path d="M3 29V3h22v26M3 19h22M14 3v16M8 29v-5m12 5v-5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </span>
      <span className="brand-copy">
        <span className="brand-name">{siteConfig.name}</span>
        <span className="brand-caption">Мебель на заказ <span aria-hidden="true">·</span> Демо</span>
      </span>
    </Link>
  );
}
