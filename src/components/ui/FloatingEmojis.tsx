import React from 'react';

/**
 * 页面漂浮 emoji 装饰（纯静态，动画靠 CSS）
 */
interface Item {
  emoji: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: string;
  size?: string;
}

interface Props {
  items: Item[];
}

export default function FloatingEmojis({ items }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((it, i) => (
        <div
          key={i}
          className="absolute animate-float-gentle opacity-50"
          style={{
            top: it.top,
            left: it.left,
            right: it.right,
            bottom: it.bottom,
            fontSize: it.size ?? '2.25rem',
            animationDelay: it.delay ?? '0s',
          }}
        >
          {it.emoji}
        </div>
      ))}
    </div>
  );
}
