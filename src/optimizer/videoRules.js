export const VIDEO_SCENES = [
  { id: 'text', title: '纯文本叙事', hint: '从创意直接组织主体、动作、场景和镜头。' },
  { id: 'consistency', title: '角色 / 商品一致性', hint: '用参考素材锁定人物、商品或场景的连续性。' },
  { id: 'camera', title: '运镜与动作复刻', hint: '明确参考视频中的运镜、动作和节奏。' },
  { id: 'transition', title: '特效与转场复刻', hint: '保留创意转场逻辑，同时替换主体或场景。' },
  { id: 'story', title: '剧情与对白', hint: '按时间顺序编排画面、台词、情绪和音效。' },
  { id: 'extension', title: '视频延长', hint: '围绕已有视频的结尾状态继续发展。' },
  { id: 'sound', title: '声音设计', hint: '把对白、旁白、环境声和音效写成独立要求。' },
  { id: 'one-take', title: '一镜到底', hint: '规划连续空间关系和镜头路径，避免无意切镜。' },
  { id: 'edit', title: '视频编辑', hint: '在原视频基础上替换、增加或删减指定元素。' },
  { id: 'beat', title: '音乐卡点', hint: '让画面变化、动作和镜头节奏贴合音乐。' },
  { id: 'product', title: '商品广告', hint: '强化产品展示、材质细节、运动轨迹和品牌画面。' }
];

export const VIDEO_DURATION_OPTIONS = ['自动判断', '4 秒', '6 秒', '8 秒', '10 秒', '12 秒', '15 秒', '30 秒以上'];
export const VIDEO_RATIO_OPTIONS = ['自动判断', '16:9', '9:16', '1:1', '4:5', '2.35:1'];
export const VIDEO_AUDIO_OPTIONS = ['自动设计', '无对白，仅环境声与音效', '需要对白 / 旁白', '需要音乐与节拍同步'];

const SCENE_GUIDANCE = {
  text: '采用“主体描述 + 动作序列 + 环境与光影 + 镜头语言 + 风格”的顺序，先写清楚发生什么，再写怎么拍。',
  consistency: '每个参考素材都要说明用途，例如 @图片1 为人物参考、@图片2 为场景参考，避免只罗列素材而不说明关系。',
  camera: '把参考视频拆成运镜、景别、动作、速度和节奏，明确哪些内容复刻、哪些内容替换。',
  transition: '先描述转场或特效的起点、过程和终点，再指定需要替换的主体，避免只写“做得炫酷”。',
  story: '按时间顺序拆分画面、对白、角色状态和声音；对白单独标注角色与情绪，避免台词混入动作描述。',
  extension: '先写上一段视频的结尾状态，再写新增片段；超过单段时长时，拆成连续片段并标出衔接点。',
  sound: '将对白、旁白、环境声、动作音效和音乐分别写清楚，并说明声音出现的时间和情绪。',
  'one-take': '建立可连续行走的空间路径，明确镜头从哪里开始、经过哪里、如何转向和在哪里结束，全程不要切镜。',
  edit: '明确原视频中保留的部分、替换的部分和新增的部分；涉及人物或商品时，写清楚新旧元素的对应关系。',
  beat: '先确定音乐的节拍或段落，再安排画面切换、动作重音和镜头变化，避免每个镜头节奏相同。',
  product: '优先呈现产品轮廓、材质、关键细节和使用方式，补充稳定的产品运动、光线和干净背景。'
};

function sceneById(id) {
  return VIDEO_SCENES.find((scene) => scene.id === id) || VIDEO_SCENES[0];
}

export function buildLocalVideoPrompt({
  userRequest,
  sceneId,
  duration,
  ratio,
  referenceNotes,
  audioPlan
}) {
  const scene = sceneById(sceneId);
  const durationText = duration || '自动判断';
  const ratioText = ratio || '自动判断';
  const references = referenceNotes?.trim() || '无参考素材；只根据文字创意完成视频。';
  const audio = audioPlan || '自动设计';
  const longVideo = durationText === '30 秒以上';
  const timeline = durationText === '15 秒' || longVideo
    ? '时间轴：0-3 秒建立环境与主体；4-8 秒推进主要动作或关系；9-12 秒完成关键变化；13-15 秒收束并保留清晰结束状态。'
    : '时间轴：根据总时长安排 2-3 个连续阶段，明确每个阶段的画面、动作和镜头变化，不要让多个动作同时发生。';
  const continuity = longVideo
    ? '长视频处理：拆分为多个不超过 15 秒的片段；每段写明结尾状态，后续片段从上一段状态自然接续，并标出需要延长的时长。'
    : '连续性：保持主体外观、服装、道具、空间方向和光线逻辑稳定，除非用户明确要求变化。';

  return [
    `视频任务：${userRequest.trim()}`,
    `创作方向：${scene.title}。${SCENE_GUIDANCE[scene.id]}`,
    `输出规格：时长 ${durationText}；画幅 ${ratioText}；输出一条可直接用于视频模型的中文提示词。`,
    '',
    '主体与场景：明确主体身份、外观、位置、环境、时间、空间层级和情绪；只保留与任务有关的元素。',
    '动作与叙事：用有先后顺序的动词描述动作，写清楚动作起点、过程、结果和主体之间的互动。',
    '镜头与节奏：注明景别、视角、运镜方向、速度、焦点变化和必要的转场；不要用空泛的“电影感”代替镜头描述。',
    timeline,
    continuity,
    `参考素材：${references}`,
    '引用规则：使用 @图片1 至 @图片9、@视频1 至 @视频3、@音频1 至 @音频3；每个引用必须说明它参考的是人物、场景、首尾帧、运镜、动作还是声音。',
    `声音设计：${audio}。${audio === '需要对白 / 旁白' ? '对白用引号标注，并注明说话人、语气和出现时间。' : ''}`,
    '负面约束：不要无意切镜、主体变形、人物身份漂移、道具凭空消失、动作跳跃、无关文字、字幕、Logo 或水印；用户明确要求的文字除外。'
  ].join('\n');
}

export function getVideoSceneGuidance(sceneId) {
  return SCENE_GUIDANCE[sceneById(sceneId).id];
}
