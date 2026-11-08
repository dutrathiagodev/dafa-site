/**
 * Mídias e tempos da câmera do hero (Sony ZV-E10 + Sigma 16mm f/1.4).
 * Tudo é foto/vídeo REAL da câmera, recortado por IA com fundo transparente
 * (vídeo "empilhado": cor em cima, máscara embaixo — src/lib/alpha-video.ts).
 */
export const CAMERA_MEDIA = {
  /** Ida (abre), espera e volta (monta) no mesmo arquivo. */
  explode: "/media/camera/zve10-desmonta.mp4",
  /** 1º quadro recortado: aparece na hora e é a versão parada (movimento reduzido). */
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
  /** Inclinação máxima (graus) ao arrastar. */
  maxTilt: 22,
  /** Inclinação máxima (graus) só passando o mouse. */
  hoverTilt: 9,
};
