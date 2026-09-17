const OTHER_CATEGORY = 'Other Use Cases';

const CATEGORY_PROFILES = {
  'UI & Interfaces': {
    label: '界面与产品视觉',
    focus: '把它当成一个真实可用的 App、网页或仪表盘界面，而不是漂浮在背景上的随机组件。',
    structure: '先确定设备或浏览器窗口边界，再组织导航、主要内容、状态反馈和操作控件的层级；让所有控件有明确的对齐线、间距和交互状态。',
    subject: '保留用户指定的产品名称、功能模块、数据和界面文字，建立清晰的信息优先级，不凭空增加无关页面。',
    look: '高保真产品界面，边界清楚，字号和对比度适合阅读，图标风格统一，组件重复使用相同的圆角、描边、阴影和间距。',
    avoid: ['随机按钮和无意义图标', '乱码、残缺字母、重叠文本', '不一致的组件尺寸', '脱离设备边界的漂浮界面'],
    required: ['平台或设备边界', '页面层级', '组件对齐和间距'],
    matcher: ['ui', 'app', '网页', '网站', '界面', '仪表盘', '后台', '产品界面', '截图']
  },
  'Charts & Infographics': {
    label: '图表与信息可视化',
    focus: '先保证信息关系、标签和阅读顺序准确，再安排装饰和氛围。',
    structure: '先建立标题、导语、主图、分组模块、注释和图例的阅读路径；用网格、连接线、编号和颜色编码表达关系。',
    subject: '保留用户指定的主题、数据、标签和分类，优先保证信息之间的关系准确，再安排装饰和氛围。',
    look: '编辑级信息图，模块边界和层级明确，图形符号统一，颜色数量受控，文字和数字留出足够的阅读空间。',
    avoid: ['没有含义的装饰图表', '随机数字和伪数据', '图例与图形对应不清', '过密的文字和无法阅读的小字号'],
    required: ['标题和阅读路径', '模块之间的关系', '短标签和图例'],
    matcher: ['infographic', 'diagram', 'chart', 'atlas', '信息图', '图表', '图谱', '知识图', '流程图']
  },
  'Posters & Typography': {
    label: '海报与排版视觉',
    focus: '做一张完成度高的单幅海报，建立一个主视觉焦点和清楚的阅读路径。',
    structure: '先确定一个主视觉焦点，再建立标题、副标题、信息文字和留白的层级；让文字、主体和视觉动线共同服务于同一个主题。',
    subject: '把用户指定的主题或主体放在最醒目的层级，保留明确的情绪、时代、地域或品牌语义，不用无关元素填满画面。',
    look: '具有明确版式系统的海报，主次对比强，字体大小和字距有节奏，色彩、图形和主体材质相互呼应。',
    avoid: ['标题被主体遮挡', '文字变形、乱码或重复', '素材堆砌导致没有视觉焦点', '廉价的模板化渐变和无意义装饰'],
    required: ['主视觉焦点', '标题层级', '边缘留白和阅读路径'],
    matcher: ['poster', 'cover', 'typography', '海报', '封面', '排版', '宣传画', '标题']
  },
  'Products & E-commerce': {
    label: '商品与电商视觉',
    focus: '把产品识别和卖点表达放在第一位，让背景、道具和光线只服务于产品。',
    structure: '以产品为唯一主角，安排产品轮廓、材质、关键细节、使用场景和卖点的展示顺序；让背景、道具和光线衬托产品而不抢主体。',
    subject: '严格保留用户指定的产品外观、比例、颜色、包装结构、品牌文字和功能，不擅自改款或替换产品。',
    look: '商业产品摄影或精致产品渲染，材质边缘清楚，光线有方向，反射和阴影符合物理关系，画面干净高级。',
    avoid: ['产品变形或重复出现', '擅自修改包装文字和 Logo', '杂乱道具抢夺主体', '塑料感过强或不符合材质的反光'],
    required: ['产品轮廓和材质', '主产品与道具的层级', '光线和接触阴影'],
    matcher: ['product', 'e-commerce', '商品', '产品', '电商', '包装', '广告图', '详情页']
  },
  'Brand & Logos': {
    label: '品牌与标志系统',
    focus: '让主标志、字标、色彩和应用场景形成一个统一、可复用的系统。',
    structure: '围绕品牌核心符号建立标志、字标、色彩、图形和应用场景的关系；保证主标志有完整的安全空间和清晰轮廓。',
    subject: '保留用户明确指定的品牌名称、字母、图形寓意和颜色要求；若用户没有指定，不擅自添加真实品牌名称。',
    look: '简洁、可识别、可复用的品牌视觉，图形几何关系稳定，字形清晰，应用展示与主标志保持一致。',
    avoid: ['伪造或混入其他品牌', '标志被裁切、重叠或变形', '过多细节降低识别度', '随机字母和无意义徽章'],
    required: ['核心标志或字标', '安全空间', '统一的品牌色和字体逻辑'],
    matcher: ['logo', 'brand', 'identity', '品牌', '标志', '徽标', '字标', 'vi ']
  },
  'Architecture & Spaces': {
    label: '建筑与空间场景',
    focus: '先把空间的尺度、透视和动线讲清楚，再处理材质、家具和氛围。',
    structure: '先确定空间的尺度、视点、主要轴线和前中后景，再安排建筑体块、动线、开口、材质和光影关系。',
    subject: '保持建筑或室内空间的结构逻辑、透视和比例，突出用户指定的功能、地标、材料或生活痕迹。',
    look: '空间关系清楚，透视稳定，材质有真实尺度，光线方向统一，远近层次和空气感自然。',
    avoid: ['墙体、门窗和楼梯互相穿插', '透视线冲突', '漂浮家具和重复建筑', '没有尺度参照的空洞空间'],
    required: ['视点和空间尺度', '主要轴线和透视', '材质与光线方向'],
    matcher: ['architecture', 'interior', 'building', '建筑', '室内', '空间', '房间', '场景设计']
  },
  'Photography & Realism': {
    label: '摄影与写实人像',
    focus: '用真实镜头、光线和材质关系建立可信的照片，而不是用滤镜代替细节。',
    structure: '明确主体、拍摄距离、镜头视角、焦点、景深和光线方向；让姿态、表情、服装和环境围绕同一情绪展开。',
    subject: '严格保留用户指定的人物、产品或场景关系；人物需要自然的身体结构、手部、五官、服装和真实互动。',
    look: '具有真实镜头逻辑的摄影画面，曝光、肤色、材质、阴影和景深自然，不用过度磨皮或泛滥的滤镜替代细节。',
    avoid: ['额外人物和重复主体', '不自然的手指、五官或肢体', '过度磨皮和塑料皮肤', '光线方向前后矛盾'],
    required: ['拍摄距离和视角', '焦点和景深', '可信的光线方向'],
    matcher: ['photo', 'portrait', 'camera', 'dslr', 'photography', '摄影', '写真', '人像', '照片', '实拍']
  },
  'Illustration & Art': {
    label: '插画与艺术表现',
    focus: '先统一媒介和艺术语言，再补充笔触、色块、纹理和装饰。',
    structure: '先确定主体轮廓和画面动线，再安排色块、笔触、材质、背景和装饰；控制元素数量，避免风格之间相互冲突。',
    subject: '保留用户指定的主体、动作、情绪和文化语义，将细节转换成统一的艺术语言，而不是简单叠加多个风格标签。',
    look: '具有统一媒介质感和明确色彩关系，笔触、边缘、纸张或材质与整体风格一致，主体仍然容易识别。',
    avoid: ['风格词互相冲突', '主体被纹理和装饰淹没', '无意义的复杂背景', '写实、卡通和 3D 质感混杂'],
    required: ['统一的媒介', '主体轮廓和画面动线', '有控制的色彩与纹理'],
    matcher: ['illustration', 'painting', 'watercolor', 'sketch', '插画', '绘画', '水彩', '水墨', '艺术']
  },
  'Characters & People': {
    label: '人物与角色设计',
    focus: '先锁定角色身份和外观连续性，再安排姿态、道具、动作和背景。',
    structure: '先锁定角色身份、脸部、发型、服装和配件，再安排姿态、道具、动作和背景；用统一的视角和比例组织角色展示。',
    subject: '保留用户指定的人物身份、年龄、性格、服装、配件和动作，不擅自更换角色关系或增加不需要的人物。',
    look: '角色轮廓清晰，比例稳定，服装与材质有层次，表情和姿态服务于人物设定，适合角色卡、头像或叙事画面。',
    avoid: ['人物身份漂移', '重复角色和多余肢体', '服装配件前后不一致', '无法辨认的脸部和手部'],
    required: ['身份和外观锁定', '姿态或动作', '人物数量和关系'],
    matcher: ['character', 'avatar', 'lookbook', '角色', '人物', '头像', '人设', '发型']
  },
  'Scenes & Storytelling': {
    label: '场景与叙事画面',
    focus: '让观者一眼看懂时间、地点、人物关系和正在发生的关键瞬间。',
    structure: '明确故事发生的时间、地点、人物关系和视觉焦点，用前景、中景、背景和动作线建立可读的叙事顺序。',
    subject: '保留用户指定的角色、事件、道具和情绪，让场景中的每个元素都有叙事作用，不用随机内容填充空间。',
    look: '画面有明确的瞬间和戏剧关系，空间、动作、光影和色彩共同强化情节，细节丰富但不会削弱主线。',
    avoid: ['角色关系不清', '动作无法判断先后', '背景与故事无关', '同时存在多个互相冲突的视觉焦点'],
    required: ['时间和地点', '人物关系或动作', '唯一的叙事焦点'],
    matcher: ['storyboard', 'narrative', 'story', '分镜', '叙事', '故事', '剧情', '电影']
  },
  'History & Classical Themes': {
    label: '历史与古典题材',
    focus: '先锁定时代和地域，再使用服饰、建筑、器物、文字和色彩表达文化语境。',
    structure: '先确定时代、地域、人物和叙事事件，再安排服饰、建筑、器物、文字和色彩；历史元素要服务于画面主题。',
    subject: '保留用户指定的历史人物、典故、诗文、地域和时代特征，避免把不同时代的服饰、建筑和符号混在一起。',
    look: '整体视觉语言统一，传统材质、纹样、书写和空间层次相互呼应，既有文化识别度又保持画面清晰。',
    avoid: ['时代元素混搭', '伪造或错误的文字', '纹样堆砌遮挡主体', '把历史题材套成泛化古风模板'],
    required: ['时代和地域', '文化符号的来源一致', '主体与传统材质的关系'],
    matcher: ['history', 'dynasty', 'classical', 'ancient', '历史', '古风', '古典', '朝代', '诗词']
  },
  'Documents & Publishing': {
    label: '文档与出版物',
    focus: '按照真实出版物的网格、边距和阅读顺序组织内容，先保证可读性。',
    structure: '按照封面、标题、正文、图表、页码和注释建立出版级层级，先保证信息顺序和阅读路径，再处理装饰。',
    subject: '保留用户指定的文字、数据、章节、图表和版面用途；所有需要显示的文字都必须短、清楚、有明确位置。',
    look: '像真实的出版物或技术资料，网格、边距、字号、行距、图表和图像风格统一，细节可读。',
    avoid: ['随机正文和假数据', '文字挤压出边界', '层级混乱', '过度装饰破坏阅读'],
    required: ['页面用途', '信息层级', '网格和边距'],
    matcher: ['document', 'manual', 'white paper', 'publishing', '文档', '手册', '白皮书', '出版', '百科']
  },
  [OTHER_CATEGORY]: {
    label: '综合创意视觉',
    focus: '先确定唯一主视觉和阅读顺序，只补充有助于模型理解画面的必要信息。',
    structure: '先确定唯一主视觉和阅读顺序，再组织主体、环境、构图、材质、光线和输出要求，避免把多个创意平均堆在一起。',
    subject: '以用户明确提出的主题、主体、关系和用途为准，只补充能帮助模型理解画面的必要信息。',
    look: '视觉方向统一，主体突出，层级清楚，色彩和材质有一致性，细节丰富但不喧宾夺主。',
    avoid: ['无关元素', '重复主体', '互相冲突的风格词', '随机文字、Logo 或水印'],
    required: ['唯一主视觉', '主体与环境关系', '明确的输出目标'],
    matcher: []
  }
};

