"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "gsap";
import { asset } from "@/lib/asset";

/**
 * Câmera DAFA em 3D, feita em código (sem modelo externo).
 * - Arrastar gira a câmera; parada, ela gira devagar sozinha.
 * - Tocar/clicar (ou o botão) desmonta em peças e monta de novo (vista explodida).
 * - Só renderiza enquanto está na tela. Movimento reduzido: montada e parada.
 */

type Part = {
  obj: THREE.Object3D;
  base: THREE.Vector3;
  off: THREE.Vector3;
  rot: THREE.Euler;
};

export default function Camera3D({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<() => void>(() => {});
  const [exploded, setExploded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    /* ---------------------------------------------------------- renderer */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const canvas = renderer.domElement;
    canvas.style.cssText =
      "width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab";
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Câmera fotográfica com a marca DAFA em 3D. Arraste para girar e toque para ver as peças.",
    );
    el.prepend(canvas);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    /* ------------------------------------------------------------ lights */
    scene.add(new THREE.AmbientLight(0x8080ff, 0.25));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 8);
    scene.add(key);
    const rimL = new THREE.PointLight(0x3333ff, 60, 30);
    rimL.position.set(-6, 2, -4);
    scene.add(rimL);
    const rimR = new THREE.PointLight(0x1010ec, 45, 30);
    rimR.position.set(6, -1, -3);
    scene.add(rimR);
    const front = new THREE.PointLight(0x9a9cff, 12, 20);
    front.position.set(0, 1, 7);
    scene.add(front);

    /* --------------------------------------------------------- materials */
    const mBody = new THREE.MeshStandardMaterial({ color: 0x17181f, roughness: 0.6, metalness: 0.25 });
    const mRubber = new THREE.MeshStandardMaterial({ color: 0x0c0d11, roughness: 0.92, metalness: 0.05 });
    const mMetal = new THREE.MeshStandardMaterial({ color: 0xa4a6bb, roughness: 0.25, metalness: 1 });
    const mDark = new THREE.MeshStandardMaterial({ color: 0x2a2b36, roughness: 0.35, metalness: 0.9 });
    const mBlue = new THREE.MeshStandardMaterial({ color: 0x3333ff, emissive: 0x2020ff, emissiveIntensity: 1.8, roughness: 0.4 });
    const mGlass = new THREE.MeshPhysicalMaterial({
      color: 0x0b0b30,
      roughness: 0.04,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      iridescence: 0.7,
      iridescenceIOR: 1.6,
      envMapIntensity: 2.4,
    });
    const mScreen = new THREE.MeshStandardMaterial({ color: 0x05050f, emissive: 0x15157a, emissiveIntensity: 0.9, roughness: 0.2 });
    const mSensor = new THREE.MeshStandardMaterial({ color: 0x1a1a6e, emissive: 0x2a2aff, emissiveIntensity: 0.6, metalness: 0.7, roughness: 0.15 });
    const mPcb = new THREE.MeshStandardMaterial({ color: 0x0b1240, roughness: 0.55, metalness: 0.35 });

    /* ------------------------------------------------------------- model */
    const rig = new THREE.Group();
    const model = new THREE.Group();
    model.position.z = -1.1;
    rig.add(model);
    scene.add(rig);

    const parts: Part[] = [];
    const add = (
      obj: THREE.Object3D,
      pos: [number, number, number],
      off: [number, number, number] = [0, 0, 0],
      rot: [number, number, number] = [0, 0, 0],
    ) => {
      obj.position.set(...pos);
      model.add(obj);
      parts.push({
        obj,
        base: obj.position.clone(),
        off: new THREE.Vector3(...off),
        rot: new THREE.Euler(...rot),
      });
      return obj;
    };
    const rbox = (w: number, h: number, d: number, r: number, m: THREE.Material) =>
      new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), m);
    /** Cilindro ao longo do eixo da lente (Z). */
    const lensCyl = (r: number, h: number, m: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 72), m);
      mesh.rotation.x = Math.PI / 2;
      return mesh;
    };
    /** Anel com frisos (foco/zoom) usando instâncias. */
    const ribs = (r: number, len: number, count: number) => {
      const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.045, len), mRubber, count);
      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), a);
        m.compose(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0), q, new THREE.Vector3(1, 1, 1));
        im.setMatrixAt(i, m);
      }
      return im;
    };

    // Corpo
    const body = add(rbox(3.3, 2.1, 1.1, 0.16, mBody), [0, 0, 0]);
    // Etiqueta com a logo DAFA na frente do corpo
    const logoTex = new THREE.TextureLoader().load(asset("/media/img/logo-dafa-crop.png"));
    logoTex.colorSpace = THREE.SRGBColorSpace;
    logoTex.anisotropy = 8;
    const logo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.95, 0.233),
      new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, toneMapped: false }),
    );
    logo.position.set(-0.95, 0.72, 0.556);
    body.add(logo);

    add(rbox(1.15, 0.6, 0.95, 0.1, mBody), [0, 1.2, -0.05], [0, 0.9, 0], [0, 0, 0.15]); // visor
    add(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.5), mDark), [0, 1.53, -0.05], [0, 1.6, 0]); // sapata
    add(rbox(0.85, 0.55, 0.35, 0.12, mRubber), [0, 1.2, -0.62], [0, 0.7, -1.1]); // ocular
    add(rbox(0.8, 2.0, 0.7, 0.28, mRubber), [1.3, -0.03, 0.55], [1.5, 0, 0.4], [0, 0.35, 0]); // empunhadura

    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 48), mMetal);
    const dialCap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 48), mDark);
    dialCap.position.y = 0.12;
    dial.add(dialCap);
    add(dial, [-1.05, 1.15, 0], [-0.5, 1.4, 0], [0, 1.6, 0]); // seletor de modo

    const shutter = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.12, 40), mMetal);
    const shutterRing = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.025, 12, 48), mBlue);
    shutterRing.rotation.x = Math.PI / 2;
    shutterRing.position.y = -0.02;
    shutter.add(shutterRing);
    add(shutter, [1.25, 1.1, 0.5], [0.6, 1.5, 0.3]); // disparador
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 40), mDark), [1.05, 1.06, -0.2], [1, 1.1, -0.3]);

    add(rbox(2.2, 1.4, 0.08, 0.03, mScreen), [-0.25, -0.1, -0.6], [0, -0.2, -1.7], [0.25, 0, 0]); // tela

    // Placa e sensor (aparecem quando desmonta)
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.6, 0.05), mPcb);
    [[-0.8, 0.3, 0.5, 0.35], [0.5, -0.35, 0.7, 0.4], [0.9, 0.45, 0.35, 0.3], [-0.3, -0.5, 0.3, 0.25]].forEach(([x, y, w, h]) => {
      const chip = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.08), mDark);
      chip.position.set(x, y, -0.05);
      pcb.add(chip);
    });
    add(pcb, [0, 0, -0.25], [0, 0, -1.05], [0, 0, -0.08]);
    const sensor = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 0.06), mSensor);
    const sensorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.02, 0.04), mDark);
    sensorFrame.position.z = -0.05;
    sensor.add(sensorFrame);
    add(sensor, [0, 0, 0.3], [0, 0, 0.6]);

    // Lente: peças ao longo do eixo Z
    add(lensCyl(0.86, 0.12, mMetal), [0, 0, 0.62], [0, 0, 0.75]); // baioneta
    add(lensCyl(0.8, 0.45, mBody), [0, 0, 0.9], [0, 0, 1.15]);
    const zoom = new THREE.Group();
    zoom.add(lensCyl(0.8, 0.55, mRubber), ribs(0.82, 0.5, 56));
    add(zoom, [0, 0, 1.4], [0, 0, 1.55], [0, 0, 0.6]);
    add(lensCyl(0.78, 0.35, mBody), [0, 0, 1.85], [0, 0, 1.95]);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.79, 0.03, 16, 96), mBlue), [0, 0, 2.05], [0, 0, 2.25]); // anel azul DAFA
    const focus = new THREE.Group();
    focus.add(lensCyl(0.77, 0.3, mRubber), ribs(0.79, 0.26, 52));
    add(focus, [0, 0, 2.25], [0, 0, 2.55], [0, 0, -0.5]);
    const frontRing = new THREE.Group();
    const frontInner = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.03, 12, 72), mDark);
    frontInner.position.z = 0.1;
    frontRing.add(lensCyl(0.74, 0.2, mBody), frontInner);
    add(frontRing, [0, 0, 2.5], [0, 0, 2.95]);
    add(lensCyl(0.5, 0.05, mGlass), [0, 0, 2.1], [0, 0, 2.75]); // elemento interno
    const glass = new THREE.Mesh(new THREE.SphereGeometry(0.64, 64, 24, 0, Math.PI * 2, 0, 0.6), mGlass);
    glass.rotation.x = Math.PI / 2;
    glass.scale.set(1, 0.5, 1);
    add(glass, [0, 0, 2.42], [0, 0, 3.4]);

    // Sombra suave no "chão"
    const sh = document.createElement("canvas");
    sh.width = sh.height = 128;
    const g = sh.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(16,16,236,0.55)");
    grad.addColorStop(1, "rgba(16,16,236,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(sh);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 3.2),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.9;
    scene.add(shadow);

    /* --------------------------------------------------------- explosão */
    const state = { p: reduce ? 0 : 1 };
    const applyExplode = () => {
      const e = state.p;
      for (const part of parts) {
        part.obj.position.set(
          part.base.x + part.off.x * e,
          part.base.y + part.off.y * e,
          part.base.z + part.off.z * e,
        );
        part.obj.rotation.set(part.rot.x * e, part.rot.y * e, part.rot.z * e);
      }
      shadow.scale.setScalar(1 + e * 0.35);
    };
    applyExplode();

    let target = 0;
    const setExplode = (v: 0 | 1) => {
      target = v;
      setExploded(v === 1);
      gsap.to(state, {
        p: v,
        duration: reduce ? 0 : 1.5,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate: applyExplode,
      });
    };
    toggleRef.current = () => setExplode(target === 1 ? 0 : 1);

    /* ------------------------------------------------------- interação */
    const rotTarget = { yaw: -0.65, pitch: 0.18 };
    const rotNow = { yaw: -0.65, pitch: 0.18 };
    const hover = { x: 0, y: 0 };
    let dragging = false;
    let lastInteract = 0;
    let downAt = { x: 0, y: 0, t: 0 };
    let last = { x: 0, y: 0 };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      downAt = { x: e.clientX, y: e.clientY, t: performance.now() };
      last = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      hover.x = ((e.clientX - r.left) / r.width - 0.5) * 0.3;
      hover.y = ((e.clientY - r.top) / r.height - 0.5) * 0.2;
      if (!dragging) return;
      rotTarget.yaw += (e.clientX - last.x) * 0.009;
      rotTarget.pitch = THREE.MathUtils.clamp(rotTarget.pitch + (e.clientY - last.y) * 0.005, -0.45, 0.7);
      last = { x: e.clientX, y: e.clientY };
      lastInteract = performance.now();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = "grab";
      const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
      if (moved < 6 && performance.now() - downAt.t < 350) toggleRef.current();
      lastInteract = performance.now();
    };
    const onLeave = () => {
      hover.x = 0;
      hover.y = 0;
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    /* ----------------------------------------------------------- resize */
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      // Afasta a câmera em telas estreitas para a vista explodida caber
      const dist = Math.max(10.5, 3.9 / (Math.tan(THREE.MathUtils.degToRad(15)) * cam.aspect));
      cam.position.set(0, 1.2, dist);
      cam.lookAt(0, 0.1, 0);
      cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    /* ------------------------------------------------------------- loop */
    const clock = new THREE.Clock();
    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      if (!reduce && !dragging && performance.now() - lastInteract > 2500) {
        rotTarget.yaw += dt * 0.22; // giro lento quando ninguém mexe
      }
      const k = Math.min(1, dt * 6);
      rotNow.yaw += (rotTarget.yaw - rotNow.yaw) * k;
      rotNow.pitch += (rotTarget.pitch - rotNow.pitch) * k;
      rig.rotation.set(rotNow.pitch + hover.y, rotNow.yaw + hover.x, 0);
      rig.position.y = reduce ? 0 : Math.sin(t * 1.1) * 0.07;
      renderer.render(scene, cam);
    };

    let introDone = reduce;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clock.getDelta();
          renderer.setAnimationLoop(frame);
          if (!introDone) {
            introDone = true;
            // Começa desmontada e se monta na frente do visitante
            gsap.to(state, {
              p: 0,
              duration: 2.2,
              delay: 0.5,
              ease: "power3.inOut",
              onUpdate: applyExplode,
            });
          }
        } else {
          renderer.setAnimationLoop(null);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    renderer.render(scene, cam);
    setReady(true);

    return () => {
      io.disconnect();
      ro.disconnect();
      renderer.setAnimationLoop(null);
      gsap.killTweensOf(state);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((m) => m.dispose());
      });
      logoTex.dispose();
      shadowTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-2 flex flex-col items-center gap-3 transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => toggleRef.current()}
          aria-pressed={exploded}
          className="pointer-events-auto rounded-full border border-white/15 bg-white/[.04] px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:border-electric hover:bg-electric/20"
        >
          {exploded ? "Montar a câmera" : "Ver por dentro"}
        </button>
        <p className="text-xs text-muted/70">Arraste para girar</p>
      </div>
    </div>
  );
}
