---
title: Critérios de lançamento
slug: prd-criterios-lancamento
type: prd
module: site
topic_type: reference
summary: Checklist que precisa estar completo antes de publicar o site.
rag: include
status: current
updated_at: 2026-11-06
---

# 11 · Critérios de lançamento

O site só vai ao ar com todos os itens marcados.

## Conteúdo

- [ ] Nenhum `TODO(DAFA)` restante em `src/content/site.ts`.
- [ ] Foto do Daniel no lugar do espaço “(pendente)”.
- [ ] Todos os textos revisados pela DAFA.
- [ ] Nenhuma métrica, depoimento ou resultado sem confirmação.

## Marca

- [ ] Fontes oficiais instaladas, ou uso das provisórias aprovado pela DAFA.
- [ ] Logo oficial em SVG.

## Técnico

- [ ] `npm run lint` sem erros.
- [ ] `npm run build` sem erros.
- [ ] `NEXT_PUBLIC_SITE_URL` definido com o domínio final.
- [ ] `/sitemap.xml`, `/robots.txt`, `/opengraph-image` e `/icon.png` respondendo 200.

## Experiência

- [ ] Testado no celular (375 px) e no desktop (1440 px), sem rolagem lateral.
- [ ] Todos os vídeos abrem no modal e tocam com som.
- [ ] Todos os links de WhatsApp, e-mail e Instagram funcionando.
- [ ] Navegação por teclado com foco visível.
- [ ] Testado com movimento reduzido ativado.

## Depois de publicar

- [ ] Enviar o sitemap no Google Search Console.
- [ ] Testar a prévia do link no WhatsApp.
- [ ] Validar os dados estruturados no teste de pesquisa aprimorada do Google.
