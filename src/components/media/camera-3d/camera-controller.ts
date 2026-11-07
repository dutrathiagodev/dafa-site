import { gsap } from "@/lib/gsap";
import { CAMERA_TIMING as T } from "./config";
import { ReversibleLoop } from "./reversible-loop";

type Mode = "spin" | "opening" | "open" | "closing";

type Options = {
  root: HTMLElement;
  /** Elemento que inclina (cima/baixo, mouse e giro lateral quando aberta). */
  stage: HTMLElement;
  spin: HTMLVideoElement;
  spinReverse: HTMLVideoElement;
  explode: HTMLVideoElement;
  /** Chamado quando o giro já pode aparecer (tira a foto de espera). */
  onReady: () => void;
};

/**
 * Máquina de estados da câmera 3D:
 *  spin → (clique / a cada N voltas) → opening → open → (clique / tempo) → closing → spin
 *
 * - Arrastar na horizontal gira (vídeo de 360°, para os dois lados); na vertical inclina.
 * - Soltar com velocidade continua girando (inércia) e depois volta a girar sozinha.
 * - Aberta: arrastar gira a vista explodida para os lados e para cima/baixo.
 * O vídeo que aparece é o único visível (`data-on`); os outros ficam escondidos.
 */
export function createCameraController(o: Options) {
  const loop = new ReversibleLoop(o.spin, o.spinReverse);
  const explode = o.explode;
  const videos = [o.spin, o.spinReverse, explode];

  let mode: Mode = "spin";
  let ready = false;
  let raf = 0;
  let loops = 0;
  let autoOpened = false;
  let openedAt = 0;
  let lastInput = 0;
  let shown: HTMLVideoElement | null = null;

  const tilt = { pitch: 0, yaw: 0, hoverX: 0, hoverY: 0, x: 0, y: 0 };

  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let lastY = 0;
  let vx = 0;
  let inertia = 0;

  const show = (v: HTMLVideoElement) => {
    if (shown === v || v.readyState < 2 || v.seeking) return;
    videos.forEach((el) => el.toggleAttribute("data-on", el === v));
    shown = v;
  };

  // ---------- abrir / montar ----------
  const open = (auto = false) => {
    if (mode !== "spin" || explode.readyState < 2) return;
    autoOpened = auto;
    inertia = 0;
    loop.goToStart(() => {
      mode = "opening";
      explode.currentTime = 0;
      explode.play().catch(() => {});
    });
  };

  const close = () => {
    if (mode !== "open") return;
    autoOpened = false;
    gsap.to(tilt, { yaw: 0, pitch: 0, duration: 0.5, ease: "power2.inOut", overwrite: true });
    mode = "closing";
    explode.currentTime = T.closeFrom;
    explode.play().catch(() => {});
  };

  const toggle = () => (mode === "spin" ? open() : mode === "open" ? close() : undefined);

  const onSpinEnded = () => {
    o.spin.currentTime = 0;
    if (!loop.auto) return;
    loops += 1;
    if (loops % T.spinsBeforeOpen === 0) open(true);
    else o.spin.play().catch(() => {});
  };
  const onExplodeEnded = () => {
    mode = "spin";
    o.spin.currentTime = 0;
    loop.auto = true;
  };
  o.spin.addEventListener("ended", onSpinEnded);
  explode.addEventListener("ended", onExplodeEnded);

  // ---------- quadro a quadro ----------
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const now = performance.now();

    if (mode === "spin") {
      if (!dragging && Math.abs(inertia) > 0.2) {
        applyYaw(inertia);
        inertia *= 0.92;
        if (Math.abs(inertia) <= 0.2) {
          inertia = 0;
          loop.auto = true;
        }
      }
      loop.update();
      show(loop.element);
    } else {
      show(explode);
    }

    if (mode === "opening" && explode.currentTime >= T.openAt) {
      explode.pause();
      mode = "open";
      openedAt = now;
    }
    if (mode === "open" && autoOpened && now - openedAt > T.holdOpen * 1000 && now - lastInput > 2500) {
      close();
    }

    // inclinação suave
    tilt.x += (tilt.pitch + tilt.hoverX - tilt.x) * 0.1;
    tilt.y += (tilt.yaw + tilt.hoverY - tilt.y) * 0.1;
    gsap.set(o.stage, { rotationX: tilt.x, rotationY: tilt.y });

    if (!ready && shown) {
      ready = true;
      o.onReady();
    }
  };

  // ---------- arraste e mouse ----------
  const applyYaw = (dx: number) => {
    if (mode === "spin") {
      const w = o.root.clientWidth || 1;
      loop.nudge((-dx / w) * loop.duration * T.dragTurns);
    } else if (mode === "open") {
      tilt.yaw = gsap.utils.clamp(-T.maxOpenYaw, T.maxOpenYaw, tilt.yaw + dx * 0.3);
    }
  };

  const onDown = (e: PointerEvent) => {
    dragging = true;
    moved = 0;
    vx = 0;
    inertia = 0;
    lastX = e.clientX;
    lastY = e.clientY;
    lastInput = performance.now();
    gsap.killTweensOf(tilt);
    o.root.setPointerCapture?.(e.pointerId);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && !dragging) {
      const r = o.root.getBoundingClientRect();
      tilt.hoverY = ((e.clientX - r.left) / r.width - 0.5) * 10;
      tilt.hoverX = -((e.clientY - r.top) / r.height - 0.5) * 7;
    }
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    vx = vx * 0.6 + dx * 0.4;
    lastInput = performance.now();
    applyYaw(dx);
    // cima/baixo (no toque, o vertical fica para rolar a página)
    if (e.pointerType !== "touch") {
      tilt.pitch = gsap.utils.clamp(-T.maxPitch, T.maxPitch, tilt.pitch - dy * 0.25);
    }
  };

  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    if (moved < 6) {
      toggle();
      return;
    }
    if (mode === "spin") {
      inertia = Math.abs(vx) > 1 ? vx : 0;
      if (!inertia) loop.auto = true;
    }
    gsap.to(tilt, { pitch: 0, duration: 1.6, delay: 1, ease: "power2.inOut" });
  };

  const onLeave = () => {
    tilt.hoverX = 0;
    tilt.hoverY = 0;
  };

  o.root.addEventListener("pointerdown", onDown);
  o.root.addEventListener("pointermove", onMove);
  o.root.addEventListener("pointerup", onUp);
  o.root.addEventListener("pointercancel", onUp);
  o.root.addEventListener("pointerleave", onLeave);

  // ---------- só roda na tela ----------
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      if (!raf) frame();
      if (mode === "opening" || mode === "closing") explode.play().catch(() => {});
    } else {
      cancelAnimationFrame(raf);
      raf = 0;
      loop.pause();
      explode.pause();
    }
  });
  io.observe(o.root);

  return {
    toggle,
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      gsap.killTweensOf(tilt);
      o.spin.removeEventListener("ended", onSpinEnded);
      explode.removeEventListener("ended", onExplodeEnded);
      o.root.removeEventListener("pointerdown", onDown);
      o.root.removeEventListener("pointermove", onMove);
      o.root.removeEventListener("pointerup", onUp);
      o.root.removeEventListener("pointercancel", onUp);
      o.root.removeEventListener("pointerleave", onLeave);
    },
  };
}
