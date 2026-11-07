import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "DAFA — Gerenciamento de Conteúdo. Produção audiovisual em Santo Antônio da Platina – PR.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento (WhatsApp, Instagram, Google). */
export default async function OpengraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public/media/img/logo-dafa-crop.png"),
  );
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 90% at 20% 110%, #1010ec 0%, #030326 45%, #07080c 75%)",
          color: "#f4f4f8",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 1400,
            height: 1400,
            left: -300,
            top: 330,
            borderRadius: 9999,
            borderTop: "3px solid rgba(150,155,255,.9)",
            boxShadow: "0 -20px 60px -10px rgba(51,51,255,.9)",
            display: "flex",
          }}
        />
        <img src={src} width={760} height={186} alt="" />
        <div
          style={{
            marginTop: 40,
            fontSize: 34,
            color: "#b9bbd0",
            display: "flex",
          }}
        >
          Produção audiovisual · Conteúdo · Tráfego pago
        </div>
        <div
          style={{ marginTop: 14, fontSize: 26, color: "#8f92ff", display: "flex" }}
        >
          Santo Antônio da Platina – PR e região
        </div>
      </div>
    ),
    size,
  );
}
