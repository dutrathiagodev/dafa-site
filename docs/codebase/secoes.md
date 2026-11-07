---
title: Seções da página
slug: codebase-secoes
type: codebase
module: secoes
topic_type: reference
summary: O que cada seção em src/components/sections faz, seus ids de âncora e interações.
triggers: [Hero, Showreel, Portfolio, ProcessSequence, About, Services, Workflow, GrowthChart, Contact]
related: [animacoes.md, midia.md, componentes-ui.md]
rag: include
status: current
updated_at: 2026-11-07
verified_against:
  - src/components/sections/Hero.tsx
  - src/components/sections/Portfolio.tsx
  - src/components/sections/ProcessSequence.tsx
  - src/components/sections/About.tsx
  - src/components/sections/Services.tsx
  - src/components/sections/GrowthChart.tsx
  - src/components/sections/Contact.tsx
---

# Seções (`src/components/sections`)

Âncoras do menu: `#projetos`, `#processo`, `#servicos`, `#sobre`, `#contato` (e `#inicio` no hero).

| Seção | O que faz |
|---|---|
| **Hero** | Tela como visor de câmera gravando: obturador abrindo, título entrando em foco, HUD com REC/timecode, retícula de foco seguindo o mouse, fundo `GridBackground`. À direita, a **câmera 3D** (`media/CameraPhotos`): gira sozinha, arrastar vira para os lados, inclina com o mouse e se desmonta (sozinha a cada 2 voltas ou ao clicar). CTAs: WhatsApp e "Ver projetos". |
| **Showreel** | `dafa-chamada.mp4` toca mudo em loop, sem botão de play. O ícone de som liga e desliga o áudio. Pausa fora da tela. |
| **Portfolio** | Galeria estilo Reels. No desktop é uma faixa de reels em 9:16: o ativo (hover/foco) abre na largura certa e os outros mostram o nome na vertical. Clique no ativo abre o vídeo com som (`VideoModal`). No celular é um carrossel com snap, e o reel ativo vem do `IntersectionObserver`. Só toca quando a seção está visível. |
| **ProcessSequence** | 138 quadros (`media/sequence`) desenhados em `<canvas>`. Mouse/dedo sobre o vídeo controla o tempo, as abas das etapas pulam para o trecho, a barra de tempo funciona pelo teclado, e parado ele toca sozinho. |
| **About** | "Quem faz a DAFA": texto da empresa, bio do Daniel e dois `PersonCard` (Daniel — CEO, Fabiano — Partner) com foto. |
| **Services** | Cartão SD real (`media/camera/cartao-sd-dafa.webp`). Em loop, o cartão acende, os cards de serviço saem de dentro dele, ficam na tela e voltam. Pausa com o mouse sobre os cards. Clicar no cartão solta de novo, e ele inclina com o mouse. |
| **Workflow** | Bento "Como funciona" (`ui/dafa-workflow-bento`): fluxo para o cartão DAFA, formatos e calendário. Sem métricas inventadas. |
| **GrowthChart** | Gráfico em motion design (loop): "postar por postar" (linha serrilhada) → "constância" (reta) → "constância + direção" (curva que muda de cor). Na quebra, a curva rompe o canto da grade e os quadradinhos de cima à direita voam. Texto digitado, pontinhos e glitch. Marcado como ilustração conceitual. |
| **Contact** | Bloco final com grade animada, canais (WhatsApp, e-mail, Instagram) e **FAQ** (`faq`, em `<details>`). |
