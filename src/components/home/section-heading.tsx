import type { ReactNode } from "react";

export function SectionHeading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="section-heading">
    <div><p className="eyebrow">{eyebrow}</p><h2 id={id} className="section-title">{title}</h2></div>
    {children && <div className="section-intro">{children}</div>}
  </div>;
}
