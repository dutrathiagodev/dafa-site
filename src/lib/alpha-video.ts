/**
 * Vídeo com transparência que funciona em qualquer navegador.
 *
 * O MP4 é "empilhado": a metade de cima é a imagem (já sobre fundo preto) e a de
 * baixo é a máscara do recorte por IA (branco = objeto). Este renderer WebGL junta
 * as duas num <canvas> transparente, quadro a quadro — sem quadrado preto em volta
 * e com o objeto 100% sólido.
 *
 * `createAlphaRenderer(canvas)` retorna `draw(video)` (true quando desenhou)
 * ou null se o navegador não tiver WebGL.
 */
const VERT = `attribute vec2 p;varying vec2 uv;
void main(){uv=vec2((p.x+1.)*.5,(1.-p.y)*.5);gl_Position=vec4(p,0.,1.);}`;
// cor já pré-multiplicada (sobre preto) em cima; máscara embaixo
const FRAG = `precision mediump float;varying vec2 uv;uniform sampler2D t;
void main(){vec3 c=texture2D(t,vec2(uv.x,uv.y*.5)).rgb;float a=texture2D(t,vec2(uv.x,.5+uv.y*.5)).r;
gl_FragColor=vec4(min(c,vec3(a)),a);}`;

export function createAlphaRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.clearColor(0, 0, 0, 0);

  return (video: HTMLVideoElement) => {
    if (video.readyState < 2 || !video.videoWidth) return false;
    const w = video.videoWidth;
    const h = video.videoHeight / 2;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return true;
  };
}

/**
 * Desenha continuamente, num canvas, o vídeo que `pick()` indicar — só enquanto
 * o canvas está na tela. Retorna `stop`.
 */
export function runAlphaCanvas(canvas: HTMLCanvasElement, pick: () => HTMLVideoElement | null, onFirst?: () => void) {
  const draw = createAlphaRenderer(canvas);
  if (!draw) return null;
  let raf = 0;
  let first = true;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const v = pick();
    if (v && draw(v) && first) {
      first = false;
      onFirst?.();
    }
  };
  const io = new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) raf = requestAnimationFrame(loop);
  });
  io.observe(canvas);
  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
  };
}
