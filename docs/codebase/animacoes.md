---
title: Animações e rolagem
slug: codebase-animacoes
type: codebase
module: animacoes
topic_type: reference
summary: Como GSAP, ScrollTrigger, Lenis, Reveals e as animações CSS são usados, e as regras de desempenho e movimento reduzido.
triggers: [gsap, ScrollTrigger, Lenis, data-reveal, prefers-reduced-motion, scrollRestoration]
related: [secoes.md]
rag: include
status: current
updated_at: 2026-11-07
verified_against:
  - src/lib/gsap.ts
  - src/components/motion/SmoothScroll.tsx
  - src/components/motion/Reveals.tsx
  - src/app/globals.css
---

# Animações

## Ferramentas

- `src/lib/gsap.ts` registra `ScrollTrigger` e `useGSAP` uma vez e exporta `prefersReducedMotion()`. Importe o GSAP **sempre** daqui.
- Animações de seção usam `useGSAP(() => …, { scope })`, que limpa tudo ao desmontar.
- Animações simples e contínuas são CSS, com tokens `--animate-*` em `globals.css`: `shutter`, `focus`, `rec`, `hud`, `grid`, `glow`, `float`.

## Rolagem (`motion/SmoothScroll.tsx`)

- Lenis (`lerp: 0.1`, âncoras com `offset: -72` por causa do header) roda no `gsap.ticker` e chama `ScrollTrigger.update`.
- **F5 mantém a posição.** `history.scrollRestoration = "manual"`. A posição é salva em `sessionStorage` (`dafa:scroll-y`) no `pagehide` e restaurada depois do `load` + `ScrollTrigger.refresh()`. O navegador sozinho voltava ao topo porque as seções presas ao scroll só ganham altura depois do GSAP medir. Com `#âncora` na URL, a âncora vence.
- Os eventos `dafa:lock-scroll` / `dafa:unlock-scroll` param e retomam o Lenis (usados pelo modal).

## Entradas (`motion/Reveals.tsx`)

Todo elemento com `data-reveal` começa invisível (`autoAlpha 0, y 32`) e aparece com `IntersectionObserver` (`rootMargin "0px 0px -8% 0px"`), em lote com `stagger 0.07`. Usa IO, e não ScrollTrigger, para não depender de posições calculadas no carregamento. Com ScrollTrigger, itens do FAQ ficavam invisíveis.

## Regras

- Nada trava o scroll (sem `pin`).
- Loops (`GrowthChart`, `Services`, câmera do hero, vídeos) **pausam fora da tela** (ScrollTrigger `onToggle` ou `IntersectionObserver`).
- `prefersReducedMotion()`: sem Lenis e sem entradas. A câmera mostra a foto parada e o gráfico mostra o estado final.
- Sem cursor customizado, marquee, "bolinhas" ou textos de instrução tipo "arraste"/"clique". O visual é limpo, sem cara de IA.
