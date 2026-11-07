---
title: Mídia, câmera 3D e scripts
slug: codebase-midia
type: codebase
module: midia
topic_type: reference
summary: Onde fica cada mídia em public/media, formatos e qualidade, como funciona a câmera 3D do hero (modelo three.js + desmontagem em vídeo recortado por IA) e os scripts de preparo.
triggers: [public/media, Camera3D, zve10.glb, model-viewer, alpha-video, zve10-desmonta, preparar-video.sh, recortar-fundo.py, asset()]
related: [secoes.md, ../../COMO-ATUALIZAR.md]
rag: include
status: current
updated_at: 2026-11-07
verified_against:
  - src/components/media/camera-3d/Camera3D.tsx
  - src/components/media/camera-3d/model-viewer.ts
  - src/lib/alpha-video.ts
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

Arquivos em `public/media/camera/`:

- `zve10.glb`: modelo 3D real da câmera, com textura (cerca de 2,9 MB, carregado só depois da página abrir). Gerado no Hunyuan3D-2.1 (Hugging Face) a partir da foto real da ZV-E10 + Sigma 16mm recortada por IA. O original está em `dafa/camera-gemini/zve10-hunyuan.glb`. O visualizador força os materiais a ficarem opacos e com as duas faces visíveis, porque modelos gerados por IA às vezes vêm com faces viradas para dentro.
- `zve10-desmonta.mp4`: vista explodida em vídeo (abre, segura, monta). Os quadros foram recortados por IA (rembg / IS-Net, com os buracos preenchidos) e "empilhados": cor em cima, máscara embaixo. Fica com fundo transparente e a câmera 100% sólida.
- `zve10-frente.webp`: 1º quadro recortado. Aparece na hora e é a versão parada (movimento reduzido ou sem WebGL).

**Como funciona:**
- `model-viewer.ts`: three.js com TrackballControls. Gira livre em **todos os eixos** (lados, cima/baixo, diagonais e no próprio plano), com inércia. Parado, gira sozinho. Fundo transparente, luz de estúdio com contra-luz azul. A pose inicial vem de `MODEL_POSE` (`config.ts`).
- `Camera3D.tsx`: o clique (ou sozinho depois de 14 s sem mexer) leva o modelo de volta à frente e troca para o vídeo da desmontagem, desenhado por `src/lib/alpha-video.ts`. Se existir `modelOpen` (modelo 3D da vista explodida), ele entra no fim da ida e a câmera aberta também gira em 3D; sem ele, aberta, arrastar inclina. Outro clique monta, e no fim volta para o 3D.
- O canvas 3D é 70% maior que a área da câmera e não recebe cliques; o arraste é lido na área da câmera. Assim o modelo nunca é cortado ao girar.
- `scripts/otimizar-glb.py` recomprime as texturas de um GLB novo antes de colocar no site.
- No celular o toque gira a câmera (`touch-action: none` só nessa área).

## Cartão SD (`camera/cartao-sd.mp4`)

Vídeo real do cartão girando (gerado no Gemini a partir da foto), 600×600 em loop perfeito, recortado por IA e empilhado como a desmontagem. A capa é `cartao-sd-capa.webp`, também recortada.

`components/media/LoopVideo.tsx` serve para qualquer vídeo curto em loop: sem som, toca só na tela e fica parado com movimento reduzido. Com `alpha`, desenha um vídeo empilhado com fundo transparente.

**Como recortar um vídeo novo:** extraia os quadros, rode o recorte por IA (rembg `isnet-general-use`) em cada um, empilhe cor e máscara num quadro do dobro da altura e codifique em H.264. Não use recorte por brilho: ele deixa as partes pretas do produto transparentes.

## Scripts (`scripts/`)

- `preparar-video.sh original.mp4 nome [inicio]` gera vídeo completo, prévia e capa com as configurações acima. Requer `ffmpeg`.
- `python3 scripts/recortar-fundo.py in out [tamanho=1200] [limite=14]` recorta o fundo preto ligado às bordas de uma foto de produto. O objeto fica 100% opaco e só o fundo some. Requer Pillow e numpy. A foto precisa ter fundo preto puro, **sem** halo.
