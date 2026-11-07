---
title: Identidade visual
slug: prd-identidade-visual
type: prd
module: site
topic_type: reference
summary: Paleta, tipografia, logo e regras de movimento aplicadas no site.
rag: include
status: current
updated_at: 2026-11-06
verified_against:
  - src/app/globals.css
  - src/app/layout.tsx
---

# 07 · Identidade visual

Direção: moderna, marcante e **predominantemente escura**, com azul profundo, azul royal e textos claros.

## Paleta

A paleta abaixo é a proposta do briefing para padronizar o site (não é extração exata dos arquivos da marca). Tokens em `src/app/globals.css`.

| Token Tailwind | Uso | Hex |
|---|---|---|
| `bg` | Fundo principal | `#07080C` |
| `surface` | Blocos e cartões | `#101116` |
| `navy` | Profundidade e gradientes | `#030326` |
| `royal` | Destaque principal | `#1010EC` |
| `electric` | Botões e interações | `#3333FF` |
| `ink` | Texto principal | `#F4F4F8` |
| `muted` | Texto secundário | `#B9BBD0` |
| `line` | Bordas | `#292A32` |

O favicon usa o `#1700F5` do material de identidade visual da DAFA.

Regras:
- O preto azulado predomina.
- Azul fica para botões e pontos de atenção.
- Texto longo em `ink` ou `muted`, nunca em azul sobre fundo escuro.
- Gradiente principal: `#030326 → #1010EC`.

## Tipografia

| Papel | Fonte da marca | Fonte usada hoje (provisória) | Variável |
|---|---|---|---|
| Destaques curtos | Callum IT | Playfair Display itálico 700/800 | `--font-callum` |
| Texto, menus, botões | Creato Display | Plus Jakarta Sans 400–800 | `--font-creato` |

As fontes da marca dependem dos arquivos com licença web. Ver [pendências](10-pendencias.md).

## Logo

- A logo atual vem do PNG transparente que estava no site antigo (`public/media/img/logo-dafa-crop.png`).
- O briefing pede **não reconstruir a logo com fonte comum**: nenhuma versão em texto foi criada.
- Os dois “A” do símbolo representam a parceria entre os sócios.

## Movimento

- Arcos de luz azul inspirados na identidade, com movimento lento (`animate-drift`, 18 s).
- Animações de entrada discretas, efeitos leves ao passar o mouse.
- Tudo desliga com movimento reduzido ([RNF-03](requisitos-nao-funcionais/rnf-03-movimento-reduzido.md)).
