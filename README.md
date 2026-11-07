<div align="center">

# DAFA — Gerenciamento de Conteúdo

**Site portfólio da DAFA: produção audiovisual, conteúdo e tráfego pago em Santo Antônio da Platina – PR.**

[![Site](https://img.shields.io/badge/site-online-1700F5?style=for-the-badge)](https://dutrathiagodev.github.io/dafa-site/)
[![Instagram](https://img.shields.io/badge/@dafa__hub-Instagram-070743?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/dafa_hub/)

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.170-000000?logo=threedotjs&logoColor=white)

![Tela principal do projeto](docs/images/tela-principal.jpg)

</div>

## Sobre

Portfólio e apresentação comercial da DAFA, empresa de Daniel (CEO) e Fabiano (Partner). A página mostra os trabalhos logo de cara, explica de forma simples o que a DAFA faz e leva o visitante a conversar pelo WhatsApp. Sem métricas inventadas e sem depoimentos que não foram confirmados.

## Links

| | |
|---|---|
| Site publicado | https://dutrathiagodev.github.io/dafa-site/ |
| Instagram da DAFA | [@dafa_hub](https://www.instagram.com/dafa_hub/) |
| WhatsApp | [(43) 99900-1173](https://wa.me/5543999001173) |
| Documentação | [`docs/`](docs/README.md) (arquitetura e codebase) |

## O que tem na página

- **Hero** como o visor de uma câmera gravando (obturador, foco, REC), sobre uma grade animada em azul, com uma **câmera Sony ZV-E10 em 3D de verdade**: você arrasta e ela gira em qualquer direção (lados, cima, baixo, diagonais). Ao clicar (ou sozinha de tempos em tempos) ela se desmonta e monta de novo.
- **Vídeo de apresentação** tocando sozinho, com botão de som
- **Portfólio** em formato de Reels do Instagram: passe o mouse para abrir cada reel e clique para ver com som
- **Processo** com um vídeo que acompanha o mouse/dedo e as abas das etapas
- **Quem somos** com Daniel (CEO) e Fabiano (Partner)
- **Serviços** saindo de dentro de um cartão SD real da DAFA (vídeo recortado, girando), em loop
- **Como funciona**, um bento com diagramas animados (fluxo, formatos e calendário de pautas)
- **Gráfico** em motion design: postar por postar → constância → constância + direção, e a curva rompe o gráfico no final
- **Contato**, **Perguntas frequentes** e botão flutuante do WhatsApp
- Responsivo, mantém a posição ao recarregar (F5) e respeita quem prefere menos movimento

## Tecnologias

- [Next.js 15](https://nextjs.org) (App Router) e [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [GSAP 3](https://gsap.com) com ScrollTrigger, para as animações presas ao scroll
- [Lenis](https://lenis.darkroom.engineering), para a rolagem suave
- [three.js](https://threejs.org), para a câmera 3D do hero
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
  app/                  layout, página, SEO (sitemap, robots, manifest, imagem de compartilhamento) e ícones
  content/site.ts       todos os textos, contatos, serviços, projetos, equipe e FAQ
  components/
    layout/             Header, Footer, botão flutuante do WhatsApp
    sections/           uma seção da página por arquivo
    media/              câmera 3D do hero e modal de vídeo
    motion/             rolagem suave (e F5) e entradas dos elementos
    ui/                 peças reutilizáveis (botões, títulos, tag, cartão de pessoa, fundo em grade, bento)
  lib/                  asset(), GSAP, URL do site e dados estruturados (JSON-LD)
public/media/
  videos/ posters/      vídeos (completo + prévia de 8 s) e capas
  camera/               câmera 3D (giro e desmontagem) e cartão SD
  sequence/             138 frames do vídeo do processo
  team/ img/            fotos da equipe, logo e fotos
scripts/                preparar-video.sh e recortar-fundo.py
docs/                   arquitetura e codebase
```

A página é montada em `src/app/page.tsx`, que só compõe as seções. Os textos ficam em `src/content/site.ts` e os componentes só cuidam da apresentação. Para adicionar um projeto ao portfólio, siga o [COMO-ATUALIZAR.md](COMO-ATUALIZAR.md).

## SEO

- Título, descrição e palavras-chave locais (Santo Antônio da Platina, Norte Pioneiro do Paraná)
- Imagem de compartilhamento gerada automaticamente para WhatsApp e Instagram
- Dados estruturados de negócio local (com Daniel — CEO e Fabiano — Partner), site e perguntas frequentes
- `sitemap.xml` com os vídeos do portfólio, `robots.txt` e `manifest`
- Idioma `pt-BR`, metas de região e favicon com a logo

## Publicação

O site é publicado no GitHub Pages (https://dutrathiagodev.github.io/dafa-site/) pelo workflow [`deploy.yml`](.github/workflows/deploy.yml), que roda o lint, gera o site estático e publica:

- a cada push na `main`;
- manualmente, pela aba Actions.

Quando a DAFA tiver um domínio próprio, basta trocar `NEXT_PUBLIC_SITE_URL` no workflow (ou na nova hospedagem); ela alimenta o canonical, o sitemap e os dados estruturados.

## Pendências

- [ ] Arquivos das fontes **Creato Display** e **Callum IT** com licença web (hoje são Plus Jakarta Sans e Playfair Display, provisórias)
- [ ] Logo e símbolo originais em SVG (a logo e o favicon atuais vêm do PNG do site antigo)
- [ ] Confirmar o cliente e os serviços do projeto **imobiliário** e da **fotografia**
- [ ] Domínio próprio (hoje o site está no GitHub Pages)

## Time

| | |
|---|---|
| [@dutrathiagodev](https://github.com/dutrathiagodev) | Desenvolvimento, animações, otimização de mídia, SEO e documentação |

O trabalho foi dividido em commits pequenos, um por etapa.
