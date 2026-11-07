---
title: Mídia, câmera 3D e scripts
slug: codebase-midia
type: codebase
module: midia
topic_type: reference
summary: Onde fica cada mídia em public/media, formatos e qualidade, como a câmera 3D do hero funciona (vídeos empilhados cor+máscara em WebGL) e os scripts de preparo.
triggers: [public/media, CameraPhotos, zve10-giro, zve10-desmonta, preparar-video.sh, recortar-fundo.py, asset()]
related: [secoes.md, ../../COMO-ATUALIZAR.md]
rag: include
status: current
updated_at: 2026-11-07
verified_against:
  - src/components/media/CameraPhotos.tsx
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

## Câmera 3D do hero (`media/CameraPhotos.tsx`)

Arquivos em `public/media/camera/`:

- `zve10-giro.mp4`: volta completa de 360° (208 quadros, 24 fps). O último quadro encosta no primeiro, então o loop é perfeito.
- `zve10-desmonta.mp4`: abre em vista explodida, segura e volta montando (ida + espera + volta no mesmo arquivo).
- `zve10-frente.webp`: primeiro quadro com transparência. Aparece na hora, enquanto os vídeos carregam (e é a versão parada para movimento reduzido ou sem WebGL).

**Vídeos empilhados.** Cada quadro tem a cor (já sobre preto) na metade de cima e a máscara de recorte (branco = câmera) na metade de baixo. Um shader WebGL junta as duas e o fundo fica transparente de verdade, em qualquer navegador e com arquivo leve. O giro é codificado com keyframe a cada 6 quadros, para arrastar (buscar o tempo) ficar fluido.

**Comportamento:**

- gira sozinha;
- **arrastar** para os lados vira a câmera, com inércia ao soltar;
- o mouse por cima **inclina** (rotateX/Y com perspectiva);
- **clique/toque** ou Enter, e sozinha a cada 2 voltas: volta para a frente e se desmonta;
- flutua de leve;
- pausa fora da tela.

**Origem.** Fotos e vídeos gerados no Gemini (Veo) a partir de fotos reais da Sony ZV-E10 + Sigma 16mm f/1.4. Os originais ficam fora do site, em `dafa/camera-gemini/`.

## Cartão SD (`camera/cartao-sd-dafa.webp`)

Foto real recortada (silhueta pelo casco convexo do cartão, 100% opaca). O brilho azul em volta é CSS, não faz parte da imagem.

## Scripts (`scripts/`)

- `preparar-video.sh original.mp4 nome [inicio]` gera vídeo completo, prévia e capa com as configurações acima. Requer `ffmpeg`.
- `python3 scripts/recortar-fundo.py in out [tamanho=1200] [limite=14]` recorta o fundo preto ligado às bordas de uma foto de produto. O objeto fica 100% opaco e só o fundo some. Requer Pillow e numpy. A foto precisa ter fundo preto puro, **sem** halo.
