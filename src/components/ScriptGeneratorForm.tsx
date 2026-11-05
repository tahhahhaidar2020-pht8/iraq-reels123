import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Clock, 
  Users, 
  Smile, 
  ShoppingBag, 
  GraduationCap, 
  BookHeart, 
  Mic2, 
  UtensilsCrossed, 
  Zap,
  CheckCircle2,
  ChevronDown,
  Layers
} from 'lucide-react';
import { IraqiDialect, ScriptTone, ScriptDuration } from '../types';
import { POPULAR_IRAQI_TOPIC_IDEAS } from '../data/slangData';

interface ScriptGeneratorFormProps {
  onGenerate: (params: {
    topic: string;
    dialect: IraqiDialect;
    tone: ScriptTone;
    duration: ScriptDuration;
    targetAudience: string;
    additionalNotes: string;
    keyPhrases: string[];
  }) => Promise<void>;
  isLoading: boolean;
  prefilledSlang?: string;
  prefilledTopic?: string;
}

export const ScriptGeneratorForm: React.FC<ScriptGeneratorFormProps> = ({
  onGenerate,
  isLoading,
  prefilledSlang,
  prefilledTopic,
}) => {
  const [topic, setTopic] = useState('');
  const [dialect, setDialect] = useState<IraqiDialect>('baghdadi');
  const [tone, setTone] = useState<ScriptTone>('comedy');
  const [duration, setDuration] = useState<ScriptDuration>('30_60');
  const [targetAudience, setTargetAudience] = useState('الشباب العراقي والمتابعين بالإنستغرام');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedSlang, setSelectedSlang] = useState<string[]>([
    'صدك جذب',
    'فد شي يخبل',
  ]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  React.useEffect(() => {
    if (prefilledSlang && !selectedSlang.includes(prefilledSlang)) {
      setSelectedSlang((prev) => [prefilledSlang, ...prev]);
    }
  }, [prefilledSlang]);

  React.useEffect(() => {
    if (prefilledTopic) {
      setTopic(prefilledTopic);
    }
  }, [prefilledTopic]);

  const dialectOptions: { id: IraqiDialect; title: string; subtitle: string; tag: string }[] = [
    {
      id: 'baghdadi',
      title: 'لهجة بغدادية',
      subtitle: 'سلسة، عصرية، منتشرة بكل العراق',
      tag: 'بغداد والوسط',
    },
    {
      id: 'basrawi',
      title: 'لهجة بصراوية وجنوبية',
      subtitle: 'دافئة، عفوية، جا شني وبعد روحي',
      tag: 'البصرة والجنوب',
    },
    {
      id: 'moslawi',
      title: 'لهجة مصلاوية',
      subtitle: 'أشونو، أشقد حلو، أسلوب مميز ملفت',
      tag: 'الموصل والشمال',
    },
    {
      id: 'white_iraqi',
      title: 'عراقية بيضاء',
      subtitle: 'كلام عراقي خفيف يفهمه العراقي والعربي',
      tag: 'عام وشامل',
    },
  ];

  const toneOptions: { id: ScriptTone; title: string; icon: any; color: string }[] = [
    { id: 'comedy', title: 'كوميدي وساخر', icon: Smile, color: 'text-amber-400 border-amber-500/30' },
    { id: 'business', title: 'إعلاني وتسويقي', icon: ShoppingBag, color: 'text-emerald-400 border-emerald-500/30' },
    { id: 'educational', title: 'معلومات وغرائب', icon: GraduationCap, color: 'text-cyan-400 border-cyan-500/30' },
    { id: 'story', title: 'قصة وسوالف واقعية', icon: BookHeart, color: 'text-rose-400 border-rose-500/30' },
    { id: 'podcast', title: 'بودكاست حواري سريع', icon: Mic2, color: 'text-purple-400 border-purple-500/30' },
    { id: 'food_review', title: 'تقييم أكل ومطاعم', icon: UtensilsCrossed, color: 'text-orange-400 border-orange-500/30' },
    { id: 'motivational', title: 'تحفيز وإصرار', icon: Zap, color: 'text-yellow-400 border-yellow-500/30' },
  ];

  const durationOptions: { id: ScriptDuration; label: string; desc: string }[] = [
    { id: '15_30', label: '15 - 30 ثانية', desc: 'خاطف وسريع جداً (أعلى نسب إكمال)' },
    { id: '30_60', label: '30 - 60 ثانية', desc: 'قياسي ومثالي لمعظم الريلز' },
    { id: '60_90', label: '60 - 90 ثانية', desc: 'تفصيلي لقصة أو شرح كامل' },
  ];

  const quickSlangPills = [
    'صدك جذب',
    'فد شي يخبل',
    'يمعود',
    'جا شني',
    'دقيقة عيوني',
    'طكة وحدة',
    'ع الرنة',
    'براحتك خوية',
    'سالفة چايدة',
    'بعد روحي',
    'لحد يكلك',
    'طركاعة',
  ];

  const toggleSlang = (item: string) => {
    setSelectedSlang((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    );
  };

  const handleApplyPreset = (preset: typeof POPULAR_IRAQI_TOPIC_IDEAS[0]) => {
    setTopic(preset.title);
    setDialect(preset.dialect);
    setTone(preset.tone);
    setDuration(preset.duration);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({
      topic,
      dialect,
      tone,
      duration,
      targetAudience,
      additionalNotes,
      keyPhrases: selectedSlang,
    });
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            صياغة سكربت ريلز جديد
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            حدد فكرتك واضبط النبرة واللهجة وسيقوم الذكاء الاصطناعي بكتابة هوك ناري، مشاهد مصورة، وكابشن متكامل.
          </p>
        </div>

        {/* Quick Inspiration Button */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
            <Lightbulb className="w-3.5 h-3.5" />
            أفكار عراقية جاهزة بالأسفل
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-bold text-slate-200 mb-2">
            موضوع أو فكرة الفيديو <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: ليش الشباب بالعراق يعانون من كثرة العزايم والأكل بالليل؟ أو إعلان لسماعات بلوتوث ممتازة للطلبة..."
              rows={3}
              required
              className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 text-slate-100 placeholder:text-slate-500 text-sm sm:text-base p-4 outline-none transition-all leading-relaxed resize-none"
            />
            <span className="absolute bottom-3 left-3 text-[11px] text-slate-500 font-mono">
              {topic.length} حرف
            </span>
          </div>

          {/* Quick presets pills */}
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>جرب وحدة من الأفكار الرائجة بنقرة وحدة:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_IRAQI_TOPIC_IDEAS.map((idea, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleApplyPreset(idea)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-950/60 hover:bg-amber-500/15 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all text-right flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                    {idea.badge}
                  </span>
                  <span>{idea.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dialect Selector */}
        <div>
          <label className="block text-sm font-bold text-slate-200 mb-2.5 flex items-center justify-between">
            <span>اللهجة العراقية المعتمدة</span>
            <span className="text-xs text-amber-400 font-normal">تتحكم بالمفردات والإيقاع</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {dialectOptions.map((opt) => {
              const isSelected = dialect === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setDialect(opt.id)}
                  className={`relative p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/70 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {opt.tag}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="font-bold text-sm text-slate-100 mt-1">{opt.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{opt.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-sm font-bold text-slate-200 mb-2.5 flex items-center justify-between">
            <span>نبرة وأسلوب الطرح</span>
            <span className="text-xs text-slate-400">حدد هوية الفيديو</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {toneOptions.map((t) => {
              const Icon = t.icon;
              const isSelected = tone === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? `bg-slate-800/90 border-amber-500/60 shadow-md text-amber-300 font-bold`
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/30'
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-slate-900 border ${t.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{t.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Selector */}
        <div>
          <label className="block text-sm font-bold text-slate-200 mb-2.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>مدة الريلز المقترحة</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {durationOptions.map((d) => {
              const isSelected = duration === d.id;
              return (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setDuration(d.id)}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{d.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">{d.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Iraqi Slang Pills */}
        <div>
          <label className="block text-sm font-bold text-slate-200 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              تطعيم السكربت بكلمات عراقية قوية (اختياري)
            </span>
            <span className="text-xs text-slate-400">انقر للتفعيل</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {quickSlangPills.map((slang) => {
              const isSelected = selectedSlang.includes(slang);
              return (
                <button
                  type="button"
                  key={slang}
                  onClick={() => toggleSlang(slang)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {slang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium cursor-pointer"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            <span>خيارات إضافية (الجمهور المستهدف وملاحظات الإخراج)</span>
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>من هو جمهورك المستهدف؟</span>
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="مثال: طلاب الجامعات العراقية، أصحاب المحلات، البنات والمهتمات بالمكياج..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs sm:text-sm text-slate-200 focus:border-amber-500/60 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ملاحظات أو توجيهات خاصة بالمنتج أو طريقة التصوير:
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="مثال: أريد التركيز على سعر الخصم 50%، أو أصور بكاميرا أمامية سيلفي وأنا أمشي..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs sm:text-sm text-slate-200 focus:border-amber-500/60 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full relative group overflow-hidden py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2.5">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>ديكتب السكربت العراقي على أصوله...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-950 transition-transform group-hover:rotate-12" />
                  <span>ولّد السكربت العراقي الخارق الآن 🚀</span>
                </>
              )}
            </div>
          </button>
        </div>

      </form>
    </div>
  );
};
