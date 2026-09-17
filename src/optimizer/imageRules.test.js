import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { compileLocalImagePrompt, extractAspectRatio, extractNegativeRequirements, extractRequiredText, parseImageRequest } from './imageRules.js';

const library = JSON.parse(fs.readFileSync(new URL('../../data/style-library.json', import.meta.url), 'utf8'));

test('保留用户明确的比例和未加引号的标题', () => {
  const request = '做一张 4:5 海报，标题：让知识流动起来，风格极简。';
  assert.equal(extractAspectRatio(request, '1:1'), '4:5');
  assert.deepEqual(extractRequiredText(request), ['让知识流动起来']);
});

test('负面要求完整保留，且不会被误判为正向风格', () => {
  const request = '一张中文宣传海报，风格极简、科技感，但不要落入常见的蓝色赛博朋克风。';
  const ir = parseImageRequest({ userRequest: request, aspectRatio: '自动判断' });
  assert.deepEqual(ir.constraints.negative, ['不要落入常见的蓝色赛博朋克风']);
  assert.deepEqual(ir.explicit.styles, ['极简', '科技感']);
  assert.equal(ir.explicit.colors.includes('蓝'), false);
  assert.equal(ir.explicit.styles.includes('赛博朋克'), false);
});

test('按用户意图选择更具体的模板，而不是固定取分类第一项', () => {
  const request = '制作一张中文字体海报，主标题：春日城市，标题成为主视觉，极简排版。';
  const result = compileLocalImagePrompt({
    userRequest: request,
    aspectRatio: '4:5',
    templates: library.templates,
    referenceCases: []
  });
  assert.equal(result.ir.category, 'Posters & Typography');
  assert.equal(result.quality.template, '概念字体海报');
  assert.match(result.prompt, /“春日城市”/);
  assert.match(result.prompt, /需要避免/);
});

test('产品营销海报不会仅因出现“产品”就套用产品摄影规则', () => {
  const result = compileLocalImagePrompt({
    userRequest: '为一个 AI 知识库产品设计一张 4:5 宣传海报，标题：让知识流动起来。',
    aspectRatio: '自动判断',
    templates: []
  });
  assert.equal(result.ir.category, 'Posters & Typography');
  assert.equal(result.prompt.includes('产品外观、轮廓、材质、标签和比例保持一致'), false);
});

test('没有指定文字时不启用字体模板或标题专用规则', () => {
  const result = compileLocalImagePrompt({
    userRequest: '做一张 4:5 的中文科技海报，主题是 AI 知识库，体现信息被整理和连接起来，简洁高级，不要蓝色赛博朋克。',
    aspectRatio: '自动判断',
    templates: library.templates,
    referenceCases: []
  });
  assert.equal(result.quality.template, '');
  assert.equal(result.quality.status, 'ready');
  assert.doesNotMatch(result.prompt, /字体成为画面主角|标题层级|保证标题拼写/);
  assert.match(result.prompt, /主题名称“AI 知识库”仅作为视觉语义/);
});

test('知识库主题使用具体的信息架构视觉锚点，并保持提示词紧凑', () => {
  const result = compileLocalImagePrompt({
    userRequest: '做一张 4:5 的中文科技海报，主题是 AI 知识库，体现信息被整理和连接起来，简洁高级，不要蓝色赛博朋克。',
    aspectRatio: '自动判断',
    templates: library.templates,
    referenceCases: []
  });
  assert.equal(result.ir.themeName, 'AI 知识库');
  assert.equal(result.quality.status, 'ready');
  assert.ok(result.prompt.length < 650);
  assert.match(result.prompt, /模块化信息块、索引卡片、节点/);
  assert.match(result.prompt, /瑞士国际主义网格/);
  assert.match(result.prompt, /不使用中央产品展示台式构图/);
  assert.match(result.prompt, /主题名称“AI 知识库”仅作为视觉语义/);
});

test('产品图的负面要求不会触发人物、食品或辅助道具规则', () => {
  const result = compileLocalImagePrompt({
    userRequest: '做一张 1:1 的无线耳机电商主图，突出白色耳机的材质和结构，干净明亮，简洁高级，不要人物、不要文字、不要多余道具。',
    aspectRatio: '自动判断',
    templates: library.templates,
    referenceCases: []
  });
  assert.equal(result.ir.category, 'Products & E-commerce');
  assert.equal(result.quality.status, 'ready');
  assert.doesNotMatch(result.prompt, /人物的身份|食品|包装、详情页|辅助道具规则/);
  assert.match(result.prompt, /只保留必要接触阴影，不使用辅助道具/);
});
