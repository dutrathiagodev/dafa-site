---
title: Diretrizes de conteúdo
slug: prd-diretrizes-conteudo
type: prd
module: site
topic_type: reference
summary: Regras do briefing sobre o que pode e o que não pode ser publicado no site.
rag: include
status: current
updated_at: 2026-11-06
verified_against:
  - src/content/site.ts
---

# 08 · Diretrizes de conteúdo

## Obrigatório

- Assinatura: **“Gerenciamento de Conteúdo”**.
- CTA principal: **“Fale com a DAFA”** ou **“Solicite um orçamento”**.
- Mensagem inicial do WhatsApp: “Olá! Conheci a DAFA pelo site e gostaria de conversar sobre um projeto.”
- Linguagem clara, próxima e profissional.
- Mencionar Daniel **e** Fabi na apresentação; desenvolver só a apresentação do Daniel.

## Proibido

| Não fazer | Por quê |
|---|---|
| Inventar resultados, depoimentos, números de clientes ou métricas | Exigência do briefing |
| Apresentar ideia não executada como entrega | Conceitos precisam ser identificados como conceitos |
| Sugerir que a DAFA faz gestão completa de todos os clientes | Serviço listado deve corresponder à entrega real |
| Apresentar todos os serviços como inclusos em qualquer contrato | Cada projeto pode envolver só parte das etapas |
| Acrescentar formação, sobrenome, tempo de experiência ou histórico do Daniel | Não foram fornecidos |
| Usar “Criar exige mais do que imaginar” | Frase antiga descartada |
| Cortar vídeo vertical para caber em bloco horizontal | Preservar o enquadramento |

## Como o site cumpre

- O gráfico de “direção” traz a legenda **“Ilustração conceitual, sem dados reais.”**
- O calendário do bento é marcado no código como exemplo ilustrativo.
- O processo avisa: “Cada projeto pode envolver só parte dessas etapas, conforme o escopo combinado.”
- Cada projeto declara em `services` só o que foi entregue.
- Projetos com dados a confirmar estão marcados com `TODO(DAFA)` em `src/content/site.ts`.

## Clientes autorizados

| Cliente | Serviço informado | Instagram |
|---|---|---|
| Arnold Gym | Vídeo promocional, roteiro | @arnoldgym_sap |
| Clínica Flore SER | Vídeos para redes sociais | @flore_serclinica |
| Flash Mobilidade | Apresentação do app, comunicação | @flashdrivemobilidade |
