# DAFA — Gerenciamento de Conteúdo · Site portfólio

Site institucional e portfólio da DAFA (Santo Antônio da Platina – PR).

**Stack:** Next.js 15 (App Router) · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · lucide-react.

## Rodar

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
```

## Estrutura

| Caminho | O que é |
|---|---|
| `src/content/site.ts` | **Todo o conteúdo editável** (contatos, serviços, projetos, FAQ) |
| `src/app/layout.tsx` | Fontes e metadata de SEO |
| `src/app/{sitemap,robots,manifest,opengraph-image}.ts(x)` | SEO técnico e imagem de compartilhamento |
| `src/lib/structured-data.ts` | JSON-LD (negócio local, site e FAQ) |
| `src/components/` | Seções da página |
| `src/components/ui/` | Peças reutilizáveis (cartão SD, bento animado) |
| `public/media/` | Vídeos, capas e frames já otimizados para web |

## Animações

- **Rolagem suave:** Lenis sincronizado com o relógio do GSAP (`SmoothScroll.tsx`).
- **Hero:** título entrando palavra por palavra e ícones que seguem o mouse.
- **Processo:** vídeo que avança com o scroll, desenhado em `<canvas>` a partir de 138 frames WebP (mais fluido que `video.currentTime`).
- **Serviços:** cards que saem voando de um cartão de memória (desktop).
- **Como funciona:** bento com diagramas vivos (adaptado do ink-orbit-features, do 21st.dev).
- **Gráfico:** linhas desenhadas pelo scroll com texto embaralhado.
- Todas respeitam `prefers-reduced-motion`.

## Pendências (aguardando a DAFA)

- [ ] Arquivos das fontes **Creato Display** e **Callum IT** com licença web (hoje são Plus Jakarta Sans e Playfair Display, provisórias).
- [ ] Logo e símbolo originais em SVG (a logo atual veio do HTML antigo; o favicon "DA" é provisório).
- [ ] Foto profissional do Daniel.
- [ ] Confirmar o cliente e os serviços do projeto **imobiliário** e da **fotografia**.
- [ ] Domínio e hospedagem → definir `NEXT_PUBLIC_SITE_URL`.

Para atualizar o portfólio, veja [COMO-ATUALIZAR.md](COMO-ATUALIZAR.md).
