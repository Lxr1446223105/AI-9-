
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GeminiService } from './services/geminiService';
import { ShotType, GeneratedPrompt, StoryboardShot } from './types';
import { DEFAULT_SHOTS } from './constants';
import { ShotSelector } from './components/ShotSelector';
import { 
  Camera, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Image as ImageIcon,
  X,
  Plus,
  Trash2,
  ChevronRight,
  Info,
  Zap,
  HelpCircle,
  RotateCw,
  ArrowLeftRight,
  Languages,
  LayoutGrid,
  GripVertical,
  BookOpen
} from 'lucide-react';

const gemini = new GeminiService();

const Tooltip = ({ children, content, position = 'top' }: { children: React.ReactNode, content: string, position?: 'top' | 'bottom' | 'left' | 'right' }) => {
  const [show, setShow] = useState(false);
  const positions = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2"
  };
  const arrows = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-zinc-800",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-zinc-800",
    left: "left-full top-1/2 -translate-y-1/2 border-l-zinc-800",
    right: "right-full top-1/2 -translate-y-1/2 border-r-zinc-800"
  };
  return (
    <div className="relative inline-flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className={`absolute ${positions[position]} px-3 py-1.5 bg-zinc-800 text-zinc-100 text-[10px] font-medium rounded-lg shadow-2xl whitespace-nowrap z-[100] pointer-events-none border border-zinc-700 animate-in fade-in zoom-in-95 duration-200`}>
          {content}
          <div className={`absolute border-4 border-transparent ${arrows[position]}`}></div>
        </div>
      )}
    </div>
  );
};

