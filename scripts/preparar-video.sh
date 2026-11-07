#!/usr/bin/env bash
# Prepara um vídeo do portfólio para o site, com foco em qualidade.
# Uso: ./scripts/preparar-video.sh caminho/original.mp4 nome-do-projeto [inicio-da-previa-em-segundos]
# Gera em public/media:
#   videos/<nome>.mp4          vídeo completo com som (lado maior 1280 px)
#   videos/<nome>-preview.mp4  prévia de 8 s sem som (lado maior 1280 px, alta qualidade)
#   posters/<nome>.webp        capa (lado maior 1920 px)
# Requer ffmpeg no PATH.
set -euo pipefail

SRC="${1:?informe o vídeo original}"
NAME="${2:?informe o nome do projeto (ex.: arnold-gym)}"
START="${3:-1}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/media"
mkdir -p "$OUT/videos" "$OUT/posters"

FIT1280="scale='if(gt(iw,ih),1280,-2)':'if(gt(iw,ih),-2,1280)':flags=lanczos"
FIT1920="scale='if(gt(iw,ih),1920,-2)':'if(gt(iw,ih),-2,1920)':flags=lanczos"

ffmpeg -v error -y -i "$SRC" -vf "$FIT1280" -c:v libx264 -preset slow -crf 26 \
  -profile:v high -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart "$OUT/videos/$NAME.mp4"

ffmpeg -v error -y -ss "$START" -t 8 -i "$SRC" -vf "$FIT1280" -an -c:v libx264 -preset slow \
  -crf 20 -profile:v high -pix_fmt yuv420p -movflags +faststart "$OUT/videos/$NAME-preview.mp4"

ffmpeg -v error -y -ss "$(echo "$START + 1" | bc)" -i "$SRC" -frames:v 1 -vf "$FIT1920" \
  -c:v libwebp -q:v 90 "$OUT/posters/$NAME.webp"

du -h "$OUT/videos/$NAME.mp4" "$OUT/videos/$NAME-preview.mp4" "$OUT/posters/$NAME.webp"