const CATEGORY_MATCHERS = Object.entries(CATEGORY_PROFILES)
  .filter(([category]) => category !== OTHER_CATEGORY)
  .map(([category, profile]) => [category, profile.matcher]);

const CATEGORY_WEIGHTS = {
  'UI & Interfaces': { ui: 4, app: 3, 网页: 4, 网站: 4, 界面: 4, 仪表盘: 5, 后台: 4, '产品界面': 6, 截图: 3 },
  'Charts & Infographics': { infographic: 5, diagram: 4, chart: 4, atlas: 3, 信息图: 6, 图表: 5, 图谱: 5, 知识图: 6, 流程图: 6 },
  'Posters & Typography': { poster: 5, cover: 4, typography: 5, 海报: 6, 封面: 5, 排版: 5, 宣传画: 5, 标题: 2 },
  'Products & E-commerce': { product: 2, 'e-commerce': 5, 商品: 5, 产品: 1, 电商: 5, 包装: 5, 广告图: 4, 详情页: 6 },
  'Brand & Logos': { logo: 6, brand: 4, identity: 5, 品牌: 4, 标志: 6, 徽标: 6, 字标: 6, 'vi ': 5 },
  'Architecture & Spaces': { architecture: 5, interior: 5, building: 4, 建筑: 5, 室内: 5, 空间: 3, 房间: 4, 场景设计: 4 },
  'Photography & Realism': { photo: 3, portrait: 4, camera: 3, dslr: 4, photography: 5, 摄影: 5, 写真: 5, 人像: 4, 照片: 4, 实拍: 5 },
  'Illustration & Art': { illustration: 5, painting: 4, watercolor: 5, sketch: 4, 插画: 5, 绘画: 4, 水彩: 5, 水墨: 5, 艺术: 3 },
  'Characters & People': { character: 4, avatar: 5, lookbook: 4, 角色: 5, 人物: 3, 头像: 5, 人设: 5, 发型: 3 },
  'Scenes & Storytelling': { storyboard: 6, narrative: 5, story: 4, 分镜: 6, 叙事: 5, 故事: 4, 剧情: 5, 电影: 3 },
  'History & Classical Themes': { history: 5, dynasty: 5, classical: 4, ancient: 4, 历史: 5, 古风: 4, 古典: 5, 朝代: 6, 诗词: 5 },
  'Documents & Publishing': { document: 5, manual: 4, 'white paper': 5, publishing: 5, 文档: 5, 手册: 5, 白皮书: 6, 出版: 5, 百科: 4 }
};

