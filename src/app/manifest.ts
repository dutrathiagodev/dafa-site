import type { MetadataRoute } from "next";
import { brand } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.title,
    short_name: "DAFA",
    description: brand.description,
    lang: "pt-BR",
    start_url: "/",
    display: "standalone",
    background_color: "#07080c",
    theme_color: "#07080c",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
