---
title: Mídia, câmera 3D e scripts
slug: codebase-midia
type: codebase
module: midia
topic_type: reference
summary: Onde fica cada mídia em public/media, formatos e qualidade, como a câmera 3D do hero funciona (vídeos reais sem recorte, giro para os dois lados) e os scripts de preparo.
triggers: [public/media, Camera3D, zve10-giro, zve10-desmonta, preparar-video.sh, recortar-fundo.py, asset()]
related: [secoes.md, ../../COMO-ATUALIZAR.md]
rag: include
status: current
updated_at: 2026-11-07
verified_against:
  - src/components/media/camera-3d/Camera3D.tsx
  - src/components/media/camera-3d/camera-controller.ts
  - src/components/media/camera-3d/reversible-loop.ts
  - scripts/preparar-video.sh
  - scripts/recortar-fundo.py
  - src/content/site.ts
---

# Mídia

Todo caminho de `/media` passa por `asset()` (prefixo do GitHub Pages).

## `public/media`

| Pasta | Conteúdo | Formato |
|---|---|---|
| `videos/` | `<slug>.mp4` (completo, com som) e `<slug>-preview.mp4` (8 s, sem som) | H.264, lado maior 1280 px. Completo: CRF 26 + AAC 96k. Prévia: CRF 20. |
| `posters/` | capa de cada vídeo | WebP q90, lado maior 1920 px |
| `img/` | logo e fotos avulsas | — |
| `sequence/` | 138 quadros do ProcessSequence | WebP 540×960 |
| `team/` | `daniel.webp`, `fabiano.webp` | WebP 640 px |
| `camera/` | câmera 3D do hero e cartão SD | ver abaixo |

**Qualidade é prioridade.** Nunca reduzir cor, nunca usar fundo semitransparente nas fotos de produto, nunca cortar o enquadramento dos reels.

## Câmera 3D do hero (`media/camera-3d/`)

Arquivos em `public/media/camera/`, todos 1280×720 e 24 fps:

- `zve10-giro.mp4`: volta completa de 360° (208 quadros). O último quadro encosta no primeiro.
- `zve10-giro-volta.mp4`: o mesmo giro invertido, para girar ao contrário sem travar.
- `zve10-desmonta.mp4`: abre em vista explodida, segura e volta montando (ida + espera + volta).
- `zve10-frente.webp`: primeiro quadro. Aparece na hora e é a versão parada (movimento reduzido).

**Sem recorte.** A câmera é mostrada com o fundo original do vídeo, 100% sólida. A classe `.fade-edges` (globals.css) esfuma só as beiradas retas do vídeo no fundo do site, sem apagar o meio (aberta, a câmera ocupa quase a largura toda). O recorte por brilho deixava as partes pretas da câmera transparentes, então foi abandonado.

**Fluidez.** O giro nunca "busca quadro a quadro" (isso trava). `reversible-loop.ts` sempre deixa o navegador **tocar** o vídeo e só muda a velocidade (`playbackRate`) para alcançar o ponto do arraste. Para trás, toca a cópia invertida a partir do mesmo ponto.

**Comportamento** (`camera-controller.ts`):

- gira sozinha;
- **arrastar** na horizontal gira para os dois lados, com inércia ao soltar;
- arrastar na vertical inclina para cima e para baixo (no toque, o vertical rola a página);
- o mouse por cima inclina de leve;
- **clique/toque** ou Enter, e sozinha a cada 2 voltas: volta para a frente e se desmonta;
- aberta, arrastar gira a vista explodida para os lados e para cima/baixo; clique monta;
- flutua e pausa fora da tela.

Tempos e limites ficam em `config.ts`.

**Origem.** Vídeos gerados no Gemini (Veo) a partir de fotos reais da Sony ZV-E10 + Sigma 16mm f/1.4. Os originais ficam fora do site, em `dafa/camera-gemini/`.

## Cartão SD (`camera/cartao-sd.mp4`)

Vídeo real do cartão (gerado no Gemini a partir da foto), 600×600 em loop perfeito, com capa `cartao-sd-capa.webp`. Também sem recorte: a borda some no fundo com `.fade-edges` (prop `fadeEdges` do `LoopVideo`).

`components/media/LoopVideo.tsx` serve para qualquer vídeo curto em loop: sem som, toca só na tela e fica parado com movimento reduzido.

## Scripts (`scripts/`)

- `preparar-video.sh original.mp4 nome [inicio]` gera vídeo completo, prévia e capa com as configurações acima. Requer `ffmpeg`.
- `python3 scripts/recortar-fundo.py in out [tamanho=1200] [limite=14]` recorta o fundo preto ligado às bordas de uma foto de produto. O objeto fica 100% opaco e só o fundo some. Requer Pillow e numpy. A foto precisa ter fundo preto puro, **sem** halo.
