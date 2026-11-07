/**
 * Giro de 360° controlado sem "buscar quadro a quadro" (o que trava):
 * o navegador sempre TOCA o vídeo, só muda a velocidade. Para girar ao contrário,
 * toca uma cópia invertida do vídeo a partir do mesmo ponto.
 *
 * - `auto = true`: gira sozinho na velocidade normal;
 * - `nudge(segundos)`: empurra o alvo (arraste/inércia); o vídeo acelera até lá;
 * - `goToStart(cb)`: volta para a pose da frente pelo caminho mais curto.
 * Chame `update()` a cada quadro.
 */
export class ReversibleLoop {
  auto = true;
  private target = 0;
  private dir: 1 | -1 = 1;
  private arrive: (() => void) | null = null;

  constructor(
    readonly fwd: HTMLVideoElement,
    readonly rev: HTMLVideoElement,
  ) {}

  get duration() {
    return this.fwd.duration || 1;
  }

  /** Vídeo que está na tela agora. */
  get element() {
    return this.dir === 1 ? this.fwd : this.rev;
  }

  /** Posição atual na linha da ida (0 → duração). */
  get time() {
    return this.dir === 1 ? this.fwd.currentTime : this.duration - this.rev.currentTime;
  }

  private shortest(from: number, to: number) {
    const d = this.duration;
    let e = (((to - from) % d) + d) % d;
    if (e > d / 2) e -= d;
    return e;
  }

  nudge(seconds: number) {
    if (this.auto) this.target = this.time;
    this.auto = false;
    this.target += seconds;
  }

  goToStart(onArrive: () => void) {
    this.auto = false;
    this.target = this.time + this.shortest(this.time, 0);
    this.arrive = onArrive;
  }

  pause() {
    this.fwd.pause();
    this.rev.pause();
  }

  private use(dir: 1 | -1) {
    if (dir === this.dir) return;
    const t = this.time;
    this.element.pause();
    this.dir = dir;
    this.element.currentTime = dir === 1 ? t : this.duration - t;
  }

  update() {
    if (this.auto) {
      this.use(1);
      this.fwd.playbackRate = 1;
      if (this.fwd.paused) this.fwd.play().catch(() => {});
      return;
    }
    const err = this.shortest(this.time, this.target);
    this.target = this.time + err; // não acumula voltas
    if (Math.abs(err) < 0.03) {
      this.pause();
      if (this.arrive) {
        const cb = this.arrive;
        this.arrive = null;
        cb();
      }
      return;
    }
    const rate = Math.min(Math.abs(err) * 3.2 + 0.15, 4);
    this.use(err > 0 ? 1 : -1);
    const v = this.element;
    if (Math.abs(v.playbackRate - rate) > 0.02) v.playbackRate = rate;
    if (v.paused && !v.seeking) v.play().catch(() => {});
  }
}
