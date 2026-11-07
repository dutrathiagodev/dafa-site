import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { brand, contact } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import { structuredData } from "@/lib/structured-data";

/*
 * Fontes PROVISÓRIAS. A identidade usa Creato Display (texto) e Callum IT
 * (destaques). Quando os arquivos .woff2 com licença web chegarem, trocar por
 * next/font/local mantendo as variáveis --font-creato e --font-callum.
 */
const creato = Plus_Jakarta_Sans({
  variable: "--font-creato",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const callum = Playfair_Display({
  variable: "--font-callum",
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  // Só o domínio: o Next já soma o basePath às imagens (og, ícones).
  metadataBase: new URL(new URL(siteUrl).origin),
  title: { default: brand.title, template: "%s | DAFA" },
  description: brand.description,
  applicationName: "DAFA",
  keywords: [
    "DAFA",
    "gerenciamento de conteúdo",
    "produção audiovisual",
    "produtora de vídeo",
    "filmmaker",
    "vídeo para Instagram",
    "Reels para empresas",
    "fotografia comercial",
    "social media",
    "gestão de redes sociais",
    "tráfego pago",
    "marketing digital",
    "Santo Antônio da Platina",
    "Norte Pioneiro do Paraná",
    "Paraná",
  ],
  authors: [{ name: "DAFA — Gerenciamento de Conteúdo" }],
  creator: "DAFA",
  publisher: "DAFA",
  category: "marketing",
  alternates: { canonical: `${siteUrl}/` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${siteUrl}/`,
    siteName: "DAFA — Gerenciamento de Conteúdo",
    title: brand.title,
    description: brand.description,
  },
  twitter: {
    card: "summary_large_image",
    title: brand.title,
    description: brand.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "BR-PR",
    "geo.placename": contact.city,
  },
};

export const viewport: Viewport = {
  themeColor: "#07080c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${creato.variable} ${callum.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
