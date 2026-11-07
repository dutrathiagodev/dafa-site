<div align="center">

# DAFA — Gerenciamento de Conteúdo

**Site portfólio da DAFA: produção audiovisual, conteúdo e tráfego pago em Santo Antônio da Platina – PR.**

[![Site](https://img.shields.io/badge/site-em_breve-1700F5?style=for-the-badge)](#publicação)
[![Instagram](https://img.shields.io/badge/@dafa__hub-Instagram-070743?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/dafa_hub/)

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=white)

![Tela principal do projeto](docs/images/tela-principal.jpg)

</div>

## Sobre

Portfólio e apresentação comercial da DAFA, empresa dos sócios Daniel e Fabi. A página mostra os trabalhos logo de cara, explica de forma simples o que a DAFA faz e leva o visitante a conversar pelo WhatsApp. Sem métricas inventadas e sem depoimentos que não foram confirmados.

## Links

| | |
|---|---|
| Site publicado | Em breve (domínio e hospedagem a definir com a DAFA) |
| Instagram da DAFA | [@dafa_hub](https://www.instagram.com/dafa_hub/) |
| WhatsApp | [(43) 99900-1173](https://wa.me/5543999001173) |
| Documentação | [`docs/`](docs/README.md) (PRD, código e decisões) |

## O que tem na página

- **Hero** com o título entrando palavra por palavra e ícones de ferramentas que seguem o mouse
- **Vídeo de apresentação** que "abre" conforme rola, com opção de assistir com som
- **Portfólio** em colunas com paralaxe, prévias de vídeo tocando sozinhas e modal com som
- **Processo** com um vídeo que avança junto com o scroll (frames desenhados em `<canvas>`)
- **Serviços** saindo de dentro de um cartão de memória da DAFA
- **Como funciona**, um bento com diagramas animados (fluxo, formatos e calendário de pautas)
- **Gráfico** conceitual desenhado pelo scroll: postar por postar → constância → constância + direção
- **Quem somos**, **Contato**, **Perguntas frequentes** e botão flutuante do WhatsApp
- Layout responsivo (desktop, tablet e mobile) e respeito a quem prefere menos movimento

## Tecnologias

- [Next.js 15](https://nextjs.org) (App Router) e [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [GSAP 3](https://gsap.com) com ScrollTrigger, para as animações presas ao scroll
- [Lenis](https://lenis.darkroom.engineering), para a rolagem suave
- [lucide-react](https://lucide.dev), para os ícones
- ESLint

## Como rodar

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
npm run dev     # desenvolvimento em http://localhost:3000
npm run lint    # lint
npm run build   # build de produção
```

## Estrutura

```text
src/
  app/                  layout, página, SEO (sitemap, robots, manifest, imagem de compartilhamento) e favicon
  components/           uma seção da página por arquivo
    ui/                 peças reutilizáveis (cartão SD, bento animado)
  content/site.ts       todos os textos, contatos, serviços e projetos
  lib/                  GSAP, URL do site e dados estruturados (JSON-LD)
public/media/
  videos/               vídeos completos e prévias de 6 s, já otimizados
  posters/              capas dos vídeos
  sequence/             138 frames do vídeo do processo
  img/                  logo e fotos
docs/
  prd/                  requisitos do produto (visão, escopo, RF, RNF)
  codebase/             como o código funciona
  decisoes/             registros de decisões técnicas
```

A página é montada em `src/app/page.tsx`, que só compõe as seções. Os textos ficam em `src/content/site.ts` e os componentes só cuidam da apresentação. Para adicionar um projeto ao portfólio, siga o [COMO-ATUALIZAR.md](COMO-ATUALIZAR.md).

## SEO

- Título, descrição e palavras-chave locais (Santo Antônio da Platina, Norte Pioneiro do Paraná)
- Imagem de compartilhamento gerada automaticamente para WhatsApp e Instagram
- Dados estruturados de negócio local, site e perguntas frequentes
- `sitemap.xml` com os vídeos do portfólio, `robots.txt` e `manifest`
- Idioma `pt-BR`, metas de região e favicon com a logo

## Publicação

Ainda não publicado. Quando o domínio for definido, configure a variável `NEXT_PUBLIC_SITE_URL` na hospedagem (por exemplo, `https://www.seudominio.com.br`); ela alimenta o canonical, o sitemap e os dados estruturados.

## Pendências

- [ ] Arquivos das fontes **Creato Display** e **Callum IT** com licença web (hoje são Plus Jakarta Sans e Playfair Display, provisórias)
- [ ] Logo e símbolo originais em SVG (a logo e o favicon atuais vêm do PNG do site antigo)
- [ ] Foto profissional do Daniel
- [ ] Confirmar o cliente e os serviços do projeto **imobiliário** e da **fotografia**
- [ ] Domínio e hospedagem

## Time

| | |
|---|---|
| [@dutrathiagodev](https://github.com/dutrathiagodev) | Desenvolvimento, animações, otimização de mídia, SEO e documentação |

O trabalho foi dividido em commits pequenos, um por etapa.
