// ColorBends 色彩弯曲背景 — 光线与时间主题
// 基于 OGL 实现，色彩流动弯曲效果
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import './ColorBends.css';

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
uniform float uRotation;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform float uMouseInfluence;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform float uParallax;
uniform float uNoise;
uniform float uIterations;
uniform float uIntensity;
uniform float uBandWidth;

varying vec2 vUv;

mat2 rotate2d(float a) {
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  vec2 uv = vUv - 0.5;
  float aspect = uResolution.x / uResolution.y;
  // contain模式:保证内容在任何屏幕比例下完整显示
  if (aspect > 1.0) {
    uv.y *= aspect;
  } else {
    uv.x /= aspect;
  }
  uv = rotate2d(uRotation * 0.0174533) * uv;
  uv *= uScale;

  float t = uTime * uSpeed;

  // 鼠标视差
  vec2 mouseOffset = (uMouse - 0.5) * uParallax * uMouseActive;
  uv += mouseOffset;

  // 多次迭代扭曲
  vec2 warpedUv = uv;
  for (float i = 0.0; i < 4.0; i++) {
    if (i >= uIterations) break;
    float fi = i + 1.0;
    warpedUv.x += sin(warpedUv.y * uFrequency * fi + t + i) * uWarpStrength * 0.1 / fi;
    warpedUv.y += cos(warpedUv.x * uFrequency * fi + t * 0.7 + i) * uWarpStrength * 0.1 / fi;
  }

  // 噪声
  float n = noise(warpedUv * 3.0 + t * 0.2) * uNoise;

  // 色彩条带
  float band = sin(warpedUv.y * uBandWidth + t * 0.5 + n * 2.0);
  band = smoothstep(0.0, 1.0, band * 0.5 + 0.5);

  // 三色混合
  vec3 col = mix(uColor1, uColor2, band);
  col = mix(col, uColor3, sin(warpedUv.x * uBandWidth * 0.7 + t * 0.3 + n) * 0.5 + 0.5);

  col *= uIntensity;

  // 鼠标光晕
  float mouseDist = length(uv - (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0));
  col += uColor2 * uMouseActive * smoothstep(0.4, 0.0, mouseDist) * 0.3;

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

export default function ColorBends({
  rotation = 90,
  speed = 0.2,
  colors = ['#5227FF', '#FF9FFC', '#7cff67'],
  scale = 1,
  frequency = 1,
  warpStrength = 1,
  mouseInfluence = 1.7,
  parallax = 0.6,
  noise = 0.15,
  iterations = 1,
  intensity = 1.5,
  bandWidth = 6,
}) {
  const containerRef = useRef(null);
  const mouseTargetRef = useRef([0.5, 0.5]);
  const mouseActiveRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: false, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const [c1, c2, c3] = colors.map(hexToRgb);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1, 1] },
        uRotation: { value: rotation },
        uSpeed: { value: speed },
        uColor1: { value: c1 },
        uColor2: { value: c2 },
        uColor3: { value: c3 },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uMouseInfluence: { value: mouseInfluence },
        uMouse: { value: [0.5, 0.5] },
        uMouseActive: { value: 0 },
        uParallax: { value: parallax },
        uNoise: { value: noise },
        uIterations: { value: iterations },
        uIntensity: { value: intensity },
        uBandWidth: { value: bandWidth },
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

    const smoothMouse = [0.5, 0.5];
    let smoothActive = 0;

    function onPointerMove(e) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseTargetRef.current = [x, y];
      mouseActiveRef.current = 1;
    }
    function onPointerLeave() {
      mouseActiveRef.current = 0;
    }
    function onTouchMove(e) {
      if (e.touches.length === 0) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = 1.0 - (touch.clientY - rect.top) / rect.height;
      mouseTargetRef.current = [x, y];
      mouseActiveRef.current = 1;
    }
    function onTouchEnd() {
      mouseActiveRef.current = 0;
    }

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);

    let animateId;
    function update(t) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;

      const lerp = 0.08;
      smoothMouse[0] += (mouseTargetRef.current[0] - smoothMouse[0]) * lerp;
      smoothMouse[1] += (mouseTargetRef.current[1] - smoothMouse[1]) * lerp;
      smoothActive += (mouseActiveRef.current - smoothActive) * lerp;
      program.uniforms.uMouse.value = smoothMouse;
      program.uniforms.uMouseActive.value = smoothActive;

      renderer.render({ scene: mesh });
    }
    animateId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
      container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [rotation, speed, colors.join(','), scale, frequency, warpStrength, mouseInfluence, parallax, noise, iterations, intensity, bandWidth]);

  return <div ref={containerRef} className="colorbends-container" />;
}
