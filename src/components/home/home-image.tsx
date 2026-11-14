import Image from "next/image";
import type { HomeImage as HomeImageData } from "@/content/local/home";

export function HomeImage({ image, sizes, preload = false, onDemand = false }: {
  image: HomeImageData;
  sizes: string;
  preload?: boolean;
  onDemand?: boolean;
}) {
  return <Image src={image.src} alt={image.alt} fill sizes={sizes}
    style={{ objectFit: "cover", objectPosition: image.position ?? "center" }}
    {...(preload ? { preload: true } : { loading: onDemand ? "eager" as const : "lazy" as const })} />;
}
