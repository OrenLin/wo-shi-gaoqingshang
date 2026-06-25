import Iridescence from '../../Iridescence';

export default function IridescenceBackground() {
  // 新版 Iridescence 使用 gl_FragCoord 标准归一化，自动适配屏幕比例，无需 100vmax 容器
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Iridescence speed={1} amplitude={0.1} mouseReact />
    </div>
  );
}
