---
title: Arquitetura do site
slug: codebase-arquitetura
type: codebase
module: site
topic_type: hub
summary: Stack, organização de pastas, build estático para GitHub Pages e como a página única é montada.
triggers: [next.config.ts, page.tsx, layout.tsx, output export, basePath]
related: [codebase/README.md, codebase/deploy.md]
rag: include
status: current
updated_at: 2026-11-07
verified_against:
  - next.config.ts
  - src/app/page.tsx
  - src/app/layout.tsx
  - package.json
---

# Arquitetura

## Stack

- **Next.js 15 (App Router)** com React 19 e TypeScript.
- **Tailwind CSS 4**: tokens de cor e fonte em `src/app/globals.css` (`@theme`).
- **GSAP 3 + ScrollTrigger + @gsap/react**: animações. O registro dos plugins fica em `src/lib/gsap.ts`.
- **Lenis**: rolagem suave, sincronizada com o relógio do GSAP.
- **lucide-react**: ícones. Os ícones de marca (WhatsApp, Instagram) ficam em `src/components/ui/brand-icons.tsx`.
- Sem backend, sem banco e sem CMS. Todo o conteúdo editável está em `src/content/site.ts`.

## Site estático

`next.config.ts`:

- `output: "export"`: `npm run build` gera HTML/CSS/JS estáticos em `out/`.
- `basePath` vem de `PAGES_BASE_PATH`. No GitHub Pages o site fica em `/dafa-site`; localmente fica na raiz.
- `images.unoptimized`: não há servidor de imagens. As mídias já vão otimizadas para `public/media`.
- `NEXT_PUBLIC_BASE_PATH` é exposto ao cliente. O helper `asset()` (`src/lib/asset.ts`) prefixa todo caminho de `/media`.

## Pastas

```text
src/
├── app/            layout (metadados, fontes, JSON-LD), page, sitemap, robots, manifest, ícones, imagem OG
├── content/site.ts todo o conteúdo: contato, marca, serviços, processo, projetos, equipe, FAQ
├── components/
│   ├── layout/     Header, Footer, WhatsAppFloat
│   ├── sections/   uma seção da página por arquivo
│   ├── media/      VideoModal (player em tela cheia) e camera-3d/ (câmera 3D do hero)
│   ├── motion/     SmoothScroll (Lenis + F5) e Reveals (entrada dos elementos)
│   └── ui/         peças reutilizáveis (botões, título de seção, tag, cartão de pessoa, fundo em grade, bento)
└── lib/            asset(), gsap, siteUrl, dados estruturados
public/media/       vídeos, capas, quadros, fotos (ver codebase/midia.md)
scripts/            preparar-video.sh e recortar-fundo.py
```

## Página

Uma página só (`src/app/page.tsx`), na ordem:

`Header` → `Hero` → `Showreel` → `Portfolio` → `ProcessSequence` → `About` → `Services` → `Workflow` → `GrowthChart` → `Contact` (com FAQ) → `Footer` → `WhatsAppFloat`.

`MediaModalProvider` envolve tudo: qualquer seção abre um vídeo com som em tela cheia via `useMediaModal()`.

`SmoothScroll` e `Reveals` são componentes sem interface, montados no topo da página.

## Princípios

- **Conteúdo separado do layout.** Texto, links e projetos ficam só em `site.ts`.
- **Qualidade de imagem em primeiro lugar.** Fotos com fundo recortado e cores originais. Vídeos com prévia sem som em alta qualidade.
- **Movimento sem travar o scroll.** Nada prende a rolagem. Animações pausam fora da tela e respeitam `prefers-reduced-motion`.
- **CTA principal: WhatsApp** (`whatsappUrl`, com mensagem pronta).