const TRANSLATIONS = {
  english: {
    appName: "Storyboard Grid",
    proGen: "Pro Generator",
    reset: "Reset everything",
    step1Title: "Reference Images",
    step1Tooltip: "Upload references for character consistency.",
    camera: "Camera",
    cameraTooltip: "Take a photo",
    addRef: "Add Ref",
    addRefTooltip: "Add images",
    analyzeBtn: "Reverse Scene Prompt",
    analyzeBtnLoading: "Analyzing...",
    analyzeBtnTooltip: "AI image analysis",
    step2Title: "Scene Context",
    step2Tooltip: "Refine context details.",
    textareaPlaceholder: "Describe character, clothing, lighting...",
    stepStoryTitle: "Story Requirements",
    stepStoryTooltip: "Provide the plot or narrative requirements for this sequence.",
    storyPlaceholder: "e.g. A high-speed chase ending in a narrow alley...",
    step3Title: "Grid Shots (3x3)",
    step3Tooltip: "Set specific shot details.",
    generateBtn: "GENERATE 3X3 PROMPT",
    generateBtnLoading: "GENERATING...",
    generateBtnTooltip: "Generate master prompt.",
    footerNote: "Optimized for Flux, Midjourney, SD.",
    masterPrompt: "Master Prompt",
    consistencyBadge: "High Consistency",
    gridBadge: "3x3 Cinematic Grid",
    readyTitle: "Ready for Synthesis",
    readyDesc: "Upload your references to begin.",
    stepUpload: "Upload",
    stepAnalyze: "Analyze",
    stepGenerate: "Generate",
    craftingTitle: "Crafting...",
    craftingDesc: "Generating shot sequence",
    copyBtn: "COPY PROMPT",
    copiedBtn: "COPIED",
    copyTooltip: "Copy to clipboard",
    layout: "Layout",
    aspect: "AspectRatio",
    resolution: "Resolution",
    verified: "Verified",
    guide1Title: "Visual Consistency",
    guide1Desc: "AI extracts visual descriptors to maintain subject identity.",
    guide2Title: "Cinematic Grid",
    guide2Desc: "9 coherent tiles generated in a single prompt.",
    guide3Title: "Deploy",
    guide3Desc: "Paste into Midjourney or Flux engines.",
    cameraModalTitle: "Snapshot",
    cameraSnapTooltip: "Snap",
    cameraModalGuide: "Position subject",
    clearConfirm: "Clear all data?",
    switchCamera: "Switch Camera",
    refreshShot: "AI Suggest",
    syncBtn: "Sync to Inputs",
    syncTooltip: "Sync AI results back to frame inputs.",
    syncedMsg: "Synced",
    contextLangEn: "EN",
    contextLangCn: "CN",
    contextLangTooltip: "Toggle editing language",
    shotLangTooltip: "Toggle grid description language",
  },
  chinese: {
    appName: "分镜网格生成器",
    proGen: "专业版",
    reset: "重置所有内容",
    step1Title: "参考图上传",
    step1Tooltip: "上传图片以确保角色一致性。",
    camera: "相机拍摄",
    cameraTooltip: "打开摄像头",
    addRef: "添加图片",
    addRefTooltip: "选择图片文件",
    analyzeBtn: "反推场景提示词",
    analyzeBtnLoading: "分析中...",
    analyzeBtnTooltip: "AI 分析参考图",
    step2Title: "场景上下文",
    step2Tooltip: "细化角色与环境描述。",
    textareaPlaceholder: "描述角色、服装、光影...",
    stepStoryTitle: "故事要求",
    stepStoryTooltip: "描述故事情节的发展或分镜的具体叙事要求。",
    storyPlaceholder: "例如：一场在窄巷中结束的高速追逐戏...",
    step3Title: "网格分镜 (3x3)",
    step3Tooltip: "设置每个镜头的具体描述。",
    generateBtn: "生成 3x3 提示词",
    generateBtnLoading: "生成中...",
    generateBtnTooltip: "生成大师级分镜提示词。",
    footerNote: "已针对 Flux, Midjourney, SD 优化。",
    masterPrompt: "大师级提示词",
    consistencyBadge: "高一致性",
    gridBadge: "3x3 电影级网格",
    readyTitle: "准备合成",
    readyDesc: "上传角色或场景参考图以开始。",
    stepUpload: "上传",
    stepAnalyze: "分析",
    stepGenerate: "生成",
    craftingTitle: "正在打造...",
    craftingDesc: "正在同步分镜逻辑",
    copyBtn: "复制提示词",
    copiedBtn: "已复制",
    copyTooltip: "复制到剪贴板",
    layout: "布局",
    aspect: "画幅",
    resolution: "分辨率",
    verified: "一致性验证",
    guide1Title: "视觉一致性",
    guide1Desc: "AI 提取视觉描述符以保持主体身份。",
    guide2Title: "电影级网格",
    guide2Desc: "通过单条提示词生成 9 宫格镜头。",
    guide3Title: "一键部署",
    guide3Desc: "直接粘贴到 Midjourney 或 Flux 绘图引擎。",
    cameraModalTitle: "参考抓拍",
    cameraSnapTooltip: "拍照",
    cameraModalGuide: "请将主体置于框内",
    clearConfirm: "确定要清除所有内容吗？",
    switchCamera: "切换摄像头",
    refreshShot: "AI 建议",
    syncBtn: "填入镜头描述",
    syncTooltip: "将 AI 扩充的分镜同步回输入框以便微调。",
    syncedMsg: "已同步",
    contextLangEn: "英文",
    contextLangCn: "中文",
    contextLangTooltip: "切换编辑语言",
    shotLangTooltip: "切换分镜描述语言",
  }
};

