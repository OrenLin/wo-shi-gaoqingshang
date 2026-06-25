// EvilEye 邪眼背景 — 混沌/人性主题
// 基于 OGL 实现，凝视的眼睛效果，瞳孔跟随鼠标/触摸
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import './EvilEye.css';

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
uniform vec3 uEyeColor;
uniform float uIntensity;
uniform float uPupilSize;
uniform float uIrisWidth;
uniform float uGlowIntensity;
uniform float uScale;
uniform float uNoiseScale;
uniform float uPupilFollow;
uniform vec2 uMouse;
uniform vec3 uBackgroundColor;

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

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
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
  uv /= uScale;

  float t = uTime;

  // 瞳孔跟随鼠标
  vec2 pupilOffset = (uMouse - 0.5) * uPupilFollow * 0.3;

  // 眼睛基本形状
  float dist = length(uv);

  // 虹膜
  float iris = smoothstep(uPupilSize + uIrisWidth, uPupilSize, dist);

  // 瞳孔
  float pupil = smoothstep(uPupilSize + 0.02, uPupilSize, length(uv - pupilOffset));

  // 虹膜颜色 + 噪声纹理
  vec2 irisUv = uv - pupilOffset;
  float irisNoise = fbm(irisUv * uNoiseScale * 10.0 + t * 0.1);
  vec3 irisCol = uEyeColor * (0.5 + irisNoise * 0.8);
  // 虹膜放射状纹理
  float angle = atan(irisUv.y, irisUv.x);
  float rays = sin(angle * 20.0 + irisNoise * 5.0) * 0.5 + 0.5;
  irisCol *= 0.7 + rays * 0.3;

  // 瞳孔：黑色
  vec3 pupilCol = vec3(0.0);

  // 瞳孔中心高光
  float highlight = smoothstep(0.05, 0.0, length(uv - pupilOffset - vec2(0.03, 0.03)));
  pupilCol += vec3(1.0) * highlight * 0.8;

  // 合成
  vec3 col = uBackgroundColor;
  col = mix(col, irisCol, iris);
  col = mix(col, pupilCol, pupil);

  // 外部发光
  float glow = smoothstep(0.5, 0.2, dist) * uGlowIntensity;
  col += uEyeColor * glow * 0.3;

  // 火焰边缘
  float flame = noise(vec2(angle * 3.0, dist * 10.0 - t * 0.8)) * smoothstep(uPupilSize + uIrisWidth + 0.1, uPupilSize + uIrisWidth, dist);
  col += uEyeColor * flame * 0.5;

  col *= uIntensity;

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

export default function EvilEye({
  eyeColor = '#A855F7',
  intensity = 1.3,
  pupilSize = 0.55,
  irisWidth = 0.3,
  glowIntensity = 0.6,
  scale = 0.8,
  noiseScale = 1.3,
  pupilFollow = 1.1,
  flameSpeed = 0.8,
  backgroundColor = '#000000',
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
        uEyeColor: { value: hexToRgb(eyeColor) },
        uIntensity: { value: intensity },
        uPupilSize: { value: pupilSize },
        uIrisWidth: { value: irisWidth },
        uGlowIntensity: { value: glowIntensity },
        uScale: { value: scale },
        uNoiseScale: { value: noiseScale },
        uPupilFollow: { value: pupilFollow },
        uMouse: { value: [0.5, 0.5] },
        uBackgroundColor: { value: hexToRgb(backgroundColor) },
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
      program.uniforms.uTime.value = t * 0.001 * flameSpeed;

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
  }, [eyeColor, intensity, pupilSize, irisWidth, glowIntensity, scale, noiseScale, pupilFollow, flameSpeed, backgroundColor]);

  return <div ref={containerRef} className="evileye-container" />;
}
