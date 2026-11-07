---
title: Conteúdo editável
slug: codebase-conteudo
type: codebase
module: conteudo
topic_type: data-model
summary: Estrutura de src/content/site.ts (contato, marca, serviços, processo, projetos, showreel, equipe, FAQ) e onde cada dado aparece.
triggers: [site.ts, projects, team, faq, whatsappUrl, brand]
related: [secoes.md, ../../COMO-ATUALIZAR.md]
rag: include
status: current
updated_at: 2026-11-07
verified_against:
  - src/content/site.ts
---

# Conteúdo (`src/content/site.ts`)

Único lugar com texto e dados. Os componentes só leem daqui.

| Export | Tipo | Usado em |
|---|---|---|
| `contact` | número/visual do WhatsApp, mensagem pronta, e-mail, Instagram, cidade, UF | Contato, Footer, JSON-LD |
| `whatsappUrl`, `instagramUrl`, `emailUrl` | links prontos | botões (`WhatsAppButton`), Contato, Footer, botão flutuante |
| `brand` | nome, `title` (título da aba/SEO), `description`, `pitch`, `quote` | layout (SEO), Hero, Contato, GrowthChart |
| `services` | título, descrição, `icon` (`ServiceIcon`) | Services |
| `processSteps` | 5 etapas (Entender → Divulgar) | ProcessSequence |
| `projects: Project[]` | portfólio (Reels) | Portfolio, sitemap |
| `showreel` | vídeo de apresentação | Showreel |
| `team: TeamMember[]` | Daniel (CEO, com `bio`) e Fabiano (Partner), com `photo` | About |
| `faq` | perguntas e respostas | Contact (FAQ em `<details>`) |

## `Project`

- `slug` define os arquivos: `media/videos/<slug>.mp4`, `<slug>-preview.mp4`, `media/posters/<slug>.webp` (helper `v(slug)`).
- `format`: `"vertical"` (9:16) ou `"horizontal"`. O enquadramento nunca é cortado.
- `media`: `{ type: "video", src, preview, poster }` ou `{ type: "image", src, width, height }`.
- `services`: só o que foi realmente feito no projeto.
- `instagram` (opcional) vira link no reel aberto.

## `TeamMember`

`name`, `role` (cargo em inglês: CEO, Partner), `bio?: string[]` e `photo?` (caminho em `/public`). Sem foto, o cartão mostra a inicial.

## Pendências marcadas no código

Comentários `TODO(DAFA)` em `projects`: confirmar cliente e serviços do projeto **imobiliário** e o contexto da **fotografia**.
