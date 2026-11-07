---
title: Build e deploy
slug: codebase-deploy
type: codebase
module: deploy
topic_type: flow
summary: Como rodar localmente, gerar o build estático e publicar no GitHub Pages pelo workflow.
triggers: [deploy.yml, GitHub Pages, PAGES_BASE_PATH, NEXT_PUBLIC_SITE_URL, npm run build]
related: [../arquitetura.md, seo.md]
rag: include
status: current
updated_at: 2026-11-07
verified_against:
  - .github/workflows/deploy.yml
  - next.config.ts
  - package.json
---

# Build e deploy

## Local

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # gera out/ (site estático)
```

Não rode `npm run build` com o `npm run dev` aberto: os dois usam `.next/`. Se a tela quebrar, pare o dev, apague `.next/` e suba de novo.

## GitHub Pages (`.github/workflows/deploy.yml`)

- Roda a cada push na `main` (ou manualmente).
- **build:**
  - `npm ci`, depois `npm run lint`, depois `npm run build`, com:
    - `PAGES_BASE_PATH=/<repo>`
    - `NEXT_PUBLIC_SITE_URL=https://<dono>.github.io/<repo>`
  - publica `out/` como artefato.
- **deploy:** `actions/deploy-pages@v4` com `timeout: 1800000` (30 min). O GitHub às vezes demora para liberar o site, e o padrão de 10 min falhava com "Timeout reached".
- Se o deploy falhar só por tempo, rode de novo: `gh run rerun <id> --failed`.

## Fluxo de trabalho

- Mudanças vão em **branch** e com **commits pequenos** (uma parte por commit).
- Só entra na `main` (e vai ao ar) com aprovação.
- Commits só em nome do autor do repositório.
