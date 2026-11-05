import React, { useState } from 'react';
import { 
  InstagramScript, 
  HookOption 
} from '../types';
import { 
  Copy, 
  Check, 
  Tv2, 
  Bookmark, 
  BookmarkCheck, 
  Download, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Clapperboard, 
  Hash, 
  MessageSquare, 
  Flame, 
  Send,
  Eye,
  Camera,
  Music2,
  FileText,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getCategoryMeta } from './SavedScripts';
import { ExportModal } from './ExportModal';

interface ScriptViewerProps {
  script: InstagramScript;
  onOpenTeleprompter: (script: InstagramScript) => void;
  onSaveScript: (script: InstagramScript) => void;
  isSaved: boolean;
  onRefineScript: (instruction: string) => Promise<void>;
  isRefining: boolean;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({
  script,
  onOpenTeleprompter,
  onSaveScript,
  isSaved,
  onRefineScript,
  isRefining,
}) => {
  const [selectedHookIndex, setSelectedHookIndex] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [customRefinePrompt, setCustomRefinePrompt] = useState('');
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const activeHook: HookOption = script.hookOptions[selectedHookIndex] || script.hookOptions[0];

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // fallback
    }
  };

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    triggerConfetti();
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const copyFullScriptText = () => {
    const fullText = `🎬 عنوان السكربت: ${script.title}
----------------------------------------
⚡ الهوك المعتمد (أول 3 ثواني):
- المنطوق: "${activeHook?.spokenText || ''}"
- على الشاشة: "${activeHook?.onScreenText || ''}"
- الحركة البصرية: ${activeHook?.visualAction || ''}

----------------------------------------
🎥 المشاهد وتوجيهات التصوير:
${script.scenes
  .map(
    (s) => `[مشهد ${s.sceneNumber} | ${s.timestamp}]
الكلام العراقي: "${s.spokenText}"
البصريات: ${s.visualCue}
النص على الشاشة: ${s.onScreenText}
الصوت والموسيقى: ${s.audioSfx}`
  )
  .join('\n\n')}

----------------------------------------
💡 توجيهات الأداء والإخراج:
- النبرة: ${script.deliveryNotes?.vibe || ''}
- لغة الجسد: ${script.deliveryNotes?.bodyLanguage || ''}
- سرعة الإلقاء: ${script.deliveryNotes?.pacing || ''}

----------------------------------------
📝 كابشن إنستغرام:
${script.instagramCaption}

🏷️ الهاشتاغات:
${script.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
`;
    copyToClipboard(fullText, 'full_script');
  };

  const exportAsTxt = () => {
    const fullText = `عنوان السكربت: ${script.title}\n\n` +
      `المشاهد:\n` +
      script.scenes.map(s => `${s.timestamp}: ${s.spokenText}\n(البصريات: ${s.visualCue})`).join('\n\n') +
      `\n\nالكابشن:\n${script.instagramCaption}\n\nالهاشتاغات:\n${script.hashtags.join(' ')}`;
    
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `script-${script.title.slice(0, 20).replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Text to speech for Iraqi spoken line
  const speakText = (text: string, sceneIndex: number) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking === sceneIndex) {
      setIsSpeaking(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-IQ'; // Try Arabic / Iraqi
    utterance.rate = 1.05;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(sceneIndex);
    window.speechSynthesis.speak(utterance);
  };

  const handleRefineSubmit = (instruction: string) => {
    if (!instruction.trim()) return;
    onRefineScript(instruction);
    setCustomRefinePrompt('');
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in-50 duration-300">
      
      {/* Top Banner & Action Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Clapperboard className="w-3 h-3" />
                سكربت ريلز جاهز للتصوير
              </span>

              {/* Classification Badge */}
              {(() => {
                const catMeta = getCategoryMeta(script.category || (script.tone === 'story' ? 'vlog' : script.tone));
                const IconComp = catMeta.icon;
                return (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${catMeta.badgeBg} ${catMeta.badgeText} ${catMeta.badgeBorder}`}>
                    <IconComp className="w-3 h-3" />
                    <span>{catMeta.name}</span>
                  </span>
                );
              })()}

              {script.estimatedWordsCount && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                  {script.estimatedWordsCount} كلمة منطوقة تقريباً
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {script.title}
            </h1>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Open Teleprompter */}
            <button
              onClick={() => onOpenTeleprompter(script)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Tv2 className="w-4 h-4" />
              <span>شغّل الملقن الذكي 🎥</span>
            </button>

            {/* Save to Local Favorites */}
            <button
              onClick={() => onSaveScript(script)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-rose-400" />
                  <span>محفوظ بالسكربتات</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>حفظ بالمفضلة</span>
                </>
              )}
            </button>

            {/* Copy Full Script */}
            <button
              onClick={copyFullScriptText}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 hover:bg-slate-800/50 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              {copiedSection === 'full_script' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">تم النسخ كامل!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ السكربت</span>
                </>
              )}
            </button>

            {/* Export Modal Trigger */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-600/20 active:scale-95 transition-all cursor-pointer"
              title="تصدير السكربت كملف PDF منظم أو ملف نصي للمشاركة مع الفريق"
            >
              <Download className="w-4 h-4" />
              <span>تصدير (PDF / نص) 📄</span>
            </button>
          </div>
        </div>

        {/* 3 Hook Options Selector (The 3-Second Goldmine) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                اختر الهوك الافتتاحي (أول 3 ثواني تمنع السكرول)
              </h3>
            </div>
            <span className="text-xs text-amber-400 font-semibold hidden sm:inline">
              اضغط على الهوك لاعتماده في السكربت
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {script.hookOptions.map((hook, idx) => {
              const isSelected = selectedHookIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedHookIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-right flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-500/15 to-rose-500/10 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {hook.hookType}
                      </span>
                      {isSelected ? (
                        <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          الهوك النشط
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">اختر هذا</span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base font-black text-slate-100 leading-relaxed">
                      "{hook.spokenText}"
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-start gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2"><strong>النص بالشاشة:</strong> {hook.onScreenText}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2"><strong>البصريات:</strong> {hook.visualAction}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Storyboard & Scenes */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                ستوري بورد المشاهد والتوجيهات الصوتية
              </h2>
              <p className="text-xs text-slate-400">
                تسلسل اللقطات، الكلام المنطوق بالعراقي، وحركات الكاميرا خطوة بخطوة
              </p>
            </div>
          </div>
        </div>

        {/* Scene Cards List */}
        <div className="mt-6 space-y-4">
          {script.scenes.map((scene, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5 hover:border-slate-700/80 transition-all"
            >
              {/* Scene Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs">
                    {scene.sceneNumber}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                    ⏱️ {scene.timestamp}
                  </span>
                </div>

                {/* Pronounce Line Button */}
                <button
                  onClick={() => speakText(scene.spokenText, index)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    isSpeaking === index
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-300'
                  }`}
                  title="استمع للإلقاء"
                >
                  {isSpeaking === index ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>إيقاف الصوت</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>استمع بالنطق</span>
                    </>
                  )}
                </button>
              </div>

              {/* Spoken Text (Main highlight) */}
              <div className="mb-4">
                <div className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1">
                  <span>الكلام المنطوق باللهجة العراقية:</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80">
                  {scene.spokenText}
                </p>
              </div>

              {/* 3 Detail columns: Visual, OnScreen, Audio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Visual Cue */}
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 space-y-1">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>توجيه الكاميرا والبصريات:</span>
                  </div>
                  <p className="text-slate-300 leading-normal">{scene.visualCue}</p>
                </div>

                {/* OnScreen Caption */}
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>النص على الفيديو (Text Overlay):</span>
                  </div>
                  <p className="text-slate-300 leading-normal font-medium">{scene.onScreenText}</p>
                </div>

                {/* Audio SFX */}
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Music2 className="w-3.5 h-3.5" />
                    <span>المؤثر الصوتي أو الموسيقى:</span>
                  </div>
                  <p className="text-slate-300 leading-normal">{scene.audioSfx}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Delivery / Director Notes */}
        {script.deliveryNotes && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              توجيهات المخرج وطاقة الإلقاء:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div>
                <strong className="text-amber-200">نبرة الصوت: </strong>
                {script.deliveryNotes.vibe}
              </div>
              <div>
                <strong className="text-amber-200">لغة الجسد والنظرات: </strong>
                {script.deliveryNotes.bodyLanguage}
              </div>
              <div>
                <strong className="text-amber-200">سرعة الحديث والوقفات: </strong>
                {script.deliveryNotes.pacing}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instagram Ready Box: Caption & Hashtags */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                كابشن وهاشتاغات إنستغرام الجاهزة للنشر
              </h2>
              <p className="text-xs text-slate-400">
                انسخها مباشرة والصقها بوصف الفيديو على إنستغرام
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              copyToClipboard(
                `${script.instagramCaption}\n\n${script.hashtags
                  .map((h) => (h.startsWith('#') ? h : `#${h}`))
                  .join(' ')}`,
                'caption_hashtags'
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-bold text-slate-200 hover:text-amber-300 hover:border-amber-500/40 transition-all cursor-pointer"
          >
            {copiedSection === 'caption_hashtags' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>نسخ الكابشن والهاشتاغات</span>
              </>
            )}
          </button>
        </div>

        {/* Caption */}
        <div className="mt-5">
          <div className="relative">
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-sm sm:text-base text-slate-200 whitespace-pre-line leading-relaxed font-sans">
              {script.instagramCaption}
            </div>
          </div>
        </div>

        {/* Call to Action Highlight */}
        {script.callToAction && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-300 flex items-center justify-between">
            <div>
              <strong className="font-bold">دعوة التفاعل المقترحة (CTA): </strong>
              <span>{script.callToAction}</span>
            </div>
          </div>
        )}

        {/* Hashtags */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              أفضل الهاشتاغات المناسبة للعراق والإكسبلور:
            </span>
            <button
              onClick={() =>
                copyToClipboard(
                  script.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' '),
                  'hashtags_only'
                )
              }
              className="text-xs text-amber-400 hover:underline cursor-pointer font-semibold"
            >
              {copiedSection === 'hashtags_only' ? '✓ تم النسخ' : 'نسخ الهاشتاغات فقط'}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {script.hashtags.map((tag, idx) => {
              const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
              return (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                >
                  {formattedTag}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Quick Polish & Refine Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <h3 className="text-sm sm:text-base font-bold text-white">
            تعديل وتطوير السكربت بالذكاء الاصطناعي (AI Polisher)
          </h3>
        </div>

        {/* Preset quick actions */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            { label: 'خليه أكثر كوميديا وميمز ضحك 😂', prompt: 'عدل السكربت ليصبح كوميدي جداً ومضحك مع ميمز عراقية وسخرية ذكية' },
            { label: 'قصّر الوقت وسرّع الإيقاع لـ 30 ثانية ⚡', prompt: 'اختصر السكربت وركز على هوك سريع ومحتوى مكثف مدته 30 ثانية فقط' },
            { label: 'زوّد بهارات عراقية وبصراوية قوية 🔥', prompt: 'أضف مفردات عراقية ثقيلة ومميزة جداً مثل جا شني، بعد روحي، صدك جذب، طركاعة' },
            { label: 'ركز على بيع منتج وتأكيد الشراء 🛍️', prompt: 'اجعل السكربت موجه للإعلانات والمبيعات مع إبراز مميزات المنتج وكول تو أكشن قوي للشراء' },
          ].map((action, i) => (
            <button
              key={i}
              disabled={isRefining}
              onClick={() => handleRefineSubmit(action.prompt)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all cursor-pointer disabled:opacity-50"
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Custom instruction input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customRefinePrompt}
            onChange={(e) => setCustomRefinePrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRefineSubmit(customRefinePrompt);
            }}
            placeholder="اكتب أي تعديل تريده... مثلاً: غير مشهد 2 ليكون في سيارة، أو اجعل الخاتمة بسؤال..."
            disabled={isRefining}
            className="flex-1 rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500/60"
          />
          <button
            onClick={() => handleRefineSubmit(customRefinePrompt)}
            disabled={isRefining || !customRefinePrompt.trim()}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isRefining ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>تعديل</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Export & Sharing Modal */}
      <ExportModal
        script={script}
        activeHook={activeHook}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

    </div>
  );
};
