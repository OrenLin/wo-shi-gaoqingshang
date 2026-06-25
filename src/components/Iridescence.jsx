// Iridescence 虹彩背景 — 灵感/可爱主题
// 基于 OGL 实现，彩虹光泽流动效果，支持鼠标/触摸交互
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import './Iridescence.css';

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
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uMouseActive;

varying vec2 vUv;

// HSV to RGB
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
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
  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;

  float t = uTime * uSpeed * 0.3;

  // 鼠标影响
  vec2 mouseUV = uMouse;
  mouseUV.x *= uResolution.x / uResolution.y;
  float mouseDist = length(uv - mouseUV);
  vec2 mousePush = normalize(uv - mouseUV + 0.001) * (uMouseActive * 0.1 / (mouseDist + 0.3));
  uv += mousePush;

  // 流动的色相
  float n = noise(uv * 2.0 + t);
  n += noise(uv * 4.0 - t * 0.5) * 0.5;

  float hue = fract(uv.x * 0.3 + uv.y * 0.2 + t * 0.1 + n * uAmplitude);
  float sat = 0.7 + n * 0.3;
  float val = 0.6 + n * 0.4;

  vec3 col = hsv2rgb(vec3(hue, sat, val));

  // 波纹效果
  float ripple = sin(mouseDist * 20.0 - t * 5.0) * 0.5 + 0.5;
  col += vec3(ripple * 0.15 * uMouseActive);

  // 柔和的边缘
  float fade = smoothstep(1.2, 0.4, length((vUv - 0.5) * vec2(1.6, 1.0)));
  col *= 0.5 + fade * 0.5;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function Iridescence({
  speed = 1,
  amplitude = 0.1,
  mouseReact = true,
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

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1, 1] },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
        uMouse: { value: [0.5, 0.5] },
        uMouseActive: { value: 0 },
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

    // 鼠标/触摸交互
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

    if (mouseReact) {
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerleave', onPointerLeave);
      container.addEventListener('touchmove', onTouchMove, { passive: false });
      container.addEventListener('touchend', onTouchEnd);
      container.addEventListener('touchcancel', onTouchEnd);
    }

    let animateId;
    function update(t) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;

      // 平滑鼠标
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
      if (mouseReact) {
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('touchend', onTouchEnd);
        container.removeEventListener('touchcancel', onTouchEnd);
      }
      container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [speed, amplitude, mouseReact]);

  return <div ref={containerRef} className="iridescence-container" />;
}
