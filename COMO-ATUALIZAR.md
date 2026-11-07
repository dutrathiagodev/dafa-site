# Como atualizar o site da DAFA

Todo o texto, contato, serviço e projeto fica em **um arquivo só**:
`src/content/site.ts`. Não é preciso mexer nos componentes.

## Adicionar um projeto novo (vídeo)

1. Gere os arquivos do vídeo com o script (precisa do `ffmpeg` instalado):

   ```bash
   ./scripts/preparar-video.sh caminho/original.mp4 nome 2
   ```

   O último número é o segundo onde começa a prévia. O script cria, já em alta qualidade:
   - `public/media/videos/<nome>.mp4`: vídeo completo, com som (lado maior 1280 px);
   - `public/media/videos/<nome>-preview.mp4`: 8 s sem som, que toca no portfólio;
   - `public/media/posters/<nome>.webp`: capa (lado maior 1920 px).

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

Salve em `public/media/img/` (WebP com qualidade 90, pelo menos 900 px de largura) e use
`media: { type: "image", src: "/media/img/arquivo.webp", width: 900, height: 1200 }`.

## Trocar a foto da equipe

1. Salve a foto em `public/media/team/` (ex.: `daniel.webp`, quadrada ou vertical, 640 px ou mais).
2. Em `src/content/site.ts`, na lista `team`, preencha `photo: "/media/team/daniel.webp"`.

O cartão mostra a foto em 4:5. Sem `photo`, aparece a inicial do nome.

## Foto de produto com fundo recortado (câmera, cartão SD)

A foto precisa ter **fundo preto puro, sem brilho em volta** (o brilho azul é feito no site). Depois rode:

```bash
python3 scripts/recortar-fundo.py original.jpg public/media/camera/arquivo.webp 1400
```

O objeto fica 100% opaco, com as cores originais, e só o fundo some. Confira o resultado sobre um fundo colorido antes de publicar.

## Trocar textos e contatos

- WhatsApp, e-mail, Instagram e mensagem inicial: objeto `contact`.
- Frases da marca, título e descrição do Google: objeto `brand`.
- Serviços, etapas do processo e perguntas frequentes: `services`, `processSteps`, `faq`.

## Regras do briefing

- Não inventar resultados, depoimentos ou métricas.
- Ideias não executadas só entram identificadas como **conceito**.
- Não cortar vídeos verticais para caber em blocos horizontais.
- Qualidade de imagem é prioridade: não reduzir cor nem deixar foto de produto transparente.

## Publicar

Trabalhe numa branch. Ao entrar na `main`, o GitHub publica sozinho no GitHub Pages
(veja `docs/codebase/deploy.md`).

Depois de contratar o domínio, defina a variável `NEXT_PUBLIC_SITE_URL`
(ex.: `https://www.seudominio.com.br`) na hospedagem. Ela é usada no SEO
(canonical, sitemap, imagem de compartilhamento e dados estruturados).
