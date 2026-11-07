---
title: Prompts para gerar o vídeo da câmera (Higgsfield)
slug: producao-prompts-camera
type: guide
module: hero
summary: Prompts prontos para gerar no Higgsfield os vídeos realistas da câmera que vão substituir o modelo 3D do hero.
rag: include
status: current
updated_at: 2026-11-07
---

# Vídeo realista da câmera — prompts para o Higgsfield

Hoje o hero mostra uma câmera **3D feita em código** (`src/components/Camera3D.tsx`).
A ideia é trocar por **imagens realistas**: um vídeo gerado no Higgsfield (ou filmado pela DAFA)
que o site transforma em frames para girar arrastando, igual ao vídeo do processo.

## Regras para todos os vídeos

- **Sem marca de terceiros:** nada de Sony, Canon etc. (pedir “unbranded”, “no logos”).
- **Sem texto** no vídeo.
- Fundo **preto ou azul-marinho**, luz de contorno **azul royal** (cor da DAFA).
- Câmera do vídeo **parada** (sem movimento de câmera), só o objeto se mexe.
- Duração de **5 a 10 s**, qualidade máxima, MP4.
- Gerar duas versões quando possível: **16:9** (desktop) e **9:16** (celular).

## 1. Giro de 360° (principal)

```text
Ultra-realistic product video of a matte black full-frame mirrorless camera with a zoom lens, completely unbranded with no logos and no text, floating centered on a pure black background. The camera performs one slow, perfectly smooth 360-degree turntable rotation. Cinematic studio lighting: soft white key light from the front-left and strong deep royal blue (#1010EC) rim lights from behind, subtle blue reflections on the lens glass, crisp details on dials and textured grip. Locked-off static shot, shallow depth of field, 4K, 24 fps, photorealistic, commercial product cinematography.
```

## 2. Vista explodida (desmonta e monta)

```text
Ultra-realistic cinematic exploded-view animation of an unbranded matte black mirrorless camera with no logos and no text, on a dark navy-to-black gradient background. The camera slowly disassembles: the lens separates forward into its glass elements, focus and zoom rings; the top dials, shutter button and viewfinder lift up; the image sensor and circuit boards float out of the body — all parts stay perfectly aligned and hover in place, then smoothly reassemble into the complete camera. Deep royal blue (#1010EC) rim lighting, soft white key light, realistic metal and rubber materials, static camera, 4K, 24 fps, photorealistic.
```

## 3. Close de detalhes (para transições)

```text
Macro photorealistic close-up of a camera lens focus ring slowly rotating, knurled rubber texture, metal mount ring, glass elements reflecting deep royal blue (#1010EC) light, black background, shallow depth of field, unbranded, no text, static shot, 4K, 24 fps.
```

```text
Macro photorealistic close-up of a camera mode dial and shutter button on a matte black unbranded camera body, a finger presses the shutter, soft white light with deep royal blue (#1010EC) rim light, black background, no text, no logos, 4K, 24 fps.
```

## 4. Loop do hero (alternativa)

```text
Photorealistic unbranded matte black mirrorless camera floating in a dark void, lens facing the viewer at a slight three-quarter angle, a slow light sweep of deep royal blue (#1010EC) passes across the body and the lens glass, gentle floating motion, seamless loop, no text, no logos, static camera, 4K, 24 fps.
```

## Depois de gerar

Mande os MP4 (pode ser pelo WhatsApp ou Drive). O próximo passo no site:

1. extrair os frames (≈ 120 imagens WebP de 540–960 px, como em `public/media/sequence/`);
2. trocar a `Camera3D` por um componente de frames: arrastar gira a câmera, e o vídeo da
   vista explodida vira o botão “Ver por dentro”;
3. manter a câmera 3D só como reserva enquanto os frames carregam.
