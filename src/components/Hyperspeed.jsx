// Hyperspeed 超速背景 — 时间主题
// 基于 OGL 实现，超光速隧道穿梭效果
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import './Hyperspeed.css';

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
uniform vec2 uMouse;
uniform float uSpeed;

varying vec2 vUv;

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

  float t = uTime * uSpeed;

  // 极坐标
  float r = length(uv);
  float a = atan(uv.y, uv.x);

  // 隧道效果
  float tunnel = 0.5 / r;
  vec2 tunnelUv = vec2(a / 3.14159, tunnel + t);

  // 星光条纹
  float stripes = 0.0;
  for (float i = 0.0; i < 5.0; i++) {
    float fi = i + 1.0;
    vec2 suv = tunnelUv * fi * 2.0;
    float s = noise(floor(suv) + i);
    s = step(0.92, s);
    // 条纹拉伸
    float stretch = smoothstep(0.0, 0.3, fract(suv.y));
    s *= 1.0 - stretch;
    stripes += s / fi;
  }

  // 中心光晕
  float center = smoothstep(0.5, 0.0, r);

  // 鼠标偏移
  vec2 mouseOffset = (uMouse - 0.5) * 0.2;
  float mouseGlow = smoothstep(0.3, 0.0, length(uv - mouseOffset)) * 0.3;

  // 颜色
  vec3 col1 = vec3(0.3, 0.1, 0.8); // 紫蓝
  vec3 col2 = vec3(0.8, 0.2, 0.9); // 品红
  vec3 col3 = vec3(0.2, 0.8, 1.0); // 青蓝

  vec3 col = mix(col1, col2, center);
  col = mix(col, col3, stripes);
  col += vec3(1.0) * stripes * 0.8;
  col += vec3(0.5, 0.3, 1.0) * mouseGlow;

  // 中心强光
  col += vec3(1.0) * smoothstep(0.15, 0.0, r) * 0.8;

  // 暗角
  col *= smoothstep(1.0, 0.3, r);

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function Hyperspeed({
  speed = 1,
}) {
  const containerRef = useRef(null);
  const mouseTargetRef = useRef([0.5, 0.5]);

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
        uMouse: { value: [0.5, 0.5] },
        uSpeed: { value: speed },
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

    function onPointerMove(e) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseTargetRef.current = [x, y];
    }
    function onTouchMove(e) {
      if (e.touches.length === 0) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = 1.0 - (touch.clientY - rect.top) / rect.height;
      mouseTargetRef.current = [x, y];
    }

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('touchmove', onTouchMove, { passive: false });

    let animateId;
    function update(t) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;

      const lerp = 0.06;
      smoothMouse[0] += (mouseTargetRef.current[0] - smoothMouse[0]) * lerp;
      smoothMouse[1] += (mouseTargetRef.current[1] - smoothMouse[1]) * lerp;
      program.uniforms.uMouse.value = smoothMouse;

      renderer.render({ scene: mesh });
    }
    animateId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [speed]);

  return <div ref={containerRef} className="hyperspeed-container" />;
}
