// Beams 光束背景 — 直接运行规则主题
// 基于 OGL 实现，流动的光束效果
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import './Beams.css';

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
uniform float uBeamWidth;
uniform float uBeamHeight;
uniform float uBeamNumber;
uniform vec3 uLightColor;
uniform float uSpeed;
uniform float uNoiseIntensity;
uniform float uScale;
uniform float uRotation;

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

mat2 rotate2d(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
  vec2 uv = vUv;
  uv -= 0.5;
  uv.x *= uResolution.x / uResolution.y;
  uv = rotate2d(uRotation) * uv;
  uv *= uScale;

  float t = uTime * uSpeed * 0.1;

  // 多条光束
  float beam = 0.0;
  for (float i = 0.0; i < 24.0; i++) {
    if (i >= uBeamNumber) break;
    float offset = i / uBeamNumber;
    // 每条光束的位置和宽度
    float xPos = (fract(offset + t * 0.3) - 0.5) * 4.0;
    float width = uBeamWidth * 0.01 * (0.5 + noise(vec2(i, t)) * 0.8);
    float height = uBeamHeight * 0.15;

    // 光束形状：水平延伸，垂直衰减
    float dx = abs(uv.x - xPos);
    float dy = abs(uv.y - 0.0);
    float beamShape = smoothstep(width, 0.0, dx) * smoothstep(height, 0.0, dy);

    // 噪声扰动
    float n = noise(vec2(uv.x * 5.0 + t + i, uv.y * 3.0)) * uNoiseIntensity;
    beamShape *= 0.6 + n * 0.4;

    beam += beamShape * (0.5 + 0.5 * sin(t * 2.0 + i * 1.5));
  }

  // 颜色
  vec3 col = uLightColor * beam;

  // 暗角
  float vignette = 1.0 - length(uv * 0.5);
  col *= vignette;

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

export default function Beams({
  beamWidth = 2,
  beamHeight = 15,
  beamNumber = 12,
  lightColor = '#ffffff',
  speed = 2,
  noiseIntensity = 2,
  scale = 0.25,
  rotation = 0,
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

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1, 1] },
        uBeamWidth: { value: beamWidth },
        uBeamHeight: { value: beamHeight },
        uBeamNumber: { value: beamNumber },
        uLightColor: { value: hexToRgb(lightColor) },
        uSpeed: { value: speed },
        uNoiseIntensity: { value: noiseIntensity },
        uScale: { value: scale },
        uRotation: { value: rotation },
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
  }, [beamWidth, beamHeight, beamNumber, lightColor, speed, noiseIntensity, scale, rotation]);

  return <div ref={containerRef} className="beams-container" />;
}