const STYLE_TERMS = [
  '极简', '简约', '简洁', '现代', '专业', '科技', '复古', '怀旧', '未来感', '科技感', '赛博朋克', '电影感', '纪实', '商业摄影', '写实',
  '胶片', '水墨', '水彩', '油画', '素描', '扁平', '等距', '3D', '立体', '手工', '奢华', '高级', '可爱', '梦幻',
  'minimal', 'minimalist', 'retro', 'futuristic', 'cyberpunk', 'cinematic', 'documentary', 'realistic', 'editorial',
  'film', 'ink', 'watercolor', 'oil painting', 'sketch', 'flat', 'isometric', '3d', 'luxury', 'cute', 'dreamy'
];

const COMPOSITION_TERMS = [
  '居中', '对称', '非对称', '留白', '负空间', '三分法', '对角线', '俯拍', '平视', '低机位', '高机位', '特写', '近景',
  '中景', '远景', '正面', '侧面', '背面', '全身', '半身', '横向', '纵向', '拼贴', '网格', '分栏', '前景', '中景', '背景',
  'centered', 'symmetrical', 'asymmetrical', 'negative space', 'top-down', 'eye-level', 'low angle', 'high angle',
  'close-up', 'medium shot', 'wide shot', 'front view', 'side view', 'collage', 'grid', 'foreground', 'background'
];

const LIGHTING_TERMS = [
  '自然光', '柔光', '硬光', '侧光', '逆光', '顶光', '轮廓光', '霓虹', '棚拍', '黄金时刻', '阴天', '高调', '低调',
  'natural light', 'soft light', 'hard light', 'side light', 'backlight', 'rim light', 'neon', 'studio light', 'golden hour', 'overcast'
];

