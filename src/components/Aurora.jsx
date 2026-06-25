// Aurora 极光背景 — 追求大自然/户外主题
// 基于 OGL 实现，与项目其他背景组件保持一致
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import './Aurora.css';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uAmplitude;
uniform float uBlend;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

varying vec2 vUv;

// Simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  // contain模式:保证内容完整显示不变形
  if (aspect > 1.0) {
    uv.x = (uv.x - 0.5) * aspect + 0.5;
  } else {
    uv.y = (uv.y - 0.5) / aspect + 0.5;
  }

  float t = uTime * 0.2;

  // 多层噪声叠加，形成流动极光
  float n1 = snoise(vec2(uv.x * 1.5 + t, uv.y * 2.0 - t * 0.5));
  float n2 = snoise(vec2(uv.x * 2.0 - t * 0.3, uv.y * 3.0 + t * 0.7));
  float n = (n1 + n2 * 0.5) * uAmplitude;

  // 极光带：在垂直方向上渐变
  float band = smoothstep(0.2, 0.8, uv.y + n * 0.3);
  float band2 = smoothstep(0.1, 0.9, uv.y * 1.2 + n * 0.5);

  // 颜色混合
  vec3 col = mix(uColor1, uColor2, band);
  col = mix(col, uColor3, band2 * uBlend);

  // 顶部和底部渐隐
  float fade = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.6, uv.y);
  col *= fade * 1.2;

  // 一点点星点
  float stars = step(0.998, fract(sin(dot(uv * 200.0, vec2(12.9898, 78.233))) * 43758.5453));
  col += stars * 0.3 * fade;

  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

export default function Aurora({
  colorStops = ['#5227FF', '#7cff67', '#5227FF'],
  amplitude = 1,
  blend = 0.5,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: false, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const [c1, c2, c3] = colorStops.map(hexToRgb);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1, 1] },
        uAmplitude: { value: amplitude },
        uBlend: { value: blend },
        uColor1: { value: c1 },
        uColor2: { value: c2 },
        uColor3: { value: c3 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height, width / height];
    }
    window.addEventListener('resize', resize);
    resize();

    let animateId;
    function update(t) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }
    animateId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [colorStops.join(','), amplitude, blend]);

  return <div ref={containerRef} className="aurora-container" />;
}
