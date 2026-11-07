# Como atualizar o site da DAFA

Todo o texto, contato, serviço e projeto fica em **um arquivo só**:
`src/content/site.ts`. Não é preciso mexer nos componentes.

## Adicionar um projeto novo (vídeo)

1. Prepare o vídeo para a web (vertical 720×1280 ou horizontal 1280×720) e gere:
   - `public/media/videos/<nome>.mp4` — vídeo completo, com som;
   - `public/media/videos/<nome>-preview.mp4` — trecho de ~6 s, sem som, leve (≈ 200 KB);
   - `public/media/posters/<nome>.webp` — capa (um frame do vídeo).

   Com o ffmpeg instalado:

   ```bash
   ffmpeg -i original.mp4 -vf "scale=-2:1280" -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 96k -movflags +faststart public/media/videos/nome.mp4
   ffmpeg -ss 2 -t 6 -i original.mp4 -vf "scale=-2:640,fps=24" -an -c:v libx264 -crf 30 -movflags +faststart public/media/videos/nome-preview.mp4
   ffmpeg -ss 3 -i original.mp4 -frames:v 1 -vf "scale=-2:1280" -c:v libwebp -q:v 80 public/media/posters/nome.webp
   ```

2. Em `src/content/site.ts`, adicione um item na lista `projects`:

   ```ts
   {
     slug: "nome",
     client: "Nome do cliente",
     segment: "Segmento · Cidade – UF",
     services: ["Serviço que foi realmente entregue"],
     instagram: "perfil_do_cliente", // opcional
     format: "vertical",             // ou "horizontal"
     media: v("nome"),
   },
   ```

3. A ordem da lista é a ordem no site. Coloque os melhores trabalhos primeiro.

## Adicionar uma foto

Salve em `public/media/img/` (WebP, ~900 px de largura) e use
`media: { type: "image", src: "/media/img/arquivo.webp", width: 900, height: 1200 }`.

## Trocar textos e contatos

- WhatsApp, e-mail, Instagram e mensagem inicial: objeto `contact`.
- Frases da marca, título e descrição do Google: objeto `brand`.
- Serviços, etapas do processo e perguntas frequentes: `services`, `processSteps`, `faq`.

## Regras do briefing

- Não inventar resultados, depoimentos ou métricas.
- Ideias não executadas só entram identificadas como **conceito**.
- Não cortar vídeos verticais para caber em blocos horizontais.

## Publicar

Depois de contratar o domínio, defina a variável `NEXT_PUBLIC_SITE_URL`
(ex.: `https://www.seudominio.com.br`) na hospedagem. Ela é usada no SEO
(canonical, sitemap, imagem de compartilhamento e dados estruturados).
