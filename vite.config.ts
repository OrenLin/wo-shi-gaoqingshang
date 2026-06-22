import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  // Vite base 路径策略：
  // 1) Vercel 环境（vercel.com / 自定义域名）→ 根路径 `/`
  // 2) GitHub Pages（通过 GITHUB_REPOSITORY 推导）→ /<repo-name>/
  // 3) 本地开发 / 其他 → 根路径 `/`
  //
  // 可通过设置环境变量 VITE_BASE 强制覆盖：
  //   export VITE_BASE=/wo-shi-gaoqingshang/    # GitHub Pages
  //   export VITE_BASE=/                         # Vercel / 独立域名
  base: (() => {
    if (process.env.VITE_BASE) return process.env.VITE_BASE;
    if (process.env.VERCEL) return '/';
    if (process.env.GITHUB_REPOSITORY) {
      const repo = process.env.GITHUB_REPOSITORY.split('/')[1];
      return `/${repo}/`;
    }
    return '/';
  })(),
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths()
  ],
})