export default function App() {
  const [images, setImages] = useState<string[]>([]);
  const [context, setContext] = useState({ english: '', chinese: '' });
  const [storyRequirements, setStoryRequirements] = useState({ english: '', chinese: '' });
  const [mainEditLang, setMainEditLang] = useState<'english' | 'chinese'>('english');
  const [shots, setShots] = useState<StoryboardShot[]>(
    DEFAULT_SHOTS.map((type, idx) => ({ id: idx, type, en: '', cn: '' }))
  );
  const [shotEditLang, setShotEditLang] = useState<'en' | 'cn'>('en');
  const [refreshingShots, setRefreshingShots] = useState<Record<number, boolean>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [language, setLanguage] = useState<'english' | 'chinese'>('english');
  const [copied, setCopied] = useState(false);
  const [synced, setSynced] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<VideoFacingModeEnum>('user');
  
  // Resizing state
  const [sidebarWidth, setSidebarWidth] = useState(520);
  const [isResizing, setIsResizing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const t = TRANSLATIONS[language];

  // Sync edit langs when global language changes
  useEffect(() => {
    setMainEditLang(language);
    setShotEditLang(language === 'english' ? 'en' : 'cn');
  }, [language]);

  // Handle resizing logic
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 380 && newWidth < 900) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (confirm(t.clearConfirm)) {
      setImages([]);
      setContext({ english: '', chinese: '' });
      setStoryRequirements({ english: '', chinese: '' });
      setGeneratedPrompt(null);
      setShots(DEFAULT_SHOTS.map((type, idx) => ({ id: idx, type, en: '', cn: '' })));
    }
  };

  const startCamera = async (mode: VideoFacingModeEnum = 'user') => {
    setIsCameraOpen(true);
    setFacingMode(mode);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setIsCameraOpen(false);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const toggleCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    startCamera(newMode);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImages(prev => [...prev, dataUrl].slice(0, 5));
        stopCamera();
      }
    }
  };

  const analyzeImages = async () => {
    if (images.length === 0) return;
    setIsAnalyzing(true);
    try {
      const bilingualResult = await gemini.analyzeImages(images);
      setContext(bilingualResult);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefreshShot = async (index: number) => {
    const base = context.english || context.chinese;
    if (!base) return;
    setRefreshingShots(prev => ({ ...prev, [index]: true }));
    try {
      const res = await gemini.suggestShotDescription(base, shots[index].type);
      updateShot(index, { en: res.en, cn: res.cn });
    } catch (error) {
      console.error("Shot suggestion failed", error);
    } finally {
      setRefreshingShots(prev => ({ ...prev, [index]: false }));
    }
  };

  const syncToInputs = () => {
    if (!generatedPrompt) return;
    
    const newShots = shots.map((shot, idx) => ({
      ...shot,
      en: generatedPrompt.shotDescriptionsEn[idx] || shot.en,
      cn: generatedPrompt.shotDescriptionsCn[idx] || shot.cn
    }));
    
    setShots(newShots);
    setSynced(true);
    setTimeout(() => setSynced(false), 2000);
  };

  const generatePrompt = async () => {
    const baseDesc = context.english || context.chinese;
    const storyReqs = storyRequirements.english || storyRequirements.chinese;
    if (!baseDesc) return;
    setIsGenerating(true);
    try {
      const promptData = await gemini.generateStoryboardPrompt(
        baseDesc,
        shots,
        storyReqs
      );
      setGeneratedPrompt(promptData);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateShot = (index: number, updates: Partial<StoryboardShot>) => {
    const newShots = [...shots];
    newShots[index] = { ...newShots[index], ...updates };
    setShots(newShots);
  };

  const copyToClipboard = () => {
    if (!generatedPrompt) return;
    const text = language === 'english' ? generatedPrompt.english : generatedPrompt.chinese;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col md:flex-row h-screen overflow-hidden bg-zinc-950 text-zinc-100 ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      {/* Sidebar: Controls */}
      <aside 
        style={{ width: `${sidebarWidth}px`, flexShrink: 0 }}
        className="hidden md:flex bg-zinc-950 border-r border-zinc-800/50 flex-col overflow-y-auto p-6 gap-8 custom-scrollbar relative"
      >
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-600/20">
              <Sparkles className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight leading-tight">
                {t.appName}
              </h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{t.proGen}</p>
            </div>
          </div>
          <Tooltip content={t.reset} position="left">
            <button 
              onClick={clearAll}
              className="p-2.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
            >
              <Trash2 size={20} />
            </button>
          </Tooltip>
        </header>

        {/* Global Edit Language Toggle */}
        <div className="flex items-center justify-end px-1">
          <div className="flex items-center bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
            <Tooltip content={t.contextLangTooltip}>
              <div className="flex gap-1">
                <button 
                  onClick={() => setMainEditLang('english')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${mainEditLang === 'english' ? 'bg-zinc-800 text-white shadow-xl ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {t.contextLangEn}
                </button>
                <button 
                  onClick={() => setMainEditLang('chinese')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${mainEditLang === 'chinese' ? 'bg-zinc-800 text-white shadow-xl ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {t.contextLangCn}
                </button>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Step 1: Reference Images */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 bg-zinc-800 rounded-lg flex items-center justify-center text-[11px] text-zinc-400 font-black">01</span>
                {t.step1Title}
              </h2>
              <Tooltip content={t.step1Tooltip}>
                <HelpCircle size={14} className="text-zinc-700 hover:text-zinc-500 cursor-help transition-colors" />
              </Tooltip>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => startCamera('user')}
                className="text-[10px] font-black text-zinc-400 hover:text-white transition-colors flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800"
              >
                <Camera size={14} /> {t.camera}
              </button>
              <span className="text-[10px] font-black text-zinc-600 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center">
                {images.length}/5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 ring-2 ring-transparent hover:ring-blue-500/50 transition-all">
                <img src={img} className="w-full h-full object-cover" alt={`Ref ${idx}`} />
                <button 
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 text-white shadow-xl"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square w-full rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-1 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400 hover:bg-zinc-900/50 transition-all group"
              >
                <Plus size={24} className="group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />
          
          <button
            onClick={analyzeImages}
            disabled={images.length === 0 || isAnalyzing}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all bg-zinc-100 text-zinc-950 hover:bg-white disabled:bg-zinc-900 disabled:text-zinc-700 shadow-xl shadow-white/5 active:scale-95"
          >
            {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
            {isAnalyzing ? t.analyzeBtnLoading : t.analyzeBtn}
          </button>
        </section>

        {/* Step 2: Context */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-zinc-800 rounded-lg flex items-center justify-center text-[11px] text-zinc-400 font-black">02</span>
              {t.step2Title}
            </h2>
          </div>
          <div className="relative group">
            <textarea
              value={context[mainEditLang]}
              onChange={(e) => setContext(prev => ({ ...prev, [mainEditLang]: e.target.value }))}
              placeholder={t.textareaPlaceholder}
              className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 resize-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700 leading-relaxed custom-scrollbar shadow-inner"
            />
            <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none group-focus-within:opacity-60 transition-opacity">
               <Languages size={20} className="text-zinc-400" />
            </div>
          </div>
        </section>

        {/* New Step: Story Requirements */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-zinc-800 rounded-lg flex items-center justify-center text-[11px] text-zinc-400 font-black">2.5</span>
              {t.stepStoryTitle}
            </h2>
            <Tooltip content={t.stepStoryTooltip}>
              <HelpCircle size={14} className="text-zinc-700 hover:text-zinc-500 cursor-help transition-colors" />
            </Tooltip>
          </div>
          <div className="relative group">
            <textarea
              value={storyRequirements[mainEditLang]}
              onChange={(e) => setStoryRequirements(prev => ({ ...prev, [mainEditLang]: e.target.value }))}
              placeholder={t.storyPlaceholder}
              className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 resize-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700 leading-relaxed custom-scrollbar shadow-inner"
            />
            <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none group-focus-within:opacity-60 transition-opacity">
               <BookOpen size={20} className="text-zinc-400" />
            </div>
          </div>
        </section>

        {/* Step 3: Shots */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-zinc-800 rounded-lg flex items-center justify-center text-[11px] text-zinc-400 font-black">03</span>
              {t.step3Title}
            </h2>
          </div>
          
          <ShotSelector 
            shots={shots} 
            onChange={updateShot} 
            onRefresh={handleRefreshShot}
            refreshingShots={refreshingShots}
            language={language}
            shotEditLang={shotEditLang}
            t={t}
          />
          
          <div className="pt-4 pb-8">
            <button
              onClick={generatePrompt}
              disabled={(!context.english && !context.chinese) || isGenerating}
              className="w-full py-5 rounded-[24px] flex items-center justify-center gap-4 font-black text-sm tracking-[0.2em] uppercase transition-all bg-blue-600 text-white hover:bg-blue-500 disabled:bg-zinc-900 disabled:text-zinc-700 shadow-2xl shadow-blue-600/30 active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {isGenerating ? <RefreshCw className="animate-spin relative z-10" size={24} /> : <LayoutGrid className="relative z-10" size={24} />}
              <span className="relative z-10">{isGenerating ? t.generateBtnLoading : t.generateBtn}</span>
            </button>
          </div>
        </section>

        <footer className="mt-auto pt-6 text-[10px] text-zinc-700 flex items-center gap-2 border-t border-zinc-900/50">
          <Info size={14} />
          <span className="font-bold uppercase tracking-widest">{t.footerNote}</span>
        </footer>
      </aside>

      {/* Resize Handle */}
      <div 
        onMouseDown={startResizing}
        className="hidden md:flex w-1.5 bg-zinc-900 hover:bg-blue-600/50 cursor-col-resize transition-colors items-center justify-center relative z-10"
      >
        <div className="h-8 w-px bg-zinc-700"></div>
        <div className="absolute left-1/2 -translate-x-1/2 p-0.5 bg-zinc-800 border border-zinc-700 rounded-full opacity-0 hover:opacity-100 transition-opacity">
          <GripVertical size={10} className="text-zinc-400" />
        </div>
      </div>

      {/* Main Area: Result */}
      <main className="flex-1 bg-zinc-900/30 flex flex-col p-6 md:p-14 overflow-y-auto relative">
        <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/60 pb-10 mb-10">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter">{t.masterPrompt}</h2>
              <div className="flex items-center gap-3 mt-4">
                <span className="px-3 py-1 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">{t.consistencyBadge}</span>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest">{t.gridBadge}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-[20px] border border-zinc-800 shadow-2xl ring-1 ring-white/5">
              <button 
                onClick={() => setLanguage('english')}
                className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${language === 'english' ? 'bg-zinc-800 text-white shadow-xl ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                ENGLISH
              </button>
              <button 
                onClick={() => setLanguage('chinese')}
                className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${language === 'chinese' ? 'bg-zinc-800 text-white shadow-xl ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                中文
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {!generatedPrompt && !isGenerating ? (
              <div className="flex-1 border-2 border-dashed border-zinc-800/40 rounded-[48px] flex flex-col items-center justify-center text-zinc-600 gap-8 group hover:border-zinc-700/50 transition-all animate-in fade-in duration-700">
                <div className="p-10 bg-zinc-950 rounded-[40px] border border-zinc-800 shadow-3xl group-hover:scale-105 transition-transform">
                  <Sparkles size={72} className="text-zinc-800 animate-pulse" />
                </div>
                <div className="text-center space-y-4">
                  <p className="text-2xl font-black text-zinc-400 tracking-tight">{t.readyTitle}</p>
                  <p className="text-sm max-w-sm text-zinc-600 font-medium leading-relaxed">
                    {t.readyDesc}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
                  <span className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-500" /> {t.stepUpload}</span>
                  <span className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-500" /> {t.stepAnalyze}</span>
                  <span className="flex items-center gap-2"><ChevronRight size={14} className="text-blue-500" /> {t.stepGenerate}</span>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-12">
                <div className="relative">
                  <div className="w-32 h-32 border-[6px] border-zinc-800 rounded-full"></div>
                  <div className="absolute inset-0 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={48} className="text-blue-500 animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <p className="text-3xl font-black text-white tracking-tighter">{t.craftingTitle}</p>
                  <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">{t.craftingDesc}</p>
                </div>
              </div>
            ) : (
              <div className="relative group animate-in fade-in slide-in-from-bottom-6 duration-700 flex-1 flex flex-col min-h-0">
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[40px] blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-zinc-950 border border-zinc-800 rounded-[40px] overflow-hidden shadow-3xl flex-1 flex flex-col min-h-0">
                  {/* Prompt Header */}
                  <div className="flex flex-wrap items-center justify-between px-10 py-7 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl gap-4 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.4)]"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_12px_rgba(234,179,8,0.4)]"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_12px_rgba(34,197,94,0.4)]"></div>
                      </div>
                      <span className="ml-6 text-[11px] text-zinc-500 font-mono tracking-[0.3em] uppercase font-black">Cohesive_Grid_Output.txt</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={syncToInputs}
                        className="flex items-center gap-3 px-6 py-3 bg-zinc-900 text-zinc-100 rounded-2xl text-[11px] font-black hover:bg-zinc-800 transition-all active:scale-95 border border-zinc-800 shadow-xl"
                      >
                        {synced ? <Check size={18} className="text-green-500" /> : <ArrowLeftRight size={18} />}
                        {synced ? t.syncedMsg : t.syncBtn}
                      </button>
                      <button 
                        onClick={copyToClipboard}
                        className="flex items-center gap-3 px-8 py-3 bg-white text-zinc-950 rounded-2xl text-[11px] font-black hover:bg-zinc-100 transition-all active:scale-95 shadow-3xl shadow-white/5 ring-4 ring-white/10"
                      >
                        {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                        {copied ? t.copiedBtn : t.copyBtn}
                      </button>
                    </div>
                  </div>
                  
                  {/* Prompt Body */}
                  <div className="p-10 md:p-14 overflow-y-auto flex-1 custom-scrollbar scroll-smooth">
                    <pre className="whitespace-pre-wrap text-zinc-300 font-mono text-sm md:text-base leading-relaxed selection:bg-blue-600 selection:text-white tracking-tight">
                      {language === 'english' ? generatedPrompt?.english : generatedPrompt?.chinese}
                    </pre>
                  </div>

                  {/* Prompt Footer */}
                  <div className="px-10 py-7 bg-zinc-900/50 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-6 sticky bottom-0 z-20">
                    <div className="flex gap-10">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">{t.layout}</span>
                        <span className="text-sm text-zinc-400 font-black">3x3 Cinematic</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">{t.aspect}</span>
                        <span className="text-sm text-zinc-400 font-black">16:9 HD</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">{t.resolution}</span>
                        <span className="text-sm text-zinc-400 font-black">8K Ultra</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-green-500/5 border border-green-500/20 rounded-xl shadow-inner">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[11px] font-black text-green-500/80 tracking-widest uppercase">{t.verified}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/95 backdrop-blur-md p-6">
          <div className="bg-zinc-900 rounded-[48px] border border-zinc-800 overflow-hidden max-w-2xl w-full shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <Camera className="text-blue-500" size={24} /> {t.cameraModalTitle}
              </h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleCamera}
                  className="p-3 text-zinc-400 hover:text-white transition-all bg-zinc-800 rounded-2xl border border-zinc-700 hover:border-blue-500"
                >
                  <RotateCw size={20} />
                </button>
                <button onClick={stopCamera} className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-2xl transition-all">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="relative aspect-video bg-black group/camera">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 border-[40px] border-black/50 m-12 rounded-[40px] group-hover:opacity-40 transition-opacity">
              </div>
            </div>
            <div className="p-12 flex flex-col items-center gap-8">
              <button 
                onClick={capturePhoto}
                className="group relative w-24 h-24 rounded-full bg-zinc-800 p-2 border-[6px] border-zinc-700 hover:border-blue-500 transition-all active:scale-90 shadow-2xl"
              >
                <div className="w-full h-full rounded-full bg-white group-hover:bg-blue-500 transition-colors shadow-inner"></div>
              </button>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">
                {t.cameraModalGuide}
              </p>
            </div>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
