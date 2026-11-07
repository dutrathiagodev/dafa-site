/**
 * Mídias e tempos da câmera 3D do hero (vídeos reais, sem recorte: a câmera é 100% sólida).
 */
export const CAMERA_MEDIA = {
  /** Volta de 360° (o último quadro encosta no primeiro). */
  spin: "/media/camera/zve10-giro.mp4",
  /** O mesmo giro de trás para frente: permite girar para o outro lado sem travar. */
  spinReverse: "/media/camera/zve10-giro-volta.mp4",
  /** Ida (abre), espera e volta (monta) no mesmo arquivo. */
  explode: "/media/camera/zve10-desmonta.mp4",
  /** 1º quadro: aparece na hora e é a versão parada (movimento reduzido). */
  poster: "/media/camera/zve10-frente.webp",
};

export const CAMERA_TIMING = {
  /** No `explode`: instante em que a câmera está toda aberta (fim da ida). */
  openAt: 4.8,
  /** No `explode`: começo da volta (depois da espera). */
  closeFrom: 5.64,
  /** Abre sozinha a cada N voltas. */
  spinsBeforeOpen: 2,
  /** Aberta sozinha, fica assim por este tempo (s) antes de montar de novo. */
  holdOpen: 3.5,
  /** Arrastar a largura inteira do componente ≈ esta fração de uma volta. */
  dragTurns: 0.9,
  /** Inclinação máxima para cima/baixo (graus). */
  maxPitch: 16,
  /** Giro lateral (graus) quando aberta. */
  maxOpenYaw: 28,
};
