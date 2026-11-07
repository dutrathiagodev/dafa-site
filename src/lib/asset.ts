/**
 * Prefixa um arquivo de `public/` com o caminho base do site.
 * No GitHub Pages o site fica em /dafa-site; localmente o prefixo é vazio.
 * Use em todo `src` de vídeo, imagem e frame que aponte para /media.
 */
export const asset = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
