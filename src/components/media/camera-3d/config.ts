/**
 * Mídias e tempos da câmera do hero.
 *  - Fechada: modelo 3D real (GLB), gira livre em todos os eixos (model-viewer.ts).
 *  - Abrir/montar: vídeo da vista explodida recortado por IA, com fundo transparente
 *    (vídeo "empilhado": cor em cima, máscara embaixo — src/lib/alpha-video.ts).
 */
export const CAMERA_MEDIA = {
  /** Modelo 3D da Sony ZV-E10 + Sigma 16mm (gerado no Meshy a partir da foto real; licença CC BY 4.0). */
  model: "/media/camera/zve10.glb",
  /** Ida (abre), espera e volta (monta) no mesmo arquivo. */
  explode: "/media/camera/zve10-desmonta.mp4",
  /** 1º quadro recortado: aparece na hora e é a versão parada (movimento reduzido / sem WebGL). */
  poster: "/media/camera/zve10-frente.webp",
};

export const CAMERA_TIMING = {
  /** No `explode`: instante em que a câmera está toda aberta (fim da ida). */
  openAt: 4.8,
  /** No `explode`: começo da volta (depois da espera). */
  closeFrom: 5.64,
  /** Abre sozinha depois deste tempo (s) sem ninguém mexer. */
  autoOpenEvery: 14,
  /** Aberta sozinha, fica assim por este tempo (s) antes de montar de novo. */
  holdOpen: 4,
  /** Inclinação máxima (graus) ao arrastar a câmera aberta. */
  maxTilt: 24,
};

/** Rotação inicial do modelo (radianos) para casar com a pose de frente do vídeo. */
export const MODEL_POSE = { x: 0.12, y: -0.55, z: 0 };
