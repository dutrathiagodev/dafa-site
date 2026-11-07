---
title: Componentes reutilizáveis
slug: codebase-componentes-ui
type: codebase
module: ui
topic_type: reference
summary: API dos componentes de src/components/ui, layout e do modal de vídeo.
triggers: [ButtonLink, WhatsAppButton, SectionHeading, Eyebrow, Accent, Tag, PersonCard, GridBackground, useMediaModal]
related: [secoes.md]
rag: include
status: current
updated_at: 2026-11-07
verified_against:
  - src/components/ui/button.tsx
  - src/components/ui/section-heading.tsx
  - src/components/ui/tag.tsx
  - src/components/ui/person-card.tsx
  - src/components/ui/grid-background.tsx
  - src/components/media/VideoModal.tsx
---

# Componentes reutilizáveis

Antes de criar um elemento novo, veja se ele já existe aqui.

## `ui/`

| Componente | Uso |
|---|---|
| `ButtonLink` (`button.tsx`) | Link com cara de botão. `variant: "primary" \| "ghost"`, `size: "md" \| "lg"`, `external`, `icon` / `iconAfter`. |
| `WhatsAppButton` (`button.tsx`) | CTA principal. Já usa `whatsappUrl` e o ícone. O texto padrão é "Solicite um orçamento". |
| `Eyebrow` (`section-heading.tsx`) | Rótulo pequeno em caixa alta acima dos títulos (`data-reveal`). |
| `Accent` (`section-heading.tsx`) | Trecho em itálico serifado lilás dentro de um título. |
| `SectionHeading` | `eyebrow` + `h2` + `description`. Props: `id`, `size: "lg" \| "md" \| "sm"`, `align`. |
| `Tag` (`tag.tsx`) | Pílula de texto (serviços no reel). |
| `PersonCard` (`person-card.tsx`) | Foto 4:5 (`next/image` + `asset()`), nome e cargo. Sem `photo`, mostra a inicial. |
| `GridBackground` (`grid-background.tsx`) | Fundo do hero e do contato: degradê preto → azul, grade animada (`animate-grid`) e brilho que respira (`animate-glow`). |
| `WhatsAppIcon`, `InstagramIcon` (`brand-icons.tsx`) | Ícones de marca em SVG. |
| `DafaWorkflowBento` (`dafa-workflow-bento.tsx`) | Bento da seção "Como funciona". |

## `layout/`

- `Header`: logo, links de âncora e botão "Fale com a DAFA". Fixo no topo.
- `Footer`: contato e redes.
- `WhatsAppFloat`: botão flutuante do WhatsApp.

## `media/`

- `MediaModalProvider` + `useMediaModal()` (`VideoModal.tsx`): abre um vídeo (com som) ou uma foto em tela cheia. Pausa a rolagem com os eventos `dafa:lock-scroll` / `dafa:unlock-scroll`.
- `CameraPhotos`: a câmera 3D do hero ([midia.md](midia.md)).