const COLOR_TERMS = [
  '红', '橙', '黄', '绿', '蓝', '紫', '粉', '黑', '白', '灰', '金', '银', '棕', '米色', '暖色', '冷色', '低饱和', '高饱和',
  'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'black', 'white', 'gray', 'gold', 'silver', 'brown', 'beige', 'warm', 'cool', 'muted', 'saturated'
];

const CAMERA_TERMS = [
  '手机', '手机摄影', '广角', '长焦', '微距', '镜头', '相机', '景深', '背景虚化', '鱼眼',
  'smartphone', 'wide-angle', 'telephoto', 'macro', 'lens', 'camera', 'depth of field', 'bokeh', 'fisheye'
];

const LABEL_PATTERNS = [
  /(?:唯一可读文字|唯一允许出现的文字|唯一文字|主标题|副标题|标题|headline|副文案|标语|slogan|文案|文字|字样|显示|写上|写着|写有|印有|标注)\s*[:：]\s*[“「『"]?([^”」』"\n，。！？；;]{1,100})/giu,
  /(?:文字|标题|文案|标语|slogan|headline)\s*[为是]\s*[“「『"]?([^”」』"\n，。！？；;]{1,100})/giu
];

function normalizeText(value) {
  return String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ').replace(/\s+/g, ' ').trim();
}

function cleanLine(value) {
  return normalizeText(value)
    .replace(/^[-*•\s]+/, '')
    .replace(/[。；;]+$/, '')
    .trim();
}

function unique(values) {
  return [...new Set(values.map(cleanLine).filter(Boolean))];
}

function displayText(value, fallback = '') {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value.zh || value.en || fallback;
}

function hasAny(text, values) {
  const normalized = normalizeText(text).toLowerCase();
  return values.some((value) => normalized.includes(String(value).toLowerCase()));
}

function matchTerms(text, terms) {
  const normalized = normalizeText(text).toLowerCase();
  const found = unique(terms.filter((term) => normalized.includes(term.toLowerCase())));
  return found.filter((term, index) => !found.some((other, otherIndex) => (
    otherIndex !== index
    && other.length > term.length
    && other.toLowerCase().includes(term.toLowerCase())
  )));
}

function scoreCategory(userRequest, category) {
  const normalized = normalizeText(userRequest).toLowerCase();
  const weights = CATEGORY_WEIGHTS[category] || {};
  return Object.entries(weights).reduce((score, [term, weight]) => {
    if (!normalized.includes(term.toLowerCase())) return score;
    const phraseBonus = term.length > 2 ? Math.min(3, Math.floor(term.length / 3)) : 0;
    return score + weight + phraseBonus;
  }, 0);
}

function inferCategory(userRequest, selectedCategory) {
  if (selectedCategory?.value && CATEGORY_PROFILES[selectedCategory.value]) return selectedCategory.value;
  const scores = CATEGORY_MATCHERS
    .map(([category]) => ({ category, score: scoreCategory(userRequest, category) }))
    .sort((a, b) => b.score - a.score);
  if (!scores[0] || scores[0].score <= 0) return OTHER_CATEGORY;
  return scores[0].category;
}

function selectedRatioValue(value) {
  return value && value !== '自动判断' ? normalizeText(value) : '';
}

export function extractAspectRatio(userRequest, selectedRatio) {
  const explicit = String(userRequest || '').match(/(?:比例|画幅|画面比例|尺寸|aspect\s*ratio)?\s*(\d{1,2}\s*:\s*\d{1,2})/iu);
  if (explicit) return explicit[1].replace(/\s+/g, '');
  return selectedRatioValue(selectedRatio) || '根据内容自动匹配';
}

export function extractQuotedText(userRequest) {
  const matches = String(userRequest || '').match(/[“「『"]([^”」』"]{1,100})[”」』"]/g) || [];
  return matches.map((value) => value.slice(1, -1).trim()).filter(Boolean);
}

function extractLabeledText(userRequest) {
  const result = [];
  for (const pattern of LABEL_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of String(userRequest || '').matchAll(pattern)) {
      const value = cleanLine(match[1]);
      if (value && !/^(?:可选|选填|自动|清晰|准确|正确)$/iu.test(value)) result.push(value);
    }
  }
  return result;
}

export function extractRequiredText(userRequest) {
  return unique([...extractQuotedText(userRequest), ...extractLabeledText(userRequest)]).slice(0, 10);
}

