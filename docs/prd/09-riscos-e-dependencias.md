---
title: Riscos e dependências
slug: prd-riscos
type: prd
module: site
topic_type: reference
summary: Riscos do projeto, impacto e mitigação adotada.
rag: include
status: current
updated_at: 2026-11-06
---

# 09 · Riscos e dependências

## Dependências externas

| Dependência | Responsável | Bloqueia |
|---|---|---|
| Arquivos das fontes com licença web | DAFA | Fidelidade tipográfica |
| Logo e símbolo em SVG | DAFA | Nitidez da logo e favicon oficial |
| Foto do Daniel | DAFA | Seção “Quem somos” completa |
| Confirmação de clientes e serviços | DAFA | Textos finais do portfólio |
| Domínio e hospedagem | DAFA | Publicação e SEO em produção |

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Vídeos pesados deixarem o site lento no 4G | Alto | Vídeos recomprimidos (316 MB → 34 MB), prévias de ~150 KB, `preload="none"` |
| Animações travarem em celulares fracos | Médio | Só `transform`/`opacity`, frames em canvas, versão simplificada dos serviços no mobile |
| Visitante sensível a movimento | Médio | `prefers-reduced-motion` desliga as animações |
| Fontes provisórias irem para produção | Médio | Pendência registrada; troca isolada em `layout.tsx` |
| Uso de conteúdo de terceiros | Alto | Vídeos de referência (ex.: câmeras Sony) usados só como inspiração, nunca como mídia |
| SEO apontar para `localhost` | Alto | `NEXT_PUBLIC_SITE_URL` obrigatório no deploy (ver [critérios](11-criterios-de-lancamento.md)) |
| Repositório público expor vídeos de clientes | Médio | Repositório mantido **privado** |
