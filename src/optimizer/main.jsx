import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertCircle,
  AudioLines,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  Film,
  KeyRound,
  LoaderCircle,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  Volume2,
  WandSparkles,
  X,
  Zap
} from 'lucide-react';
import {
  buildLocalVideoPrompt,
  VIDEO_AUDIO_OPTIONS,
  VIDEO_DURATION_OPTIONS,
  VIDEO_RATIO_OPTIONS,
  VIDEO_SCENES,
  getVideoSceneGuidance
} from './videoRules';
import { compileLocalImagePrompt } from './imageRules';
import './styles.css';

const DEFAULT_SETTINGS = {
  endpoint: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  proxy: 'http://127.0.0.1:10808',
  hasApiKey: false
};

const optimizerApi = window.promptOptimizer;

function section(text, start, end) {
  const startIndex = text.indexOf(start);
  if (startIndex < 0) return '';
  const contentStart = startIndex + start.length;
  const endIndex = end ? text.indexOf(end, contentStart) : -1;
  return text.slice(contentStart, endIndex >= 0 ? endIndex : text.length).trim();
}

function localTitle(value, fallback = '') {
  if (!value) return fallback;
  return value.zh || value.en || fallback;
}

function toReferenceTemplate(template) {
  if (!template) return null;
  return {
    name: localTitle(template.title, template.id),
    category: template.category,
    description: localTitle(template.description),
    styles: template.styles,
    scenes: template.scenes,
    useWhen: localTitle(template.useWhen),
    guidance: template.guidance?.zh || template.guidance?.en || [],
    pitfalls: template.pitfalls?.zh || template.pitfalls?.en || []
  };
}

function toReferenceCase(item) {
  if (!item) return null;
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    styles: item.styles,
    scenes: item.scenes,
    prompt: String(item.promptZh || item.promptEn || item.prompt || '').slice(0, 1400)
  };
}

