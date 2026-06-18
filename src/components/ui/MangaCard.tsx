import React from 'react';
import { cn } from '../../lib/utils';

/**
 * 漫画风格卡片
 * 基础容器：粗描边 + 偏移阴影 + 圆角
 */
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  bg?: string;              // 可选：自定义背景色/渐变（className 风格字符串）
  tilt?: boolean;           // 是否加一点倾斜效果（比如装饰性的贴纸）
}

export default function MangaCard({
  children,
  className,
  bg = 'bg-white',
  tilt = false,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={cn(
        'relative rounded-[24px] border-[3px] border-[#1a1a2e] shadow-[5px_5px_0_0_#1a1a2e]',
        'p-5',
        tilt && 'rotate-[-1deg]',
        bg,
        className
      )}
    >
      {children}
    </div>
  );
}
