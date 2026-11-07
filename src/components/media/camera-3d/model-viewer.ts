/**
 * Visualizador 3D da câmera (three.js), carregado só quando precisa.
 *
 * - Giro livre em TODOS os eixos (TrackballControls: lados, cima/baixo, diagonais
 *   e roll), com inércia ao soltar. Sem zoom e sem arrastar de lugar.
 * - Parado, gira sozinho devagar.
 * - Fundo transparente de verdade (só o modelo aparece sobre o site).
 * - Luz de estúdio + contra-luz azul da marca.
 * Retorna `destroy` e `resetPose` (volta para a pose de frente, para abrir a câmera).
 */
export async function createModelViewer(
  canvas: HTMLCanvasElement,
  url: string,
  opts: { onReady?: () => void; reduceMotion?: boolean; pose?: { x: number; y: number; z: number } } = {},
) {
  const THREE = await import("three");
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const { TrackballControls } = await import("three/examples/jsm/controls/TrackballControls.js");
  const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.9;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  camera.position.set(0, 0, 3.05);

  // luzes: chave branca suave + contra-luz azul DAFA
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(2, 3, 4);
  const rim = new THREE.DirectionalLight(0x3a3dff, 3.2);
  rim.position.set(-4, 1.5, -3);
  const fill = new THREE.DirectionalLight(0x8f92ff, 0.6);
  fill.position.set(3, -2, 2);
  scene.add(key, rim, fill, new THREE.AmbientLight(0xffffff, 0.45));

  // pivô: o controle gira a câmera virtual; o giro automático gira o modelo
  const pivot = new THREE.Group();
  scene.add(pivot);

  const gltf = await new GLTFLoader().loadAsync(url);
  const model = gltf.scene;
  // centraliza e normaliza o tamanho
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  const scale = 2 / Math.max(size.x, size.y, size.z);
  model.scale.setScalar(scale);
  model.position.multiplyScalar(scale);
  // pose inicial (para casar com a pose de frente do vídeo de desmontagem)
  const orient = new THREE.Group();
  if (opts.pose) orient.rotation.set(opts.pose.x, opts.pose.y, opts.pose.z);
  orient.add(model);
  pivot.add(orient);

  const controls = new TrackballControls(camera, canvas);
  controls.rotateSpeed = 3;
  controls.noZoom = true;
  controls.noPan = true;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.08; // inércia
  const home = { pos: camera.position.clone(), up: camera.up.clone() };

  let lastInput = -Infinity;
  const onStart = () => (lastInput = performance.now());
  controls.addEventListener("start", onStart);
  controls.addEventListener("end", onStart);

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    controls.handleResize();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let raf = 0;
  let last = performance.now();
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    controls.update();
    // parado há 2,5 s: gira sozinho
    if (!opts.reduceMotion && now - lastInput > 2500) pivot.rotation.y += dt * 0.45;
    renderer.render(scene, camera);
  };

  const io = new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  });
  io.observe(canvas);
  renderer.render(scene, camera);
  opts.onReady?.();

  return {
    /** Volta suavemente para a pose de frente (usada antes de abrir a câmera). */
    resetPose(duration = 0.8): Promise<void> {
      return new Promise((resolve) => {
        const from = { pos: camera.position.clone(), up: camera.up.clone(), y: pivot.rotation.y };
        const targetY = Math.round(pivot.rotation.y / (Math.PI * 2)) * Math.PI * 2;
        const t0 = performance.now();
        lastInput = Infinity; // pausa o giro automático
        const step = () => {
          const k = Math.min((performance.now() - t0) / (duration * 1000), 1);
          const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          camera.position.lerpVectors(from.pos, home.pos, e).setLength(home.pos.length());
          camera.up.lerpVectors(from.up, home.up, e).normalize();
          camera.lookAt(0, 0, 0);
          pivot.rotation.y = from.y + (targetY - from.y) * e;
          if (k < 1) requestAnimationFrame(step);
          else {
            lastInput = performance.now();
            resolve();
          }
        };
        step();
      });
    },
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onStart);
      controls.dispose();
      pmrem.dispose();
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as import("three").Mesh;
        m.geometry?.dispose();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        mats.forEach((mat) => mat.dispose());
      });
    },
  };
}
