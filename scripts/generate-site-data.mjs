import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const docsDir = join(root, 'docs');
const outFile = join(root, 'data', 'cases.json');
const legacyOutFile = join(root, 'cases.json');
const styleLibraryFile = join(root, 'data', 'style-library.json');
const styleLibrary = JSON.parse(readFileSync(styleLibraryFile, 'utf8'));
const existingPayload = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')) : {};
const legacyExistingPayload = existsSync(legacyOutFile)
  ? JSON.parse(readFileSync(legacyOutFile, 'utf8'))
  : null;
const existingCases = new Map((existingPayload.cases || []).map((item) => [Number(item.id), item]));

const galleryFiles = [
  'gallery-part-1.md',
  'gallery-part-2.md'
];

const categoryLabels = Object.fromEntries(
  styleLibrary.categories.map((category) => [category.anchor, category.value])
);

const featuredIds = new Set([
  1, 2, 6, 17, 166, 310, 330, 334, 338, 341, 344, 346, 350, 353, 354, 359, 360,
  361, 362, 365, 370, 373, 375, 376, 377, 378
]);

function cleanText(value = '') {
  return value
    .replace(/\\_/g, '_')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function stripExternalLinks(value = '') {
  return String(value)
    .replace(/https?:\/\/[^\s<>"'）】)\]}]+/gi, '')
    .replace(/\bwww\.[^\s<>"'）】)\]}]+/gi, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function stripMarkdown(value = '') {
  return cleanText(value)
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .trim();
}

function parseCategoryMap() {
  const text = readFileSync(join(docsDir, 'gallery.md'), 'utf8');
  const map = new Map();
  const sections = text.split(/<a name="(cat-[^"]+)"><\/a>/g);

  for (let i = 1; i < sections.length; i += 2) {
    const categoryId = sections[i];
    const body = sections[i + 1] || '';
    const category = categoryLabels[categoryId] || 'Other Use Cases';
    for (const match of body.matchAll(/#case-(\d+)\)/g)) {
      map.set(Number(match[1]), category);
    }
  }

  return map;
}

function extractPrompt(block) {
  const normalized = block.replace(/\r/g, '');
  const match = normalized.match(/\*\*提示词：\*\*[\s\S]*?```(?:text)?\n([\s\S]*?)```/);
  return cleanText(match?.[1] || '');
}

function inferCategory(caseItem) {
  if (caseItem.category) return caseItem.category;
  const text = `${caseItem.title} ${caseItem.prompt}`.toLowerCase();
  const rules = [
    ['UI & Interfaces', ['ui', 'app', 'interface', 'dashboard', 'screenshot', '网页', '界面', '截图']],
    ['Charts & Infographics', ['infographic', 'diagram', 'chart', 'atlas', '图谱', '信息图', '图解']],
    ['Posters & Typography', ['poster', 'cover', 'typography', '海报', '封面', '字体']],
    ['Products & E-commerce', ['product', 'packaging', 'e-commerce', '商品', '电商', '包装']],
    ['Brand & Logos', ['logo', 'brand', 'identity', '品牌', '标志']],
    ['Architecture & Spaces', ['architecture', 'interior', 'map', '建筑', '室内', '地图']],
    ['Photography & Realism', ['photo', 'portrait', 'camera', 'realistic', '写真', '摄影', '写实']],
    ['Illustration & Art', ['illustration', 'painting', 'watercolor', '插画', '艺术', '水墨']],
    ['Characters & People', ['character', 'pose', 'avatar', '角色', '人物', '头像']],
    ['Scenes & Storytelling', ['storyboard', 'scene', 'narrative', '场景', '叙事', '分镜']],
    ['History & Classical Themes', ['history', 'dynasty', 'classical', '历史', '古风', '唐朝', '宋']],
    ['Documents & Publishing', ['document', 'manual', 'prescription', '文档', '手册', '处方']]
  ];
  return rules.find(([, keys]) => keys.some((key) => text.includes(key)))?.[0] || 'Other Use Cases';
}

function inferTags(caseItem) {
  const text = `${caseItem.title} ${caseItem.prompt}`.toLowerCase();
  const styleOrder = ['UI', 'Infographic', 'Poster', 'Realistic', 'Illustration', 'Product', 'Brand', 'Character', 'Classical', '3D'];
  const sceneOrder = ['Tech', 'Commerce', 'Education', 'Social', 'Fashion', 'Food', 'Travel', 'Story', 'History', 'Creative'];
  const styleByValue = new Map(styleLibrary.styles.map((style) => [style.value, style]));
  const sceneByValue = new Map(styleLibrary.scenes.map((scene) => [scene.value, scene]));
  const styleRules = styleOrder.map((value) => [
    value,
    (styleByValue.get(value)?.keywords || []).map((key) => key.toLowerCase())
  ]);
  const sceneRules = sceneOrder.map((value) => [
    value,
    (sceneByValue.get(value)?.keywords || []).map((key) => key.toLowerCase())
  ]);

  const pick = (rules, fallback) => {
    const tags = rules
      .filter(([, keys]) => keys.some((key) => text.includes(key)))
      .map(([label]) => label);
    return tags.length ? tags.slice(0, 3) : [fallback];
  };

  return {
    styles: pick(styleRules, caseItem.category.split(' & ')[0].replace('Posters', 'Poster')),
    scenes: pick(sceneRules, 'Creative')
  };
}

function parseCases() {
  const categoryMap = parseCategoryMap();
  const cases = [];

  for (const file of galleryFiles) {
    const text = readFileSync(join(docsDir, file), 'utf8');
    const chunks = text.split(/<a name="case-(\d+)"><\/a>/g);

    for (let i = 1; i < chunks.length; i += 2) {
      const id = Number(chunks[i]);
      const block = chunks[i + 1] || '';
      const title = stripMarkdown(block.match(/###\s*例\s*\d+：([^\n]+)/)?.[1] || `Case ${id}`);
      const imageMatch = block.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      const prompt = extractPrompt(block);
      const category = inferCategory({
        title,
        prompt,
        category: categoryMap.get(id)
      });
      const image = imageMatch?.[2]
        ? imageMatch[2].replace('../data/', '/')
        : `/images/case${id}.jpg`;
      const tags = inferTags({ title, prompt, category });
      const existing = existingCases.get(id);
      const promptEn = stripExternalLinks(existing?.promptEn || prompt);
      const promptZh = stripExternalLinks(existing?.promptZh || (/[一-鿿]/.test(prompt) ? prompt : ''));
      const promptPreviewEn = stripExternalLinks(existing?.promptPreviewEn || promptEn.replace(/\n+/g, ' ').slice(0, 220));
      const promptPreviewZh = stripExternalLinks(existing?.promptPreviewZh || (promptZh ? promptZh.replace(/\n+/g, ' ').slice(0, 220) : ''));

      cases.push({
        id,
        title,
        image,
        imageAlt: stripMarkdown(imageMatch?.[1] || title),
        prompt: promptEn,
        promptEn,
        promptZh,
        promptPreview: promptPreviewEn,
        promptPreviewEn,
        promptPreviewZh,
        category,
        styles: tags.styles,
        scenes: tags.scenes,
        featured: featuredIds.has(id)
      });
    }
  }

  return cases.sort((a, b) => b.id - a.id);
}

const cases = parseCases();
const categories = [...new Set(cases.map((item) => item.category))].sort();
const styles = [...new Set(cases.flatMap((item) => item.styles))].sort();
const scenes = [...new Set(cases.flatMap((item) => item.scenes))].sort();

const payload = {
  totalCases: cases.length,
  categories,
  styles,
  scenes,
  cases
};

mkdirSync(dirname(outFile), { recursive: true });
const serializedPayload = `${JSON.stringify(payload, null, 2)}\n`;
writeFileSync(outFile, serializedPayload);
const legacyCases = (legacyExistingPayload?.cases || cases).map((item) => {
  const { sourceLabel, sourceUrl, ...withoutSourceFields } = item;
  return Object.fromEntries(
    Object.entries(withoutSourceFields).map(([key, value]) => [
      key,
      typeof value === 'string' ? stripExternalLinks(value) : value
    ])
  );
});
const legacyPayload = legacyExistingPayload
  ? { ...legacyExistingPayload, totalCases: legacyCases.length, cases: legacyCases }
  : payload;
writeFileSync(legacyOutFile, `${JSON.stringify(legacyPayload, null, 2)}\n`);
console.log(`Generated ${cases.length} cases at ${outFile}`);
