import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowLeft, 
  Eye, 
  Camera, 
  HelpCircle,
  Zap,
  Lightbulb
} from 'lucide-react';
import { InstantHook, IraqiDialect } from '../types';
import confetti from 'canvas-confetti';

interface HooksLabProps {
  onSelectHookForScript: (hookText: string, topic: string) => void;
}

export const HooksLab: React.FC<HooksLabProps> = ({ onSelectHookForScript }) => {
  const [topic, setTopic] = useState('');
  const [dialect, setDialect] = useState<IraqiDialect>('baghdadi');
  const [tone, setTone] = useState('viral');
  const [hooks, setHooks] = useState<InstantHook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleIdeas = [
    'ليش الكل بالعراق يشتري آيفون حتى لو مديون؟',
    'سر أطيب كباب عراقي مشوي بالبيت',
    'خطأ كارثي يسووه الطلاب بالامتحانات الوزارية',
    'شلون توفر 200 ألف دينار شهرياً من مصاريفك؟',
  ];

  const handleGenerateHooks = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, dialect, tone }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.hooks)) {
        setHooks(data.hooks);
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
      } else {
        setError(data.error || 'فشل توليد الهوكات.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ بالاتصال بالخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyHook = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              مختبر وصائد الهوكات الخاطفة (أول 3 ثواني)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              80% من نجاح الريلز بالعراق يعتمد على أول 3 ثواني.. ولّد 5 هوكات نارية تمنع المشاهد من السكرول!
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerateHooks} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-2">
              عن شنو فكرة الفيديو أو المنتج مالتك؟
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثال: سر تنظيف حذاء الرياضة، أو ليش سيارات الكوري مرغوبة بالعراق..."
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 outline-none focus:border-rose-500/60"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              أفكار جاهزة:
            </span>
            {sampleIdeas.map((idea, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setTopic(idea)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 hover:border-rose-500/40 hover:text-rose-300 transition-colors cursor-pointer"
              >
                {idea}
              </button>
            ))}
          </div>

          {/* Dialect and Tone selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اللهجة العراقية
              </label>
              <select
                value={dialect}
                onChange={(e) => setDialect(e.target.value as IraqiDialect)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs sm:text-sm text-slate-200 outline-none focus:border-rose-500/60 cursor-pointer"
              >
                <option value="baghdadi">لهجة بغدادية عصرية</option>
                <option value="basrawi">لهجة بصراوية وجنوبية أصيلة</option>
                <option value="moslawi">لهجة مصلاوية وشمالية</option>
                <option value="white_iraqi">عراقية بيضاء (شاملة ومفهومة)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نوع ونبرة الهوك
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs sm:text-sm text-slate-200 outline-none focus:border-rose-500/60 cursor-pointer"
              >
                <option value="viral">متنوع وترند (صادم + فضول + تحدي)</option>
                <option value="shocking">صدمة قوية ومفاجأة</option>
                <option value="mystery">غموض وسر نادر</option>
                <option value="challenge">تحدي نفسي وجدل</option>
                <option value="funny">كوميدي وضحك وميمز</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-rose-500/20 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>ديكتشف أقوى الهوكات العراقية...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>ولّد 5 هوكات خارقة الآن 🔥</span>
                </>
              )}
            </div>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Generated Hooks Output */}
      {hooks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              أقوى 5 هوكات جاهزة للتصوير
            </h3>
            <span className="text-xs text-slate-400">
              اختر الهوك اللي يعجبك واصنع منه سكربت كامل
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {hooks.map((h, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-amber-500/50 transition-all shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {h.hookType}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Copy button */}
                    <button
                      onClick={() => copyHook(h.spokenIraqi, idx)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الكلام</span>
                        </>
                      )}
                    </button>

                    {/* Convert to full script button */}
                    <button
                      onClick={() => onSelectHookForScript(h.spokenIraqi, topic)}
                      className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm"
                    >
                      <span>اصنع سكربت كامل من هذا الهوك</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Spoken Iraqi */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-amber-400 mb-1">
                    الكلام المنطوق أول 3 ثواني:
                  </div>
                  <p className="text-lg sm:text-xl font-black text-slate-100 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 leading-relaxed">
                    "{h.spokenIraqi}"
                  </p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <span className="text-cyan-400 font-bold flex items-center gap-1 mb-1">
                      <Eye className="w-3.5 h-3.5" />
                      النص على الشاشة:
                    </span>
                    <p className="text-slate-300">{h.textOverlay}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <span className="text-rose-400 font-bold flex items-center gap-1 mb-1">
                      <Camera className="w-3.5 h-3.5" />
                      الحركة البصرية والكاميرا:
                    </span>
                    <p className="text-slate-300">{h.visualConcept}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <span className="text-emerald-400 font-bold flex items-center gap-1 mb-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      ليش هذا الهوك ينجح؟
                    </span>
                    <p className="text-slate-300">{h.whyItWorks}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
