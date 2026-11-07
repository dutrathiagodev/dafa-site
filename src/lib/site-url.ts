/**
 * URL pública do site. Defina NEXT_PUBLIC_SITE_URL quando o domínio da DAFA
 * estiver contratado (ex.: https://www.dafa.com.br). Sem ela, usa o localhost.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
