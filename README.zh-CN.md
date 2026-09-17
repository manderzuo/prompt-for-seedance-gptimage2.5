# GPT Image 2 提示词画廊

一个用于图片生成工作流的本地提示词画廊与提示词编译器。它把结构化案例、可复用模板、可选 AI 优化和规则化本地编译器整合到桌面应用中。

语言：[English](README.md) | **简体中文** | [日本語](README.ja.md)

## 功能

- 浏览本地提示词案例，直接查看完整提示词和中文翻译。
- 不配置 API 也可以把简短需求编译为结构化图片或视频提示词。
- 可选使用用户配置的 OpenAI 兼容接口进行 AI 优化。
- 保留用户明确指定的比例、文字规则、人物数量、产品身份和负面要求。
- 使用本地风格库和任务模板处理海报、商品、界面、信息图、场景等视觉任务。
- 支持 Vite 开发模式，也支持 Windows Electron 桌面应用。

## 本地开发

使用 Node.js 22.12.0，或其他兼容的 `22.x` 版本。

```bash
npm ci
npm run verify
npm run electron:dev
```

也可以只启动开发网站：

```bash
npm run dev
```

## 测试与打包

```bash
npm test
npm run test:all
npm run verify
npm run dist:win
```

`verify` 会执行完整自动化检查和生产构建；`dist:win` 会先通过验证，再创建 Windows 安装包。

## 本地 API 配置

只有在应用设置中填写兼容接口、模型和 API Key 后，AI 优化开关才会启用。没有这些配置时，规则化本地编译仍然可以使用。凭据应保存在本地应用配置或被忽略的环境文件中，不要提交到仓库。

## 项目结构

- `src/optimizer/` — 提示词编译器、任务模板、优化器界面和回归测试。
- `src/image25/` — 本地画廊和案例展示界面。
- `data/` 与 `cases.json` — 本地案例和风格库数据。
- `docs/` — 本地案例画廊、模板、设计记录和使用说明。
- `agents/skills/` — 本地风格库技能及其生成参考文件。
- `electron/` — 桌面程序主进程和预加载脚本。

## 本地文档

- [提示词案例画廊](docs/gallery.md)
- [案例画廊 Part 1](docs/gallery-part-1.md)
- [案例画廊 Part 2](docs/gallery-part-2.md)
- [提示词模板](docs/templates.md)
- [风格库技能](agents/skills/gpt-image-2-style-library/SKILL.md)
- [项目声明](docs/disclaimer.md)
- [MIT 开源协议](LICENSE)

## 使用说明

案例和模板用于本地学习与提示词开发工作流。商业使用前，请自行确认所使用材料的权利和使用要求。
