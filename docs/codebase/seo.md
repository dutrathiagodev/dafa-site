---
title: SEO
slug: codebase-seo
type: codebase
module: seo
topic_type: reference
summary: Metadados, Open Graph, dados estruturados (schema.org), sitemap, robots e manifest do site.
triggers: [metadata, openGraph, structuredData, sitemap.ts, robots.ts, manifest.ts, siteUrl]
related: [deploy.md]
rag: include
status: current
updated_at: 2026-11-07
verified_against:
  - src/app/layout.tsx
  - src/lib/structured-data.ts
  - src/lib/site-url.ts
  - src/app/sitemap.ts
  - src/app/robots.ts
---

# SEO

- **URL pública:** `siteUrl` (`src/lib/site-url.ts`) vem de `NEXT_PUBLIC_SITE_URL`. Sem ela, usa `http://localhost:3000`. Quando a DAFA tiver domínio, basta definir essa variável no build.
- **Metadados** (`layout.tsx`):
  - título padrão `brand.title` ("DAFA | Produtora Audiovisual e Gestão de Conteúdo") e template `%s | DAFA`;
  - descrição, palavras-chave locais (Santo Antônio da Platina, Norte Pioneiro);
  - canonical, Open Graph `pt_BR`, Twitter `summary_large_image`;
  - `robots` liberando prévia grande de imagem e vídeo;
  - meta `geo.*`.
- `metadataBase` é **só a origem** (`new URL(siteUrl).origin`), porque o Next já soma o basePath às imagens. Com o caminho junto, o og:image saía com `/dafa-site/dafa-site`.
- **Imagem OG:** `src/app/opengraph-image.png` (estática), com texto alternativo em `opengraph-image.alt.txt`. **Ícones:** `icon.png` e `apple-icon.png` (logo redonda centralizada).
- **JSON-LD** (`structured-data.ts`): `ProfessionalService` com endereço (cidade/PR), contato, redes e fundadores (Daniel — CEO, Fabiano — Partner), mais `FAQPage` com as perguntas de `faq`. É injetado no `<head>`.
- **sitemap.ts / robots.ts / manifest.ts:** gerados no build (`dynamic = "force-static"`, obrigatório no export estático). O sitemap lista os vídeos do portfólio com capa.