function App() {
  const [library, setLibrary] = useState(null);
  const [cases, setCases] = useState([]);
  const [request, setRequest] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [aspectRatio, setAspectRatio] = useState('自动判断');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [result, setResult] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clearApiKey, setClearApiKey] = useState(false);
  const [generationMode, setGenerationMode] = useState('local');
  const [promptType, setPromptType] = useState('image');
  const [videoSceneId, setVideoSceneId] = useState('text');
  const [videoDuration, setVideoDuration] = useState('15 秒');
  const [videoRatio, setVideoRatio] = useState('16:9');
  const [videoReferenceNotes, setVideoReferenceNotes] = useState('');
  const [videoAudioPlan, setVideoAudioPlan] = useState('自动设计');

  useEffect(() => {
    Promise.all([
      fetch('/style-library.json').then((response) => response.json()),
      fetch('/cases.json').then((response) => response.json())
    ])
      .then(([styleData, caseData]) => {
        setLibrary(styleData);
        setCases(caseData.cases || []);
      })
      .catch((error) => setStatus({ type: 'error', message: `本地资料加载失败：${error.message}` }));

    if (optimizerApi?.loadSettings) {
      optimizerApi.loadSettings()
        .then((stored) => setSettings({
          ...DEFAULT_SETTINGS,
          ...stored,
          proxy: stored.proxy === 'http://127.0.0.1:10809' ? DEFAULT_SETTINGS.proxy : (stored.proxy || DEFAULT_SETTINGS.proxy),
        }))
        .catch(() => setSettings(DEFAULT_SETTINGS));
    }
  }, []);

  const categories = library?.categories || [];
  const allTemplates = library?.templates || [];
  const selectedCategory = categories.find((item) => item.id === categoryId);
  const filteredTemplates = useMemo(() => {
    if (!categoryId) return allTemplates;
    return allTemplates.filter((item) => item.category === selectedCategory?.value);
  }, [allTemplates, categoryId, selectedCategory]);
  const selectedTemplate = allTemplates.find((item) => item.id === templateId);
  const isVideo = promptType === 'video';
  const selectedVideoScene = VIDEO_SCENES.find((item) => item.id === videoSceneId) || VIDEO_SCENES[0];
  const aiAvailable = Boolean(
    !clearApiKey
    &&
    (settings.hasApiKey || apiKey.trim())
    && String(settings.endpoint || '').trim()
    && String(settings.model || '').trim()
  );
  const caseMap = useMemo(() => new Map(cases.map((item) => [String(item.id), item])), [cases]);
  const referenceCases = useMemo(() => {
    const ids = selectedTemplate?.exampleCases || [];
    const fromTemplate = ids.map((id) => caseMap.get(String(id))).filter(Boolean);
    if (fromTemplate.length) return fromTemplate.slice(0, 3);
    if (!selectedCategory) return cases.slice(0, 3);
    return cases.filter((item) => item.category === selectedCategory.value).slice(0, 3);
  }, [caseMap, cases, selectedCategory, selectedTemplate]);

  const finalPrompt = section(result, '[FINAL_PROMPT]', '[IMPROVEMENTS]') || result;
  const improvements = section(result, '[IMPROVEMENTS]', '[PARAMETERS]');
  const parameters = section(result, '[PARAMETERS]');

  useEffect(() => {
    if (!aiAvailable && generationMode === 'ai') setGenerationMode('local');
  }, [aiAvailable, generationMode]);

  function updateSetting(name, value) {
    setSettings((current) => ({ ...current, [name]: value }));
    setSaved(false);
  }

  async function saveSettings() {
    if (!optimizerApi?.saveSettings) {
      setStatus({ type: 'error', message: '请使用打包后的 EXE 运行，浏览器开发模式没有安全设置存储。' });
      return;
    }
    try {
      const stored = await optimizerApi.saveSettings({ ...settings, apiKey, clearApiKey });
      const nextSettings = { ...DEFAULT_SETTINGS, ...stored };
      setSettings(nextSettings);
      setApiKey('');
      setClearApiKey(false);
      setSaved(true);
      setStatus({ type: 'loading', message: '接口设置已保存，正在测试连通性…' });
      const response = await optimizerApi.testConnection({ ...settings, apiKey });
      setStatus({ type: 'success', message: `接口设置已保存，${response.message}` });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || '保存或连通性测试失败' });
    }
  }

  async function testConnection() {
    if (!optimizerApi?.testConnection) {
      setStatus({ type: 'error', message: '连接测试需要在 Electron EXE 中运行。' });
      return;
    }
    if (!settings.endpoint.trim() || !settings.model.trim()) {
      setStatus({ type: 'error', message: '请先填写接口地址和模型名称。' });
      return;
    }
    if (!settings.hasApiKey && !apiKey.trim()) {
      setStatus({ type: 'error', message: '请先填写 API Key。' });
      return;
    }

    setStatus({ type: 'loading', message: '正在发送最小测试请求…' });
    try {
      const response = await optimizerApi.testConnection({ ...settings, apiKey });
      setStatus({ type: 'success', message: response.message });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || '连接测试失败，请检查接口、Key、模型和代理。' });
    }
  }

  async function optimize() {
    if (!optimizerApi?.optimize) {
      setStatus({ type: 'error', message: 'AI 优化功能需要在 Electron EXE 中运行。' });
      return;
    }
    if (!request.trim()) {
      setStatus({ type: 'error', message: '请先输入你的创意、需求或原始 Prompt。' });
      return;
    }
    if (!settings.endpoint.trim() || !settings.model.trim()) {
      setShowSettings(true);
      setStatus({ type: 'error', message: '请先配置接口地址和模型名称。' });
      return;
    }
    if (!settings.hasApiKey && !apiKey.trim()) {
      setShowSettings(true);
      setStatus({ type: 'error', message: '请先在接口设置中填写 API Key。' });
      return;
    }

    setStatus({ type: 'loading', message: isVideo ? '正在组织视频分镜、运镜和声音要求…' : '正在参考模板和案例，让模型重新组织 Prompt…' });
    setResult('');
    try {
      const response = await optimizerApi.optimize({
        endpoint: settings.endpoint,
        model: settings.model,
        proxy: settings.proxy,
        apiKey,
        language: 'zh-CN',
        userRequest: request,
        contentType: promptType,
        aspectRatio: isVideo ? videoRatio : aspectRatio,
        selectedTemplate: isVideo ? null : toReferenceTemplate(selectedTemplate),
        referenceCases: isVideo ? [] : referenceCases.map(toReferenceCase),
        videoSettings: isVideo ? {
          scene: selectedVideoScene.title,
          duration: videoDuration,
          ratio: videoRatio,
          referenceNotes: videoReferenceNotes,
          audioPlan: videoAudioPlan
        } : null
      });
      setResult(response.content || '');
      setStatus({ type: 'success', message: 'Prompt 优化完成，可以继续编辑后复制。' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || '接口请求失败，请检查设置和网络。' });
    }
  }

  function generateLocally() {
    if (!request.trim()) {
      setStatus({ type: 'error', message: '请先输入你的创意、需求或原始 Prompt。' });
      return;
    }
    const compiled = isVideo
      ? { prompt: buildLocalVideoPrompt({
        userRequest: request,
        sceneId: videoSceneId,
        duration: videoDuration,
        ratio: videoRatio,
        referenceNotes: videoReferenceNotes,
        audioPlan: videoAudioPlan
      }) }
      : compileLocalImagePrompt({
        userRequest: request,
        aspectRatio,
        selectedTemplate,
        selectedCategory,
        referenceCases: selectedTemplate || selectedCategory ? referenceCases : [],
        templates: allTemplates
      });
    const prompt = compiled.prompt;
    const imageQuality = !isVideo ? compiled.quality : null;
    const imageWarnings = !isVideo ? [...(compiled.warnings || []), ...(imageQuality?.warnings || [])] : [];
    setResult([
      '[FINAL_PROMPT]',
      prompt,
      '',
      '[IMPROVEMENTS]',
      isVideo
        ? '已根据本地视频规则完成主体、时间轴、运镜、连续性和声音结构整理。此模式未调用网络接口。'
        : [
          '已将原始需求解析为主体、构图、风格、文字和约束字段，再按内容类型组装。此模式未调用网络接口。',
          imageQuality ? `本地质量检查：${imageQuality.score}/100。${imageQuality.status === 'ready' ? '结构完整，可以直接继续使用。' : '已保留结果，但建议检查下面的提示。'}` : '',
          imageWarnings.length ? `检查提示：${[...new Set(imageWarnings)].join('；')}` : ''
        ].filter(Boolean).join('\n') ,
      '',
      '[PARAMETERS]',
      isVideo
        ? `视频时长：${videoDuration}；画幅：${videoRatio}；方向：${selectedVideoScene.title}；生成方式：本地直接生成。`
        : `识别类型：${compiled.ir.category}；实际画幅：${compiled.ir.ratio}；${compiled.template ? `采用模板：${compiled.quality.template}；` : ''}生成方式：本地直接生成。`
    ].join('\n'));
    setStatus({ type: 'success', message: 'Prompt 已在本机生成，未调用 AI 接口。' });
  }

  function generatePrompt() {
    if (generationMode === 'ai') {
      void optimize();
      return;
    }
    generateLocally();
  }

  async function copyPrompt() {
    if (!finalPrompt) return;
    await navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function openGallery() {
    window.location.href = '/';
  }

  function switchPromptType(type) {
    setPromptType(type);
    setResult('');
    setStatus({ type: 'idle', message: '' });
  }

  return (
    <div className="optimizer-shell">
      <header className="optimizer-topbar">
        <div className="optimizer-brand">
          <span className="brand-mark"><Sparkles size={17} /></span>
          <span>GPT Image 2</span>
          <span className="brand-divider">/</span>
          <span className="brand-muted">Prompt Optimizer</span>
        </div>
        <nav className="optimizer-nav">
          <button className="ghost-button" onClick={openGallery}><BookOpen size={16} />案例画廊</button>
          <button className="settings-button" onClick={() => setShowSettings((value) => !value)}>
            <Settings2 size={16} />接口设置 {settings.hasApiKey && <span className="key-dot" />}
          </button>
        </nav>
      </header>

      <main className="optimizer-main">
        <section className="optimizer-hero">
          <div className="hero-kicker">{isVideo ? <Film size={15} /> : <Zap size={15} />} {isVideo ? 'VIDEO PROMPT WORKSPACE' : 'REFERENCE-AWARE PROMPT ENGINE'}</div>
          <h1>{isVideo ? <>用镜头和时间轴，<span>让视频 Prompt 更可控。</span></> : <>让模板成为起点，<span>让 Prompt 更具体。</span></>}</h1>
          <p>{isVideo ? '把视频创意整理成包含主体、动作、时间轴、运镜、连续性和声音设计的中文 Prompt；可以本地生成，也可以交给兼容接口继续优化。' : '把你的创意交给本地模板库或兼容接口，结合案例、工业级模板、风格和避坑指南，整理出更具体、更可控的图片 Prompt。'}</p>
        </section>

        <div className="optimizer-grid">
          <section className="panel input-panel">
            <div className="panel-heading">
              <div><span className="panel-index">01</span><h2>描述你的目标</h2></div>
              <span className="panel-hint">中文输入，中文输出</span>
            </div>
            <div className="prompt-type-switch" role="group" aria-label="选择 Prompt 类型">
              <button type="button" className={promptType === 'image' ? 'active' : ''} aria-pressed={promptType === 'image'} onClick={() => switchPromptType('image')}><Sparkles size={15} />图片 Prompt</button>
              <button type="button" className={promptType === 'video' ? 'active' : ''} aria-pressed={promptType === 'video'} onClick={() => switchPromptType('video')}><Film size={15} />视频 Prompt</button>
            </div>
            <label className="field-label" htmlFor="request">{isVideo ? '视频创意 / 原始 Prompt' : '创意 / 原始 Prompt'}</label>
            <textarea
              id="request"
              className="request-input"
              value={request}
              onChange={(event) => setRequest(event.target.value)}
              placeholder={isVideo ? '例如：15 秒横屏产品广告，一罐冷萃咖啡从冰块中旋转出现，镜头由近及远，最后定格在品牌标语。' : '例如：为一个 AI 知识库产品设计一张 4:5 的中文宣传海报，要专业、清晰、有科技感，但不要落入常见的蓝色赛博朋克风。'}
            />
            {!isVideo ? <div className="field-row">
              <div className="field-group">
                <label className="field-label" htmlFor="category">目标类型</label>
                <select id="category" value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setTemplateId(''); }}>
                  <option value="">自动判断</option>
                  {categories.map((item) => <option value={item.id} key={item.id}>{localTitle(item.title, item.value)}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="aspect">画面比例</label>
                <select id="aspect" value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value)}>
                  {['自动判断', '1:1', '4:5', '3:4', '9:16', '16:9', '21:9'].map((value) => <option key={value}>{value}</option>)}
                </select>
              </div>
            </div> : <>
              <div className="field-row">
                <div className="field-group">
                  <label className="field-label" htmlFor="video-scene">视频方向</label>
                  <select id="video-scene" value={videoSceneId} onChange={(event) => setVideoSceneId(event.target.value)}>
                    {VIDEO_SCENES.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="video-ratio">画幅比例</label>
                  <select id="video-ratio" value={videoRatio} onChange={(event) => setVideoRatio(event.target.value)}>
                    {VIDEO_RATIO_OPTIONS.map((value) => <option key={value}>{value}</option>)}
                  </select>
                </div>
              </div>
              <div className="field-row video-options-row">
                <div className="field-group">
                  <label className="field-label" htmlFor="video-duration">视频时长</label>
                  <select id="video-duration" value={videoDuration} onChange={(event) => setVideoDuration(event.target.value)}>
                    {VIDEO_DURATION_OPTIONS.map((value) => <option key={value}>{value}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="video-audio">声音设计</label>
                  <select id="video-audio" value={videoAudioPlan} onChange={(event) => setVideoAudioPlan(event.target.value)}>
                    {VIDEO_AUDIO_OPTIONS.map((value) => <option key={value}>{value}</option>)}
                  </select>
                </div>
              </div>
              <div className="field-group video-reference-group">
                <label className="field-label" htmlFor="video-references">参考素材说明 <span>可选</span></label>
                <textarea id="video-references" className="reference-input" value={videoReferenceNotes} onChange={(event) => setVideoReferenceNotes(event.target.value)} placeholder="例如：@图片1 为人物参考；@图片2 为场景参考；@视频1 为运镜参考；@音频1 为背景音乐参考。" />
                <p className="field-help">只需写清楚每个素材的用途，不需要在这里上传文件。</p>
              </div>
              <div className="video-guide-note"><div><AudioLines size={16} /><strong>{selectedVideoScene.title}</strong></div><p>{getVideoSceneGuidance(videoSceneId)}</p></div>
            </>}
            {!isVideo && <div className="field-group template-group">
              <label className="field-label" htmlFor="template">参考模板 <span>可选，AI 会自行判断是否采用</span></label>
              <select id="template" value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
                <option value="">不指定，让 AI 选择</option>
                {filteredTemplates.map((item) => <option value={item.id} key={item.id}>{localTitle(item.title, item.id)}</option>)}
              </select>
            </div>}
            <div className="generation-mode">
              <div className="mode-heading">
                <span className="field-label">生成方式</span>
                <span className="mode-hint">默认本地处理</span>
              </div>
              <div className="mode-switch" role="group" aria-label="选择 Prompt 生成方式">
                <button
                  className={`mode-option ${generationMode === 'local' ? 'active' : ''}`}
                  type="button"
                  aria-pressed={generationMode === 'local'}
                  onClick={() => setGenerationMode('local')}
                >
                  <strong>本地直接生成</strong>
                  <span>不联网，使用内置模板与案例</span>
                </button>
                <button
                  className={`mode-option ${generationMode === 'ai' ? 'active' : ''}`}
                  type="button"
                  aria-pressed={generationMode === 'ai'}
                  disabled={!aiAvailable}
                  onClick={() => setGenerationMode('ai')}
                >
                  <strong>采用 AI 优化</strong>
                  <span>{aiAvailable ? '调用已配置的兼容接口' : '需先填写并保存 API Key'}</span>
                </button>
              </div>
              {!aiAvailable && <p className="mode-help">AI 优化当前不可用；打开接口设置并保存 API Key 后，此选项会自动启用。</p>}
            </div>
            {!isVideo && selectedTemplate && (
              <div className="reference-note">
                <div className="reference-note-title"><BookOpen size={15} /> 当前参考：{localTitle(selectedTemplate.title, selectedTemplate.id)}</div>
                <p>{localTitle(selectedTemplate.description)}</p>
                <div className="tag-list">{selectedTemplate.styles.map((tag) => <span key={tag}>{tag}</span>)}{selectedTemplate.scenes.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
            )}
            <button className="primary-button" onClick={generatePrompt} disabled={status.type === 'loading'}>
              {status.type === 'loading' ? <LoaderCircle size={18} className="spin" /> : <WandSparkles size={18} />}
              {status.type === 'loading' ? (generationMode === 'ai' ? '优化中…' : '生成中…') : generationMode === 'ai' ? `${isVideo ? 'AI 优化视频' : 'AI 优化'} Prompt` : `本地生成${isVideo ? '视频' : ''} Prompt`}
            </button>
            <div className="input-footnote"><KeyRound size={14} /> {generationMode === 'ai' ? '仅将本次请求发送到你配置的 OpenAI 兼容接口' : `本地直接生成${isVideo ? '视频结构' : ''}，不会发送创意或 Prompt`}</div>
          </section>

          <section className="panel output-panel">
            <div className="panel-heading">
              <div><span className="panel-index">02</span><h2>{isVideo ? '得到可用视频 Prompt' : '得到可用结果'}</h2></div>
              {finalPrompt && <button className="copy-button" onClick={copyPrompt}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? '已复制' : '复制最终 Prompt'}</button>}
            </div>
            {!result && (
              <div className="empty-output">
                <div className="empty-icon"><Sparkles size={28} /></div>
                <h3>{isVideo ? '等待你的视频创意' : '等待你的第一个创意'}</h3>
                <p>{isVideo ? '结果会按主体、时间轴、运镜、连续性和声音要求整理，你可以继续编辑最终 Prompt。' : '优化结果会按“最终 Prompt / 改进说明 / 参数建议”分区展示。你可以继续编辑最终 Prompt。'}</p>
              </div>
            )}
            {result && (
              <div className="result-content">
                <div className="result-block result-primary">
                  <div className="result-label">{isVideo ? 'FINAL VIDEO PROMPT' : 'FINAL PROMPT'} <span>可编辑</span></div>
                  <textarea className="result-textarea" value={finalPrompt} onChange={(event) => setResult(`[FINAL_PROMPT]\n${event.target.value}\n\n[IMPROVEMENTS]\n${improvements}\n\n[PARAMETERS]\n${parameters}`)} />
                </div>
                {improvements && <div className="result-block"><div className="result-label">IMPROVEMENTS</div><div className="result-copy">{improvements}</div></div>}
                {parameters && <div className="result-block"><div className="result-label">PARAMETERS</div><div className="result-copy">{parameters}</div></div>}
              </div>
            )}
          </section>
        </div>

        {status.message && (
          <div className={`status-banner ${status.type}`}><span>{status.type === 'error' ? <AlertCircle size={16} /> : status.type === 'success' ? <Check size={16} /> : <LoaderCircle size={16} className="spin" />}</span>{status.message}<button onClick={() => setStatus({ type: 'idle', message: '' })}><X size={15} /></button></div>
        )}

        <section className="trust-strip">
          <div>{isVideo ? <Film size={17} /> : <BookOpen size={17} />}<strong>{isVideo ? '本地视频规则' : '本地参考库'}</strong><span>{isVideo ? '镜头、时间轴、连续性、声音和负面约束均由本地规则辅助整理。' : '案例、模板、风格与避坑指南只作为参考，不会限制 AI 的判断。'}</span></div>
          <div><KeyRound size={17} /><strong>Key 本机保存</strong><span>使用 Windows 安全存储，不写入项目文件或打包资源。</span></div>
          <div>{isVideo ? <Volume2 size={17} /> : <Sparkles size={17} />}<strong>{isVideo ? '画面与声音分开' : '不绑定生图'}</strong><span>{isVideo ? '视频 Prompt 同时整理画面动作和声音要求，不直接生成视频。' : '这里只优化文字 Prompt，是否生图由你决定。'}</span></div>
        </section>
      </main>

      {showSettings && (
        <div className="settings-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowSettings(false); }}>
          <aside className="settings-drawer">
            <div className="drawer-heading"><div><Settings2 size={20} /><h2>OpenAI 兼容接口</h2></div><button onClick={() => setShowSettings(false)}><X size={18} /></button></div>
            <p className="drawer-description">支持 OpenAI、DeepSeek、硅基流动以及其他提供 `/chat/completions` 的兼容服务。</p>
            <label className="field-label" htmlFor="endpoint">接口地址</label>
            <input id="endpoint" value={settings.endpoint} onChange={(event) => updateSetting('endpoint', event.target.value)} placeholder="https://api.openai.com/v1" />
            <p className="field-help">可填写基础地址，也可直接填写完整的 `/chat/completions` 地址。</p>
            <label className="field-label" htmlFor="model">模型名称</label>
            <input id="model" value={settings.model} onChange={(event) => updateSetting('model', event.target.value)} placeholder="gpt-4o-mini" />
            <label className="field-label" htmlFor="api-key">API Key</label>
            <input id="api-key" type="password" value={apiKey} onChange={(event) => { setApiKey(event.target.value); setClearApiKey(false); }} placeholder={settings.hasApiKey ? '已保存，留空则继续使用' : 'sk-…'} />
            {settings.hasApiKey && <div className="saved-key-note"><Check size={14} /> 已有一个保存的 API Key；不会回显明文。</div>}
            {settings.hasApiKey && <button className="danger-link" onClick={() => setClearApiKey((value) => !value)}><Trash2 size={14} />{clearApiKey ? '将清除已保存 Key' : '清除已保存 Key'}</button>}
            <label className="field-label" htmlFor="proxy">HTTP 代理 <span>可选</span></label>
            <input id="proxy" value={settings.proxy} onChange={(event) => updateSetting('proxy', event.target.value)} placeholder="http://127.0.0.1:10808" />
            <p className="field-help">如果你的 API 需要代理，可填写本机代理；不需要时清空。</p>
            <div className="settings-actions">
              <button className="secondary-button" onClick={testConnection} disabled={status.type === 'loading'}><Zap size={16} />测试连接</button>
              <button className="save-button" onClick={saveSettings} disabled={status.type === 'loading'}><Save size={17} />保存并测试</button>
            </div>
            {saved && <div className="saved-key-note"><Check size={14} /> 设置已保存</div>}
            <div className="drawer-warning"><AlertCircle size={16} /><span>API Key 会发送到你填写的接口地址。请确认该服务商可信，并自行承担接口费用。</span></div>
          </aside>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('optimizer-root')).render(<App />);
