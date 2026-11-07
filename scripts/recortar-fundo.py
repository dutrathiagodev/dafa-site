"""
Recorta o fundo preto de uma foto de produto (ex.: câmera e cartão SD do site)
e salva um WebP com transparência.

Uso: python3 scripts/recortar-fundo.py original.jpg saida.webp [tamanho] [limite]
  tamanho  lado em px do resultado (padrão 1200)
  limite   brilho (0–255, já suavizado) abaixo do qual o fundo some (padrão 14).
           Mantenha baixo: o objeto fica 100% opaco e com as cores originais.
           Fotos geradas para isso devem ter fundo preto puro e SEM halo/brilho em
           volta (o brilho é feito por CSS no site).

O fundo é o preto ligado às bordas da imagem; partes escuras dentro do objeto
continuam opacas. Requer Pillow e numpy.
"""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

src, out = sys.argv[1], sys.argv[2]
size = int(sys.argv[3]) if len(sys.argv) > 3 else 1200
T = float(sys.argv[4]) if len(sys.argv) > 4 else 14.0
im = Image.open(src).convert("RGB").resize((size, size), Image.LANCZOS)
a = np.asarray(im).astype(np.float32)
lum = a.max(axis=2)
# brilho suavizado: o ruído de compressão perto do preto não vira "ilha" no fundo
lum_s = np.asarray(Image.fromarray(lum.astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32)
cand = lum_s < T
h, w = cand.shape
bg = np.zeros_like(cand)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if cand[y, x] and not bg[y, x]:
            bg[y, x] = True; q.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if cand[y, x] and not bg[y, x]:
            bg[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not bg[ny, nx]:
            bg[ny, nx] = True; q.append((ny, nx))
# descarta ilhas pequenas fora do objeto (sobras de ruído)
obj = ~bg
seen = np.zeros_like(obj)
keep = np.zeros_like(obj)
min_area = obj.size * 0.00015
for sy, sx in zip(*np.nonzero(obj)):
    if seen[sy, sx]:
        continue
    comp = []
    dq = deque([(sy, sx)]); seen[sy, sx] = True
    while dq:
        y, x = dq.popleft(); comp.append((y, x))
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and obj[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True; dq.append((ny, nx))
    if len(comp) >= min_area:
        ys, xs = zip(*comp); keep[list(ys), list(xs)] = True
bg = ~keep

# alpha: objeto 100% opaco; só o fundo preto ligado às bordas some.
# Um desfoque mínimo suaviza a borda (antisserrilhado) sem deixar o objeto transparente.
alpha = np.where(bg, 0.0, 1.0)
am = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
am = Image.fromarray(np.maximum(np.asarray(am), (alpha * 255).astype(np.uint8)))
rgba = im.copy(); rgba.putalpha(am)
rgba.save(out, "WEBP", quality=92, method=6)
print(out, "bg%", round(bg.mean() * 100, 1))
