"""
Deixa um modelo 3D (.glb) leve para o site: recomprime as texturas embutidas em JPEG
(cor em 2048 px; demais mapas em 1024 px). A geometria fica igual.

Uso: python3 scripts/otimizar-glb.py entrada.glb public/media/camera/saida.glb
Requer Pillow.
"""
import io, json, struct, sys
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
d = open(src, "rb").read()
off, chunks = 12, []
while off < len(d):
    length, kind = struct.unpack("<II", d[off:off + 8])
    chunks.append((kind, d[off + 8:off + 8 + length]))
    off += 8 + length
j = json.loads(chunks[0][1])
binary = chunks[1][1]

# qual imagem é a cor (baseColor) → mais resolução
color_imgs = set()
for m in j.get("materials", []):
    t = m.get("pbrMetallicRoughness", {}).get("baseColorTexture")
    if t is not None:
        color_imgs.add(j["textures"][t["index"]]["source"])
img_of_view = {im["bufferView"]: i for i, im in enumerate(j.get("images", [])) if "bufferView" in im}

parts, pos = [], 0
for k, view in enumerate(j["bufferViews"]):
    o = view.get("byteOffset", 0)
    data = binary[o:o + view["byteLength"]]
    if k in img_of_view:
        i = img_of_view[k]
        size, quality = (2048, 88) if i in color_imgs else (1024, 84)
        im = Image.open(io.BytesIO(data)).convert("RGB")
        if max(im.size) > size:
            im.thumbnail((size, size), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=quality, optimize=True)
        data = buf.getvalue()
        j["images"][i]["mimeType"] = "image/jpeg"
    pad = (-pos) % 4
    parts.append(b"\0" * pad)
    pos += pad
    view["byteOffset"] = pos
    view["byteLength"] = len(data)
    parts.append(data)
    pos += len(data)

new_bin = b"".join(parts)
new_bin += b"\0" * ((-len(new_bin)) % 4)
j["buffers"][0]["byteLength"] = len(new_bin)
js = json.dumps(j, separators=(",", ":")).encode()
js += b" " * ((-len(js)) % 4)
out = (
    struct.pack("<III", 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(new_bin))
    + struct.pack("<II", len(js), 0x4E4F534A) + js
    + struct.pack("<II", len(new_bin), 0x004E4942) + new_bin
)
open(dst, "wb").write(out)
print(f"{len(d) // 1024} KB -> {len(out) // 1024} KB  ({dst})")
