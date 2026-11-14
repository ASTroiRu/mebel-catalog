import Link from "next/link";
import type { NavigationItem as NavigationItemData } from "@/content/navigation";

export function NavigationItem({ item, className = "" }: {
  item: NavigationItemData;
  className?: string;
}) {
  if (!item.available) {
    return (
      <span role="link" aria-disabled="true" className={`nav-unavailable ${className}`}>
        {item.label}<span className="sr-only"> — раздел готовится</span>
      </span>
    );
  }
  return <Link href={item.href} className={`nav-link ${className}`}>{item.label}</Link>;
}
