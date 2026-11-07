---
title: Escopo
slug: prd-escopo
type: prd
module: site
topic_type: reference
summary: O que está dentro e fora do escopo da versão 1 do site.
rag: include
status: current
updated_at: 2026-11-06
verified_against:
  - src/app/page.tsx
---

# 04 · Escopo

## Dentro do escopo (versão 1)

- Página única (one page) com as seções de [arquitetura da informação](06-arquitetura-da-informacao.md).
- Portfólio com vídeos verticais e foto, com modal para assistir com som.
- Animações presas ao scroll (GSAP + Lenis) respeitando movimento reduzido.
- Contato por WhatsApp (canal principal), e-mail e Instagram.
- Perguntas frequentes.
- SEO local completo: metadata, Open Graph, JSON-LD, sitemap, robots, manifest.
- Mídia otimizada para web.
- Guia de atualização do portfólio ([COMO-ATUALIZAR.md](../../COMO-ATUALIZAR.md)).

## Fora do escopo (versão 1)

| Item | Motivo |
|---|---|
| Formulário de contato | Opcional no briefing; WhatsApp é o canal principal |
| Painel administrativo / CMS | Conteúdo é editado em `src/content/site.ts` |
| Páginas individuais por projeto | Não pedidas; ver [pendências](10-pendencias.md) |
| Blog | Não pedido |
| Analytics | Ferramenta não definida |
| Biografia da Fabi | Briefing pede só a apresentação do Daniel |
| Depoimentos e métricas de resultados | Proibidos sem dados confirmados |
| Domínio e hospedagem | A definir com a DAFA |
