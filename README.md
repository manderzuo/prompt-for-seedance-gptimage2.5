# GPT Image 2 Prompt Gallery

A local prompt gallery and prompt compiler for image-generation workflows. It combines structured cases, reusable templates, an optional AI optimizer, and a rule-based local compiler in one desktop application.

Language: **English** | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

## Features

- Browse the local prompt case gallery with full prompt text and translated examples.
- Compile short requests into structured image or video prompts without requiring an API key.
- Optionally refine prompts through a user-configured OpenAI-compatible endpoint.
- Preserve explicit user constraints such as aspect ratio, text rules, people count, product identity, and negative requirements.
- Use the local style library and reusable task templates for posters, products, interfaces, infographics, scenes, and other visual tasks.
- Run as a Vite site during development or as a Windows Electron desktop application.

## Local development

Use Node.js 22.12.0 or another compatible `22.x` release.

```bash
npm ci
npm run verify
npm run electron:dev
```

The development site can also be started with:

```bash
npm run dev
```

## Tests and packaging

```bash
npm test
npm run test:all
npm run verify
npm run dist:win
```

`verify` runs the complete automated checks and the production build. `dist:win` runs that verification before creating the Windows installer.

## Local API settings

The optional AI optimization switch is enabled only after a compatible endpoint, model, and API key have been entered in the application settings. Without those settings, local rule-based compilation remains available. Credentials belong in the local application profile or ignored environment files and must not be committed.

## Project structure

- `src/optimizer/` — prompt compiler, task templates, optimizer UI, and regression tests.
- `src/image25/` — local gallery and case presentation UI.
- `data/` and `cases.json` — local case and style-library data.
- `docs/` — local gallery, templates, design records, and usage notes.
- `agents/skills/` — local style-library skill and generated reference.
- `electron/` — desktop main and preload processes.

## Local documentation

- [Prompt case gallery](docs/gallery.md)
- [Gallery part 1](docs/gallery-part-1.md)
- [Gallery part 2](docs/gallery-part-2.md)
- [Prompt templates](docs/templates.md)
- [Style-library skill](agents/skills/gpt-image-2-style-library/SKILL.md)
- [Project disclaimer](docs/disclaimer.md)
- [MIT License](LICENSE)

## Usage note

The examples and templates are provided for local learning and prompt-development workflows. Check the rights and usage requirements of any material before using it commercially.
