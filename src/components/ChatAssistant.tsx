import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Flame,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  TrendingUp,
  MessageSquareText,
  Wand2,
  Volume2,
  ShieldAlert,
  Zap,
  Target,
  RefreshCw,
  AtSign,
  Users,
  Compass
} from 'lucide-react';
import { 
  ChatMessage, 
  InstagramScript, 
  ProfileAuditResult, 
  DialectEnhancementResult, 
  IraqiDialect 
} from '../types';

interface ChatAssistantProps {
  currentScript: InstagramScript | null;
  onUseReelIdea?: (hook: string, topic: string) => void;
  onUseDialectText?: (text: string) => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  currentScript, 
  onUseReelIdea,
  onUseDialectText
}) => {
  // Navigation between the 3 specialized sub-tools of Content Strategist
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'dialect' | 'chat'>('audit');

  // -------------------------------------------------------------
  // 1. Profile & Stats Audit State
  // -------------------------------------------------------------
  const [auditUsername, setAuditUsername] = useState('');
  const [auditNiche, setAuditNiche] = useState('مطاعم وتجارب أكل');
  const [auditFollowers, setAuditFollowers] = useState('5K - 20K متابع');
  const [auditNotes, setAuditNotes] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<ProfileAuditResult | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [copiedReplacementIndex, setCopiedReplacementIndex] = useState<number | null>(null);
  const [copiedHook, setCopiedHook] = useState(false);

  const nicheOptions = [
    'مطاعم وتجارب أكل 🍔',
    'تقنية وموبايلات وتطبيقات 📱',
    'ملابس وموضة وتجارة إلكترونية 👗',
    'بودكاست وسوالف وقصص واقعية 🎙️',
    'سيارات وميكانيك 🚗',
    'صحة ولياقة وبناء أجسام 🏋️',
    'عقارات ومشاريع استثمارية 🏢',
    'تعليم ولغات ودورات تدريبية 📚',
    'فلوقات ويوميات عائلية 📹',
    'صالونات وتجميل وعناية 💅',
  ];

  const followerRanges = [
    'أقل من 5 آلاف (بداية الطريق) 🌱',
    '5K - 20K متابع (مرحلة التأسيس) 🚀',
    '20K - 100K متابع (نمو وتفاعل متصاعد) 📈',
    'أكثر من 100K متابع (صانع محتوى محترف) 👑',
  ];

  const handleRunAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUser = auditUsername.replace(/^@/, '').trim();
    if (!cleanUser) {
      setAuditError('يرجى كتابة اسم المستخدم (اليوزر) لحساب الإنستغرام.');
      return;
    }

    setIsAuditing(true);
    setAuditError(null);

    try {
      const response = await fetch('/api/audit-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUser,
          niche: auditNiche,
          followersCount: auditFollowers,
          notes: auditNotes,
        }),
      });

      const data = await response.json();
      if (data.success && data.audit) {
        setAuditResult(data.audit);
      } else {
        setAuditError(data.error || 'تعذر تقييم الحساب، يرجى المحاولة مرة أخرى.');
      }
    } catch {
      setAuditError('تعذر الاتصال بالخادم، يرجى التحقق من الاتصال.');
    } finally {
      setIsAuditing(false);
    }
  };

  const copyToClipboard = (text: string, type: 'hook' | 'replacement', index?: number) => {
    navigator.clipboard.writeText(text);
    if (type === 'hook') {
      setCopiedHook(true);
      setTimeout(() => setCopiedHook(false), 2000);
    } else if (type === 'replacement' && typeof index === 'number') {
      setCopiedReplacementIndex(index);
      setTimeout(() => setCopiedReplacementIndex(null), 2000);
    }
  };

  // -------------------------------------------------------------
  // 2. Iraqi Dialect Enhancer State
  // -------------------------------------------------------------
  const [dialectInput, setDialectInput] = useState('');
  const [selectedDialect, setSelectedDialect] = useState<IraqiDialect>('baghdadi');
  const [spiceLevel, setSpiceLevel] = useState<'light' | 'medium' | 'high'>('medium');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementResult, setEnhancementResult] = useState<DialectEnhancementResult | null>(null);
  const [enhancementError, setEnhancementError] = useState<string | null>(null);
  const [copiedEnhancedText, setCopiedEnhancedText] = useState(false);

  const sampleDialectSentences = [
    { label: 'إعلان تجاري جاف', text: 'يسرنا أن نعلن عن توفر منتجاتنا بأفضل الأسعار مع ضمان شامل وتوصيل لكافة المحافظات.' },
    { label: 'مقدمة فيديو تقليدية', text: 'السلام عليكم ورحمة الله، اليوم سأشرح لكم ثلاث نصائح مهمة جداً لزيادة التركيز.' },
    { label: 'سؤال وتفاعل', text: 'ما هو رأيكم في هذا الموضوع وهل تواجهون صعوبة في تنظيم وقتكم؟ شاركونا في التعليقات.' },
  ];

  const handleEnhanceDialect = async () => {
    if (!dialectInput.trim()) {
      setEnhancementError('اكتب أو الصق النص اللي تريد تطوره للهجة العراقية.');
      return;
    }

    setIsEnhancing(true);
    setEnhancementError(null);

    try {
      const response = await fetch('/api/enhance-dialect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: dialectInput,
          targetDialect: selectedDialect,
          spiceLevel: spiceLevel === 'high' ? 'شعبي ناري وعفوي' : spiceLevel === 'medium' ? 'متوسط دارج ومحبوب' : 'خفيف ومناسب للشركات',
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setEnhancementResult(data.data);
      } else {
        setEnhancementError(data.error || 'تعذر تطوير النص.');
      }
    } catch {
      setEnhancementError('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // -------------------------------------------------------------
  // 3. Chat with Abu Al-Fuhood State
  // -------------------------------------------------------------
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      content:
        'هلا والله بيك عيوني! أني "أبو الفهود"، مستشارك لصناعة محتوى الإنستغرام والريلز بالعراق. شلون أكدر أساعدك اليوم؟ اسألني عن خوارزميات إنستغرام بالعراق، أفكار الترندات، أو شلون تخلي فيديوهاتك تتصدر الإكسبلور!',
      timestamp: 'الآن',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    { label: 'فحص حسابي تلقائياً 🔍 (@...)', query: 'أبو الفهود، قيم هذا الحساب تلقائياً وانطيني الخطة بدون ما تسألني أي سؤال: @' },
    { label: 'أفضل أوقات النشر بالعراق ⏰', query: 'شنو أفضل أوقات النشر على إنستغرام بالعراق اللي تجيب أعلى تفاعل ومشاهدات؟' },
    { label: 'أفكار ريلز لزيادة المبيعات 🛍️', query: 'عندي صفحة بيع منتجات بالعراق، انطيني 3 أفكار ريلز تسويقية ذكية تزيد المبيعات بدون ما تبين إعلان ممل.' },
    { label: 'شلون أزيد وقت المشاهدة (Watch Time)؟ 📈', query: 'شنو التكتيكات اللي تخلي المشاهد العراقي يكمل الريلز للثانية الأخيرة وما يسوي سكرول؟' },
    { label: 'سر وصول الريلز للإكسبلور العراقي 🚀', query: 'شلون يشتغل خوارزمية إنستغرام حالياً بالعراق حتى الفيديو ينفجر ويوصل إكسبلور؟' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeSubTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, activeSubTab]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentScript: currentScript ? { title: currentScript.title } : null,
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const fallbackMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          content: 'والله السيرفر صار بيه ضغط دقيقة، جرب تسألني بعد شوية عيوني!',
          timestamp: 'الآن',
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: 'تعذر الاتصال بالخادم، يرجى المحاولة بعد لحظات.',
        timestamp: 'الآن',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Strategist Header & Sub-Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-7 h-7 text-amber-400" />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  أبو الفهود • مستشار المحتوى والريلز العراقي
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                  ذكاء اصطناعي عراقي 🇮🇶
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                فحص حسابك باليوزر، تقييم الإحصائيات، وتطوير لهجة محتواك لتتصدر الإكسبلور
              </p>
            </div>
          </div>

          {currentScript && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 max-w-xs truncate">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">السكربت النشط: {currentScript.title}</span>
            </div>
          )}
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'audit'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <AtSign className="w-4 h-4" />
            <span>فحص وتقييم البروفايل باليوزر</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeSubTab === 'audit' ? 'bg-slate-950/30 text-slate-950' : 'bg-amber-500/20 text-amber-300'}`}>
              جديد 🔥
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('dialect')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'dialect'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>تطوير اللهجة العراقية</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeSubTab === 'dialect' ? 'bg-slate-950/30 text-slate-950' : 'bg-emerald-500/20 text-emerald-300'}`}>
              مطور لهجة ✨
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'chat'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span>استشارة وسوالف مع أبو الفهود</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: Profile & Stats Audit                          */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* SUB-TAB 1: Profile & Stats Audit                          */}
      {/* ========================================================= */}
      {activeSubTab === 'audit' && (
        <div className="space-y-6">
          
          {/* Audit Input Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>فحص وتقييم فوري تلقائي 100% بدون أي أسئلة</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                دز يوزرك فقط.. وأبو الفهود يقيم بروفايلك واحصائياتك تلقائياً 🔍
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                لا داعي للإجابة عن أي أسئلة! الذكاء الاصطناعي يستنتج نيش الحساب، جودة البايو، نسبة الأصالة في اللهجة العراقية، ويكشف 3 أخطاء تقتل وصول الفيديوهات (Reach Killers) مع هوك وتكتيكات إكسبلور مفصلة لليوزر مالتك.
              </p>
            </div>

            <form onSubmit={handleRunAudit} className="mt-6 space-y-4">
              {/* Primary 1-Click Username Input */}
              <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-950 border-2 border-amber-500/40 focus-within:border-amber-400 transition-all flex flex-col sm:flex-row items-center gap-2 shadow-inner">
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-amber-400 font-bold text-lg">
                    @
                  </div>
                  <input
                    type="text"
                    value={auditUsername}
                    onChange={(e) => setAuditUsername(e.target.value)}
                    placeholder="اكتب يوزر الإنستغرام هنا.. مثلاً: baghdad_foodies"
                    dir="ltr"
                    className="w-full bg-transparent border-none pr-10 pl-4 py-3.5 text-base sm:text-lg text-white placeholder:text-slate-500 focus:outline-none font-mono text-left font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuditing || !auditUsername.trim()}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isAuditing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                      <span>ديفحص الحساب تلقائياً...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-slate-950" />
                      <span>فحص وتقييم الحساب تلقائياً ⚡</span>
                    </>
                  )}
                </button>
              </div>

              {/* Optional Advanced Customization Accordion */}
              <details className="group pt-1">
                <summary className="text-xs text-slate-400 hover:text-amber-300 font-semibold cursor-pointer list-none flex items-center gap-1.5 transition-colors">
                  <span className="text-amber-400">⚙️</span>
                  <span>تخصيص يدوي إضافي (اختياري تماماً - النظام يستنتج كل شيء تلقائياً)</span>
                </summary>

                <div className="mt-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        تحديد النيش يدوياً (اختياري)
                      </label>
                      <select
                        value={auditNiche}
                        onChange={(e) => setAuditNiche(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="">استنتاج تلقائي من اسم الحساب ⚡</option>
                        {nicheOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-slate-950">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        ملاحظة خاصة بحسابك (اختياري)
                      </label>
                      <input
                        type="text"
                        value={auditNotes}
                        onChange={(e) => setAuditNotes(e.target.value)}
                        placeholder="مثال: هدفي زيادة المبيعات أو تحسين الإلقاء"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
                      >
                      </input>
                    </div>
                  </div>
                </div>
              </details>

              {/* Submit Error */}
              {auditError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{auditError}</span>
                </div>
              )}
            </form>
          </div>

          {/* Audit Results View */}
          {auditResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Header Score Banner */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تقييم تلقائي فوري 100% (بدون أي أسئلة)</span>
                      </div>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                        <span>🎯 النيش المستنتج: {auditResult.niche}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                      <span className="text-amber-400 font-mono dir-ltr">@{auditResult.username}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                      تقرير استراتيجي احترافي ومباشر من أبو الفهود لتطوير الريتش وكسر خوارزمية إنستغرام في العراق
                    </p>
                  </div>

                  {/* Dual Score Gauges */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Overall Score */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center min-w-[140px]">
                      <div className="text-xs text-slate-400 font-semibold mb-1">صحة الحساب العامة</div>
                      <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                        {auditResult.overallScore}
                        <span className="text-xs text-slate-500 font-normal">/100</span>
                      </div>
                      <div className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold inline-block">
                        {auditResult.overallScore >= 80 ? 'حساب قوي جداً 🚀' : auditResult.overallScore >= 60 ? 'حساب واعد محتاج ضبط ⚡' : 'محتاج إعادة هيكلة 🛠️'}
                      </div>
                    </div>

                    {/* Dialect Score */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center min-w-[140px]">
                      <div className="text-xs text-slate-400 font-semibold mb-1">أصالة اللهجة العراقية</div>
                      <div className="text-3xl sm:text-4xl font-black text-rose-400 font-mono">
                        {auditResult.dialectScore}
                        <span className="text-xs text-slate-500 font-normal">/100</span>
                      </div>
                      <div className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold inline-block">
                        {auditResult.dialectScore >= 80 ? 'عراقي أصيل يخبل 🇮🇶' : auditResult.dialectScore >= 60 ? 'يحتاج بهارات شعبية 🌶️' : 'أسلوب جاف ورسمي ⚠️'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Dialect Analysis Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Card 1: Bio Critique */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-amber-400">
                      <Target className="w-5 h-5" />
                      <h4 className="font-black text-white text-base">تشريح البايو وهوية البروفايل</h4>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {auditResult.bioReview}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>💡 نصيحة أبو الفهود:</span>
                    <span className="text-amber-300 font-medium">اجعل بايو حسابك يجاوب بثانية: "شنو راح أستفاد لو تابعتك؟"</span>
                  </div>
                </div>

                {/* Card 2: Dialect Critique Overview */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-rose-400">
                      <Wand2 className="w-5 h-5" />
                      <h4 className="font-black text-white text-base">تقييم نبرة الكلام واللهجة</h4>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {auditResult.dialectCritique.feedback}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>🗣️ سر الجمهور العراقي:</span>
                    <span className="text-rose-300 font-medium">الريلز العراقي يحب العفوية بدون تكلّف ومصطلحات معقدة</span>
                  </div>
                </div>

              </div>

              {/* Suggested Dialect Replacements Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <h4 className="font-black text-white text-base sm:text-lg">
                      تطوير لغة الحساب: بدائل اللهجة العراقية النارية
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    استبدل العبارات التقليدية بهاي المصطلحات لزيادة الـ Watch Time
                  </span>
                </div>

                <div className="space-y-3">
                  {auditResult.dialectCritique.suggestedReplacements.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500 line-through">{item.formal}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400 rotate-180" />
                          <span className="text-amber-300 font-black text-sm bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                            {item.iraqiSlang}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          <span className="text-slate-500 font-semibold">ليش تفرق؟: </span>
                          {item.why}
                        </p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(item.iraqiSlang, 'replacement', idx)}
                        className="self-start md:self-center px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        {copiedReplacementIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>نسخ العبارة</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reach Killers & Growth Hacks Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 3 Reach Killers */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-rose-400">
                    <ShieldAlert className="w-5 h-5" />
                    <h4 className="font-black text-white text-base">3 أخطاء تقتل الريتش بحسابك بالعراق (Reach Killers)</h4>
                  </div>
                  <div className="space-y-3">
                    {auditResult.reachKillers.map((killer, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="leading-relaxed">{killer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Growth Hacks */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                    <h4 className="font-black text-white text-base">3 تكتيكات إكسبلور عراقي لزيادة المشاهدات</h4>
                  </div>
                  <div className="space-y-3">
                    {auditResult.growthHacks.map((hack, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-200 flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="leading-relaxed">{hack}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Tailored Viral Reel Hook for this handle */}
              <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-lg">
                        هوك ريلز تفجيري مفصل خصيصاً لحساب @{auditResult.username}
                      </h4>
                      <p className="text-xs text-amber-300/80">
                        فكرة جاهزة للتصوير اليوم لرفع التفاعل وكسر خوارزمية إنستغرام
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(auditResult.tailoredReelIdea.hook, 'hook')}
                      className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-200 text-xs font-bold border border-slate-700/80 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedHook ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>تم نسخ الهوك</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الهوك</span>
                        </>
                      )}
                    </button>

                    {onUseReelIdea && (
                      <button
                        onClick={() => onUseReelIdea(auditResult.tailoredReelIdea.hook, `${auditResult.niche} لحساب @${auditResult.username}`)}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>اصنع سكربت كامل من هذا الهوك الآن 🚀</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] font-bold text-amber-400 mb-1">الهوك الصوتي لأول 3 ثواني:</div>
                    <div className="text-sm font-bold text-white leading-relaxed">
                      "{auditResult.tailoredReelIdea.hook}"
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] font-bold text-rose-400 mb-1">المفهوم وحركة الكاميرا (Visual Concept):</div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {auditResult.tailoredReelIdea.concept}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] font-bold text-emerald-400 mb-1">الكول تو أكشن الختامي (CTA):</div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {auditResult.tailoredReelIdea.cta}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: Iraqi Dialect Enhancer & Transformer           */}
      {/* ========================================================= */}
      {activeSubTab === 'dialect' && (
        <div className="space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
                <Wand2 className="w-3.5 h-3.5" />
                <span>تحويل وتطوير النصوص إلى اللهجة العراقية الجذابة</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                حوّل أي فكرة أو نص رسمي إلى لهجة عراقية محبوبة تمسك المشاهد 🗣️✨
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                تخلص من النبرة الإعلانية الجافة والمترجمة.. حوّل كلامك إلى نكهة بغدادية، بصرية، أو مصلاوية أصيلة مع إرشادات النطق والمفردات الذكية.
              </p>
            </div>

            {/* Quick Sample Chips */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">جرب نماذج سريعة:</span>
              {sampleDialectSentences.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDialectInput(sample.text)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  النص الأصلي (فكرة، إعلان، أو مسودة كلام)
                </label>
                <textarea
                  rows={4}
                  value={dialectInput}
                  onChange={(e) => setDialectInput(e.target.value)}
                  placeholder="الصق نصك هنا.. مثلاً: في هذا الفيديو سأوضح لكم طريقة تجهيز أفضل وصفة قهوة في المنزل خطوة بخطوة..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 leading-relaxed"
                />
              </div>

              {/* Dialect and Spice Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    اللهجة العراقية المطلوبة
                  </label>
                  <select
                    value={selectedDialect}
                    onChange={(e) => setSelectedDialect(e.target.value as IraqiDialect)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500/60 cursor-pointer"
                  >
                    <option value="baghdadi" className="bg-slate-950">بغدادية أصيلة (عفوية، روقان، فد شي)</option>
                    <option value="basrawi" className="bg-slate-950">بصراوية وجنوبية دافئة (جا شني، بعد روحي)</option>
                    <option value="moslawi" className="bg-slate-950">مصلاوية عريقة (أشونو، مليح كلش)</option>
                    <option value="white_iraqi" className="bg-slate-950">عراقية بيضاء دارجة (سريعة ومفهومة للجميع)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    مستوى البهارات الشعبية (Spice Level)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSpiceLevel('light')}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        spiceLevel === 'light'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      خفيف (شركات)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpiceLevel('medium')}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        spiceLevel === 'medium'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      متوسط (ريلز ترند)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpiceLevel('high')}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        spiceLevel === 'high'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      شعبي ناري 🔥
                    </button>
                  </div>
                </div>
              </div>

              {enhancementError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {enhancementError}
                </div>
              )}

              {/* Submit */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleEnhanceDialect}
                  disabled={isEnhancing || !dialectInput.trim()}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isEnhancing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>دنعيد صياغته بلهجة عراقية نارية...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>طوّر اللهجة الآن 🗣️✨</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Enhancement Result Card */}
          {enhancementResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 animate-in fade-in duration-300">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base sm:text-lg">
                      النص المطور باللهجة العراقية
                    </h4>
                    <span className="text-xs text-slate-400">
                      اللهجة: {enhancementResult.dialect} • البهارات: {enhancementResult.spiceLevel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(enhancementResult.enhancedText);
                      setCopiedEnhancedText(true);
                      setTimeout(() => setCopiedEnhancedText(false), 2000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedEnhancedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ النص</span>
                      </>
                    )}
                  </button>

                  {onUseDialectText && (
                    <button
                      onClick={() => onUseDialectText(enhancementResult.enhancedText)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>اصنع سكربت كامل من هذا النص 🎬</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced text view */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-sm sm:text-base text-slate-100 font-medium leading-relaxed whitespace-pre-line shadow-inner">
                {enhancementResult.enhancedText}
              </div>

              {/* Slang Highlights */}
              {enhancementResult.slangHighlights && enhancementResult.slangHighlights.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-400 mb-2">المفردات الشعبية المضافة:</div>
                  <div className="flex flex-wrap gap-2">
                    {enhancementResult.slangHighlights.map((slang, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
                      >
                        ⚡ {slang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>توجيهات النطق والإلقاء الصوتي:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {enhancementResult.pronunciationTips}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>السر النفسي والتأثير على المشاهد:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {enhancementResult.culturalNotes}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: Direct Consultation Chat with Abu Al-Fuhood    */}
      {/* ========================================================= */}
      {activeSubTab === 'chat' && (
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col h-[650px]">
          
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isBot ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isBot
                        ? 'bg-slate-950/80 border border-slate-800 text-slate-200'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold'
                    }`}
                  >
                    {msg.content}
                    <div
                      className={`text-[10px] mt-2 ${
                        isBot ? 'text-slate-500' : 'text-slate-900/70'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="mr-2">أبو الفهود ديفكر بالجواب...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preset Quick Chips */}
          <div className="pt-2 pb-3 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.query)}
                  disabled={isTyping}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="اسأل أبو الفهود أي سالفة، أو اكتب @username لتقييم الحساب فوراً وبدون أي أسئلة..."
              disabled={isTyping}
              className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 p-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500/60"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isTyping || !inputText.trim()}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
