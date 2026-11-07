---
title: Jornada do visitante
slug: prd-jornada
type: prd
module: site
topic_type: flow
summary: Caminho do visitante desde o link até a conversa no WhatsApp.
rag: include
status: current
updated_at: 2026-11-06
verified_against:
  - src/components/Hero.tsx
  - src/components/Header.tsx
  - src/components/WhatsAppFloat.tsx
---

# 05 · Jornada do visitante

```text
Instagram / WhatsApp
        │  (link com imagem de compartilhamento)
        ▼
  Abertura (hero) ──► "Solicite um orçamento" ──► WhatsApp
        │
        ▼
  Vídeo de apresentação ──► assistir com som
        │
        ▼
  Portfólio ──► abre projeto no modal ──► @ do cliente no Instagram
        │
        ▼
  Processo · Quem somos · Serviços · Como funciona · Gráfico
        │
        ▼
  Contato ──► WhatsApp / e-mail / Instagram
```

## Pontos de conversão

O WhatsApp pode ser aberto a partir de:

1. botão **“Fale com a DAFA”** no cabeçalho (sempre visível);
2. botão **“Solicite um orçamento”** na abertura;
3. link “Não sabe por onde começar?” nos serviços;
4. bloco de contato no final;
5. botão flutuante (aparece depois da primeira tela);
6. rodapé.

Todos usam a mesma URL com a mensagem inicial do briefing:
“Olá! Conheci a DAFA pelo site e gostaria de conversar sobre um projeto.”

## Ação secundária

Explorar o portfólio: o botão **“Ver projetos”** na abertura leva direto à seção.