export function extractNegativeRequirements(userRequest) {
  const matches = String(userRequest || '').match(/(?:不要|避免|禁止|不使用|不出现|排除|无需|拒绝|do not|don't|without|avoid)[^。！？\n；;]*/giu) || [];
  return unique(matches).slice(0, 12);
}

function extractNumberOfSubjects(userRequest) {
  const request = normalizeText(userRequest);
  if (hasAny(request, ['仅', '只', '单个', '一个主体', '一位', '一只', '一件', 'one subject', 'single subject'])) {
    return '只保留一个主要主体，不增加重复主体。';
  }
  const count = request.match(/(\d+)\s*(?:个|位|只|件|名)?\s*(?:人物|角色|产品|物体|主体|人|people|persons|characters|objects)/iu);
  return count ? `画面中安排约 ${count[1]} 个指定主体，保持数量一致。` : '';
}

function extractExplicitFields(userRequest, negativeRequirements = []) {
  const positiveRequest = negativeRequirements.reduce((value, clause) => value.replace(clause, ' '), String(userRequest || ''));
  return {
    styles: matchTerms(positiveRequest, STYLE_TERMS),
    composition: matchTerms(positiveRequest, COMPOSITION_TERMS),
    lighting: matchTerms(positiveRequest, LIGHTING_TERMS),
    colors: matchTerms(positiveRequest, COLOR_TERMS),
    camera: matchTerms(positiveRequest, CAMERA_TERMS),
    subjectCount: extractNumberOfSubjects(positiveRequest)
  };
}

function extractThemeName(userRequest) {
  const patterns = [
    /(?:主题|主题是|主题为|主题：)\s*[：是为]?\s*[“「『"]?([^”」』"\n，。！？；;]{1,80})/iu,
    /以\s*[“「『"]?([^”」』"\n，。！？；;]{1,80})[”」』"]?\s*为主题/iu
  ];
  for (const pattern of patterns) {
    const match = String(userRequest || '').match(pattern);
    if (match?.[1]) return cleanLine(match[1]);
  }
  return '';
}

function isProductMainRequest(userRequest, category) {
  if (category === 'Products & E-commerce') return true;
  return hasAny(userRequest, ['商品图', '产品摄影', '产品渲染', '商品主图', '电商主图', '产品详情页', '包装设计', 'product shot', 'product photography', 'product render']);
}

function isKnowledgeBaseRequest(ir) {
  return hasAny(`${ir?.task || ''} ${ir?.themeName || ''}`, [
    '知识库', '知识网络', '知识图谱', '信息架构', '信息被整理和连接', '资料被整理', '分类索引', 'knowledge base', 'knowledge network'
  ]);
}

function hasTextIntent(ir) {
  return Boolean(ir?.text?.required?.length) || (!ir?.constraints?.noText && hasAny(ir?.task, [
    '文字', '标题', '主标题', '副标题', '文案', '标语', '字体', '排版', 'logo', '字标', '字样', '唯一文字',
    '唯一可读文字', '显示', '写上', '写着', '写有', '印有', '标注', 'headline', 'slogan', 'typography', 'lettering'
  ]));
}

function isTextSpecificLine(value) {
  return hasAny(value, ['标题', '文字', '字体', '拼写', '文案', '字样', 'headline', 'typography', 'title', 'lettering']);
}

function isTextLedTemplate(template) {
  const title = displayText(template?.title);
  const description = displayText(template?.description);
  return hasAny(`${title} ${description}`, ['字体海报', '标题文字', 'title-led', 'typography poster']);
}

function templateLineCompatible(line, ir) {
  if (!hasTextIntent(ir) && isTextSpecificLine(line)) return false;
  if (ir.constraints.noExtraProps && hasAny(line, ['道具', '辅助物', 'props'])) return false;
  if (hasAny(ir.task, ['主图', '单品图', 'hero shot']) && hasAny(line, ['包装', '详情页', '版块', '卖点标签', '多模块'])) return false;
  return true;
}

function profileSubject(profile, category, ir) {
  if (isKnowledgeBaseRequest(ir)) {
    return '把 AI 知识库具体化为被收集、分类、索引、关联并形成层级结构的信息系统，不使用泛化的宇宙、山脉、植物或建筑来代替知识结构。';
  }
  if (category === 'Products & E-commerce' && ir.constraints.noText) {
    return '严格保持用户指定商品的外观、比例、颜色、结构和材质一致，不添加品牌、包装或可读标签。';
  }
  return profile.subject;
}

function profileFocus(profile, category, ir) {
  if (category === 'Products & E-commerce' && ir.constraints.noExtraProps) {
    return '把产品识别放在第一位，使用纯净背景和必要接触阴影，不加入辅助道具。';
  }
  return profile.focus;
}

function profileStructure(profile, category, ir) {
  if (isKnowledgeBaseRequest(ir)) {
    return hasTextIntent(ir)
      ? '以唯一文字作为一级视觉焦点，模块化信息块、索引卡片、节点和细线关系图作为次级结构，围绕文字建立清楚的阅读路径。'
      : '以模块化信息块、索引卡片、节点、分类标签和层级网格建立清楚的阅读路径，不依赖额外文字填充版面。';
  }
  if (category === 'Products & E-commerce' && ir.constraints.noExtraProps) {
    return '以产品为唯一主角，置于干净留白背景中，按产品轮廓、材质和关键结构建立视觉重点；只保留必要接触阴影，不使用辅助道具。';
  }
  if (category === 'Posters & Typography' && !hasTextIntent(ir)) {
    return '先确定一个主视觉焦点，再用主体、图形和留白建立阅读动线；不依赖额外文字填充版面。';
  }
  return profile.structure;
}

function profileLook(profile, category, ir) {
  if (isKnowledgeBaseRequest(ir)) {
    return '采用瑞士国际主义网格、当代编辑设计和现代信息可视化语言；信息结构是主角，辅助图形保持克制，不使用照片型素材、奢华地产或珠宝广告式材质，也不采用大型 3D 产品展示台。';
  }
  if (category === 'Posters & Typography' && !hasTextIntent(ir)) {
    return '具有明确版式系统的海报，主次对比强，图形、色彩和主体材质相互呼应，画面简洁而有记忆点。';
  }
  return profile.look;
}

function colorLightSection(category, ir) {
  if (isKnowledgeBaseRequest(ir)) {
    return '色彩以暖白、石灰灰、炭黑、深橄榄绿为主，可加入极少量哑光金属色；使用平面色块、细线和轻微纸面或印刷质感建立层级，不使用蓝紫霓虹、玻璃反射、摄影景深或廉价渐变。';
  }
  return '色彩数量适度，主色、辅助色和背景形成清楚的层级；光线方向、阴影、反射、景深和材质表现保持一致。';
}

function requestDetails(userRequest, category, ir) {
  const details = [];
  const request = ir.constraints.negative.reduce((value, clause) => value.replace(clause, ' '), String(userRequest || ''));
  const hasPeople = hasAny(request, ['人物', '女性', '男人', '女孩', '男孩', 'portrait', 'person', 'people', '角色']);
  const hasText = ir.text.required.length > 0 || hasAny(request, ['文字', '标题', '文案', '标语', 'logo', '字样', '显示', '写上', '写着', '写有', '印有', '标注', '字标']);
  if (hasPeople) details.push('人物的身份、面部、发型、服装、姿态和手部结构保持稳定，人物关系与视线方向清晰。');
  if (isProductMainRequest(request, category)) {
    details.push(ir.constraints.noText
      ? '产品外观、轮廓、材质和比例保持一致，不添加可读标签；光线和阴影要能说明产品体积与材质。'
      : '产品外观、轮廓、材质、标签和比例保持一致，光线和阴影要能说明产品体积与材质。');
  }
  if (hasText && !ir.constraints.noText) details.push('画面中的指定文字必须按原文显示，保持短句、清晰字形、正确拼写和足够留白。');
  if (category === 'UI & Interfaces') details.push('界面元素按照真实产品界面的层级排列，保证文字、按钮和图标不互相遮挡。');
  if (category === 'Charts & Infographics') details.push('信息关系优先于装饰，图表、箭头、编号、图例和标签必须一一对应。');
  if (ir.explicit.subjectCount) details.push(ir.explicit.subjectCount);
  return unique(details);
}

function chooseTemplate(templates, selectedTemplate, category, ir) {
  if (selectedTemplate) return selectedTemplate;
  const candidates = (templates || []).filter((template) => template.category === category);
  if (!candidates.length) return null;
  const request = `${ir.task} ${ir.explicit.styles.join(' ')} ${ir.explicit.composition.join(' ')}`.toLowerCase();
  const textIntent = hasTextIntent(ir);
  const scored = candidates.map((template, index) => {
    const templateTitle = displayText(template.title).toLowerCase();
    const text = [
      displayText(template.title),
      displayText(template.useWhen),
      ...(template.styles || []),
      ...(template.scenes || []),
      ...(template.tags || [])
    ].join(' ').toLowerCase();
    let score = 0;
    if (textIntent && hasAny(text, ['typography', '排版', '文字', '标题'])) score += 6;
    if (textIntent && hasAny(ir.task, ['标题', '主标题', '标语', '文案', '字体', 'headline', 'slogan']) && hasAny(templateTitle, ['typography', '字体', '标题'])) score += 5;
    if (!textIntent && isTextLedTemplate(template)) score -= 20;
    if (ir.explicit.composition.some((term) => text.includes(term.toLowerCase()))) score += 2;
    if (hasAny(request, ['电商', '商品', '产品', '包装']) && hasAny(text, ['product', 'commerce', '商品', '包装'])) score += 5;
    if (hasAny(request, ['信息图', '流程图', '图表', 'diagram', 'chart']) && hasAny(text, ['infographic', 'chart', 'diagram', '信息图'])) score += 5;
    if (hasAny(request, ['ui', '界面', '仪表盘', 'app']) && hasAny(text, ['ui', 'dashboard', 'screenshot'])) score += 5;
    return { template, score, index };
  });
  scored.sort((a, b) => b.score - a.score || a.index - b.index);
  return scored[0].score > 0 ? scored[0].template : null;
}

function extractTemplateLines(template, key, limit = 6) {
  const values = template?.[key]?.zh || template?.[key]?.en || [];
  return unique(Array.isArray(values) ? values : [values]).slice(0, limit);
}

function localTag(value) {
  const labels = {
    UI: '界面', Dashboard: '仪表盘', Screenshot: '截图', Infographic: '信息图', Charts: '图表', Education: '教育', Tech: '科技',
    Poster: '海报', Typography: '排版', Campaign: '传播活动', Realistic: '写实', Fashion: '时尚', Creative: '创意', Social: '社媒',
    Classical: '古典', Story: '叙事', History: '历史', Product: '商品', Commerce: '商业', Packaging: '包装', Food: '食品',
    Layout: '版式', Style: '风格', Brand: '品牌', Identity: '身份系统', Architecture: '建筑', Interior: '室内', Map: '地图',
    Photography: '摄影', Lens: '镜头', Scene: '场景', Travel: '旅行'
  };
  return labels[value] || value;
}

function templateDirection(template, ir, tags) {
  if (!template) return '';
  if (ir.category === 'Products & E-commerce' && hasAny(ir.task, ['主图', '单品图', 'hero shot'])) {
    return `补充视觉方向：商业商品主图，突出产品轮廓、材质和接触阴影${tags.length ? `；重点：${tags.join('、')}` : ''}。`;
  }
  return `补充视觉方向：${displayText(template.description)}${tags.length ? ` 重点：${tags.join('、')}。` : ''}`;
}

function resolveConstraints(ir, profile, template) {
  const warnings = [];
  const negative = [...ir.constraints.negative];
  const noText = ir.constraints.noText;
  const requiredText = ir.text.required;
  if (noText && requiredText.length) warnings.push('检测到“禁止文字”和“指定文字”同时出现；已优先保留用户指定的文字。');
  const templatePitfalls = extractTemplateLines(template, 'pitfalls').filter((line) => templateLineCompatible(line, ir));
  const templateGuidance = extractTemplateLines(template, 'guidance').filter((line) => templateLineCompatible(line, ir));
  const avoid = unique([
    ...profile.avoid,
    ...templatePitfalls,
    ...negative.map((value) => `用户明确要求：${value}`)
  ]);
  return { avoid, warnings, templateGuidance };
}

function buildTextSection(ir) {
  if (ir.constraints.noText && !ir.text.required.length) return '文字策略：不添加标题、Logo、水印、随机字符或无法核对的正文。';
  if (ir.text.required.length) return `必须出现的文字：${ir.text.required.map((value) => `“${value}”`).join('、')}。只显示这些用户指定的文字，按原文拼写，避免重复、错字、乱码和被主体遮挡。`;
  if (ir.themeName) return `文字策略：主题名称“${ir.themeName}”仅作为视觉语义，不自动排成可读文字；除非用户明确指定，否则不添加标题、Logo、水印、随机字符或伪造数据。`;
  return '文字策略：用户没有提供具体文字，不自行添加标题、Logo、水印、随机字符或伪造数据。';
}

function buildKnowledgeBaseSections(ir, explicit, template) {
  const templateDirection = template && !isTextLedTemplate(template)
    ? `补充方向：${displayText(template.description)}。`
    : '';
  const explicitDetails = ir.explicit.composition.length || ir.explicit.lighting.length || ir.explicit.colors.length || ir.explicit.camera.length
    ? buildExplicitSection(ir)
    : '';
  const avoid = unique([
    '蓝紫霓虹、赛博朋克、HUD 界面和廉价渐变',
    '照片型素材、宇宙、山脉、植物或建筑等泛化隐喻',
    '大型 3D 产品展示台、玻璃球、珠宝或地产广告式材质',
    ...ir.constraints.negative.map((value) => `用户明确要求：${value}`)
  ]);
  return [
    `任务：${ir.task || '制作一张 AI 知识库主题海报。'}`,
    '视觉语义：表现知识被收集、分类、索引、关联并形成结构化网络；使用模块化信息块、索引卡片、节点、分类标签、层级网格、细线关系图和数据库层叠结构，不用抽象自然景观代替知识结构。',
    '版式与层级：采用瑞士国际主义网格、当代编辑设计和现代信息可视化语言。建立稳定边距和清晰阅读路径，让信息结构成为主角，辅助图形保持次级，不使用中央产品展示台式构图。',
    '风格与质感：简洁、克制、专业，使用平面色块、细线和轻微纸面或印刷质感；不依靠玻璃反射、摄影景深或复杂 3D 材质制造高级感。',
    explicitDetails,
    '色彩：以暖白、石灰灰、炭黑、深橄榄绿为主，可加入极少量哑光金属色；避免蓝紫霓虹。',
    buildTextSection(ir),
    templateDirection,
    '输出：4:5 单幅中文科技海报，主体结构清楚、边距稳定、细节服务于知识主题；除用户明确指定的文字外，不添加 Logo、水印、随机文字或伪数据。',
    `禁止：\n${avoid.map((line) => `- ${line}`).join('\n')}`
  ];
}

function buildExplicitSection(ir) {
  const fields = [];
  if (ir.explicit.styles.length) fields.push(`风格关键词：${ir.explicit.styles.join('、')}`);
  if (ir.explicit.composition.length) fields.push(`构图关键词：${ir.explicit.composition.join('、')}`);
  if (ir.explicit.camera.length) fields.push(`镜头关键词：${ir.explicit.camera.join('、')}`);
  if (ir.explicit.lighting.length) fields.push(`光线关键词：${ir.explicit.lighting.join('、')}`);
  if (ir.explicit.colors.length) fields.push(`色彩关键词：${ir.explicit.colors.join('、')}`);
  return fields.length ? `用户明确指定：${fields.join('；')}。` : '';
}

function deDuplicatePromptSections(sections) {
  const seen = new Set();
  return sections.filter((section) => {
    const normalized = normalizeText(section).toLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export function parseImageRequest({ userRequest, aspectRatio, selectedCategory } = {}) {
  const task = String(userRequest || '').trim();
  const category = inferCategory(task, selectedCategory);
  const requiredText = extractRequiredText(task);
  const negative = extractNegativeRequirements(task);
  const themeName = extractThemeName(task);
  return {
    version: 'image-prompt-ir/1',
    task,
    category,
    themeName,
    ratio: extractAspectRatio(task, aspectRatio),
    text: {
      required: requiredText,
      source: requiredText.length ? 'explicit' : 'none'
    },
    explicit: extractExplicitFields(task, negative),
    constraints: {
      negative,
      noText: hasAny(negative.join(' '), ['文字', '标题', 'logo', '水印', '字符', 'text', 'lettering', 'typography']),
      noPeople: hasAny(negative.join(' '), ['人物', '人像', '角色', 'person', 'people', 'portrait']),
      noExtraProps: hasAny(negative.join(' '), ['道具', '辅助物', '多余物体', '无关物体', 'props'])
    }
  };
}

export function assessLocalImagePrompt({ ir, prompt, template, profile } = {}) {
  const checks = [];
  const text = normalizeText(prompt);
  const lines = String(prompt || '').split('\n').map(cleanLine).filter(Boolean);
  const duplicateCount = lines.length - new Set(lines.map((line) => line.toLowerCase())).size;
  const hasTask = Boolean(ir?.task && text.includes(normalizeText(ir.task)));
  const hasRatio = Boolean(ir?.ratio && text.includes(ir.ratio));
  const hasAutomaticRatio = ir?.ratio === '根据内容自动匹配';
  const hasCategory = Boolean(profile?.label && text.includes(profile.label)) || (isKnowledgeBaseRequest(ir) && text.includes('海报'));
  const hasRequiredText = (ir?.text?.required || []).every((value) => text.includes(value));
  const hasAvoid = text.includes('需要避免') || text.includes('禁止：');
  const textIntent = hasTextIntent(ir);
  const templateConflict = !textIntent && (isTextLedTemplate(template) || hasAny(text, ['字体成为画面主角', '标题层级', '保证标题拼写', '标题成为主视觉']));
  const personConflict = ir?.constraints?.noPeople && text.includes('人物的身份');
  const propConflict = ir?.constraints?.noExtraProps
    && hasAny(text, ['辅助道具', '辅助物', '增加道具'])
    && !hasAny(text, ['不使用辅助道具', '不增加道具', '不使用辅助物']);
  const warnings = [];
  let score = 0;
  if (hasTask) { score += 25; checks.push('保留原始需求'); } else warnings.push('原始需求没有完整保留');
  if (hasRatio && !hasAutomaticRatio) { score += 15; checks.push('包含画面比例'); }
  else if (hasAutomaticRatio) { score += 7; checks.push('包含比例策略'); }
  else warnings.push('缺少画面比例策略');
  if (hasCategory) { score += 15; checks.push('识别内容类型'); } else warnings.push('缺少内容类型');
  if (ir?.text?.required?.length && hasRequiredText) { score += 20; checks.push('保留指定文字'); }
  else if (ir?.text?.required?.length) warnings.push('指定文字没有全部保留');
  else if (text.includes('文字策略')) { score += 10; checks.push('明确文字策略'); }
  if (hasAvoid) { score += 15; checks.push('包含负面约束'); } else warnings.push('缺少负面约束');
  if (!duplicateCount) { score += 10; checks.push('无重复段落'); } else warnings.push(`发现 ${duplicateCount} 个重复段落`);
  if (templateConflict) { score -= 25; warnings.push('模板或规则与“未指定文字”的需求冲突'); }
  else checks.push('文字规则与需求一致');
  if (personConflict) { score -= 20; warnings.push('“不要人物”与人物细节规则冲突'); }
  if (propConflict) { score -= 15; warnings.push('“不要多余道具”与辅助道具规则冲突'); }
  if (text.length > 2400) warnings.push('Prompt 较长，可能需要进一步压缩');
  return {
    score: Math.max(0, Math.min(100, score - duplicateCount * 5)),
    status: warnings.length ? 'review' : 'ready',
    checks,
    warnings,
    template: displayText(template?.title, template?.id || '')
  };
}

export function compileLocalImagePrompt({
  userRequest,
  aspectRatio,
  selectedTemplate,
  selectedCategory,
  referenceCases,
  templates
} = {}) {
  const ir = parseImageRequest({ userRequest, aspectRatio, selectedCategory });
  const profile = CATEGORY_PROFILES[ir.category] || CATEGORY_PROFILES[OTHER_CATEGORY];
  const template = chooseTemplate(templates, selectedTemplate, ir.category, ir);
  const details = requestDetails(ir.task, ir.category, ir);
  const resolved = resolveConstraints(ir, profile, template);
  const explicit = buildExplicitSection(ir);
  const templateTags = unique([...(template?.styles || []), ...(template?.scenes || [])]
    .filter((tag) => tag !== 'Food' || hasAny(ir.task, ['食品', '食物', '饮料', '咖啡', '餐', 'food']))
    .map(localTag));
  const referenceTags = unique((referenceCases || []).flatMap((item) => [...(item?.styles || []), ...(item?.scenes || [])].filter(Boolean).map(localTag))).slice(0, 6);

  const sections = isKnowledgeBaseRequest(ir) ? buildKnowledgeBaseSections(ir, explicit, template) : [
    `生成任务：${ir.task || '根据以下视觉目标生成一张完整图片。'}`,
    `内容类型：${profile.label}。${profileFocus(profile, ir.category, ir)}`,
    `画面比例：${ir.ratio}。这是明确的输出约束；保持主体比例、视觉重心和边缘留白稳定。`,
    `主体与信息：${profileSubject(profile, ir.category, ir)}`,
    ...details,
    `场景与构图：${profileStructure(profile, ir.category, ir)}`,
    `风格与质感：${profileLook(profile, ir.category, ir)}`,
    explicit,
    `色彩与光线：${colorLightSection(ir.category, ir)}`,
    buildTextSection(ir),
    ir.explicit.subjectCount,
    templateDirection(template, ir, templateTags),
    template && resolved.templateGuidance.length
      ? `模板执行要点：${resolved.templateGuidance.join('；')}` : '',
    referenceTags.length ? `本地参考库提取的视觉标签：${referenceTags.join('、')}。只借鉴构图、层级或质感方法，不复制案例主题、文字或品牌。` : '',
    '输出要求：输出一张完成度高的单幅图像，主体明确，构图完整，细节服务于主题；严格遵守用户指定的对象、文字、风格、比例和用途，不擅自增加核心对象、品牌、Logo、文字或水印。',
    `需要避免：\n${resolved.avoid.map((line) => `- ${line}`).join('\n')}`
  ];
  const prompt = deDuplicatePromptSections(sections).join('\n\n');
  const quality = assessLocalImagePrompt({ ir, prompt, template, profile });
  return { prompt, ir, template, quality, warnings: resolved.warnings };
}

export function buildLocalImagePrompt(args) {
  return compileLocalImagePrompt(args).prompt;
}

export { CATEGORY_PROFILES };
