// 批量修复 useI18n 解构写法 → selector 写法
// 用法：node scripts/fix-i18n.mjs
import fs from 'node:fs';
import path from 'node:path';

const files = [
  'src/components/ui/ConsentModal.tsx',
  'src/components/ui/AntiKingToast.tsx',
  'src/components/ui/BubbleDialog.tsx',
  'src/components/scene/OptionList.tsx',
  'src/components/scene/SceneCard.tsx',
  'src/components/ui/LevelBadge.tsx',
  'src/pages/FinalReport.tsx',
  'src/pages/Home.tsx',
  'src/pages/Result.tsx',
  'src/pages/Game.tsx',
  'src/pages/SceneSelect.tsx',
  'src/App.tsx',
];

const patterns = [
  // const { language, t } = useI18n();
  // const { language } = useI18n();
  // const { t } = useI18n();
  // const { language, setLanguage, t } = useI18n();
  {
    regex: /const\s*\{\s*([^}]+?)\s*\}\s*=\s*useI18n\(\)\s*;?/g,
    replacement: (match, keys) => {
      const keyList = keys
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);
      return keyList
        .map((key) => `const ${key} = useI18n((s) => s.${key});`)
        .join('\n  ');
    },
  },
];

let changed = 0;
for (const file of files) {
  const abs = path.resolve(process.cwd(), file);
  if (!fs.existsSync(abs)) {
    console.log(`[SKIP] ${file} (不存在)`);
    continue;
  }
  let src = fs.readFileSync(abs, 'utf8');
  let replaced = src;
  for (const { regex, replacement } of patterns) {
    replaced = replaced.replace(regex, replacement);
  }
  if (replaced !== src) {
    fs.writeFileSync(abs, replaced, 'utf8');
    console.log(`[FIX]  ${file}`);
    changed++;
  } else {
    console.log(`[OK]   ${file} (无需修改)`);
  }
}
console.log(`\n共修改 ${changed} 个文件`);
