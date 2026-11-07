---
title: Arquitetura da informação
slug: prd-arquitetura-informacao
type: prd
module: site
topic_type: reference
summary: Ordem das seções da página única, âncoras e requisito correspondente.
rag: include
status: current
updated_at: 2026-11-06
verified_against:
  - src/app/page.tsx
  - src/components/Header.tsx
---

# 06 · Arquitetura da informação

O briefing pede: **abertura → projetos → apresentação da DAFA e do Daniel → serviços → contato**, sem obrigar o visitante a atravessar textos longos antes de ver o portfólio.

## Ordem implementada

| # | Seção | Âncora | Requisito |
|---|---|---|---|
| 1 | Cabeçalho fixo | — | [RF-12](requisitos-funcionais/rf-12-cabecalho-e-navegacao.md) |
| 2 | Abertura (hero) | `#inicio` | [RF-01](requisitos-funcionais/rf-01-abertura.md) |
| 3 | Vídeo de apresentação | `#showreel` | [RF-02](requisitos-funcionais/rf-02-video-de-apresentacao.md) |
| 4 | Faixa de serviços (letreiro) | — | [RF-01](requisitos-funcionais/rf-01-abertura.md) |
| 5 | Portfólio | `#projetos` | [RF-03](requisitos-funcionais/rf-03-portfolio.md) |
| 6 | Processo | `#processo` | [RF-05](requisitos-funcionais/rf-05-processo.md) |
| 7 | Quem somos | `#sobre` | [RF-06](requisitos-funcionais/rf-06-quem-somos.md) |
| 8 | Serviços | `#servicos` | [RF-07](requisitos-funcionais/rf-07-servicos.md) |
| 9 | Como funciona | — | [RF-08](requisitos-funcionais/rf-08-como-funciona.md) |
| 10 | Por que direção importa | — | [RF-09](requisitos-funcionais/rf-09-grafico-direcao.md) |
| 11 | Contato + perguntas frequentes | `#contato` | [RF-10](requisitos-funcionais/rf-10-contato-e-faq.md) |
| 12 | Rodapé | — | [RF-13](requisitos-funcionais/rf-13-rodape.md) |
| — | WhatsApp flutuante | — | [RF-11](requisitos-funcionais/rf-11-whatsapp-flutuante.md) |
| — | Modal de mídia | — | [RF-04](requisitos-funcionais/rf-04-modal-de-midia.md) |

## Menu

O cabeçalho aponta para: Projetos, Processo, Serviços, Sobre e Contato.

## Desvio consciente da ordem do briefing

O **Processo** fica entre o portfólio e o “Quem somos”. Ele continua mostrando trabalho real (o vídeo imobiliário avançando com o scroll), então não atrasa o contato com o portfólio.
