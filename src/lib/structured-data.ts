import { brand, contact, faq, instagramUrl, services } from "@/content/site";
import { siteUrl } from "./site-url";

/** Dados estruturados (schema.org) para o Google entender o negócio local. */
export function structuredData() {
  const business = {
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#empresa`,
    name: "DAFA — Gerenciamento de Conteúdo",
    alternateName: "DAFA",
    slogan: brand.tagline,
    description: brand.description,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image.png`,
    logo: `${siteUrl}/media/img/logo-dafa.png`,
    telephone: "+55 43 99900-1173",
    email: contact.email,
    sameAs: [instagramUrl],
    address: {
      "@type": "PostalAddress",
      addressLocality: contact.city,
      addressRegion: contact.state,
      addressCountry: "BR",
    },
    areaServed: [
      { "@type": "City", name: `${contact.city}, ${contact.state}` },
      { "@type": "AdministrativeArea", name: "Norte Pioneiro do Paraná" },
    ],
    founder: [
      { "@type": "Person", name: "Daniel", jobTitle: "CEO" },
      { "@type": "Person", name: "Fabiano", jobTitle: "Partner" },
    ],
    knowsAbout: services.map((s) => s.title),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
          areaServed: `${contact.city} e região`,
        },
      })),
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      business,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#site`,
        url: siteUrl,
        name: brand.title,
        inLanguage: "pt-BR",
        publisher: { "@id": `${siteUrl}/#empresa` },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
