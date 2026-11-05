import React, { useState } from 'react';
import { InstagramScript, HookOption } from '../types';
import { 
  X, 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Tv2, 
  Clapperboard, 
  Sparkles,
  FileDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  script: InstagramScript;
  activeHook: HookOption;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  script,
  activeHook,
  isOpen,
  onClose,
}) => {
  const [activeFormat, setActiveFormat] = useState<'pdf' | 'txt' | 'prompter'>('pdf');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerCopyFeedback = (type: string) => {
    setCopiedType(type);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch {}
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Generate complete structured plain text
  const generateFullText = () => {
    return `======================================================
🎬 ورقة إنتاج السكربت العراقي - IRAQ REELS PRODUCTION SHEET
======================================================
العنوان: ${script.title}
التصنيف: ${script.category || script.tone || 'عام'}
اللهجة: ${script.dialect || 'بغدادي'} | النبرة: ${script.tone || 'كوميدي'}
تاريخ الإنشاء: ${script.createdAt ? new Date(script.createdAt).toLocaleDateString('ar-IQ') : 'اليوم'}
عدد الكلمات المنطوقة تقريباً: ${script.estimatedWordsCount || 'غير محدد'}

------------------------------------------------------
⚡ أولاً: الهوك الافتتاحي (The Hook - أول 3 ثواني)
------------------------------------------------------
• نوع الهوك: ${activeHook.hookType}
• الكلام المنطوق: "${activeHook.spokenText}"
• النص المكتوب على الشاشة: ${activeHook.onScreenText}
• التوجيه البصري وحركة الكاميرا: ${activeHook.visualAction}

------------------------------------------------------
🎥 ثانياً: تفاصيل المشاهد والستوري بورد (Storyboard)
------------------------------------------------------
${script.scenes
  .map(
    (s) => `[مشهد ${s.sceneNumber}] ⏱️ التوقيت: ${s.timestamp}
• الكلام المنطوق بالعراقي: "${s.spokenText}"
• حركة الكاميرا والبصريات: ${s.visualCue}
• النص على الفيديو: ${s.onScreenText}
• المؤثرات الصوتية والموسيقى: ${s.audioSfx}
`
  )
  .join('\n------------------------------------------------------\n')}

------------------------------------------------------
💡 ثالثاً: توجيهات المخرج وطاقة الإلقاء
------------------------------------------------------
• نبرة وطاقة الصوت: ${script.deliveryNotes?.vibe || ''}
• لغة الجسد والنظرات: ${script.deliveryNotes?.bodyLanguage || ''}
• سرعة الإلقاء والوقفات: ${script.deliveryNotes?.pacing || ''}

------------------------------------------------------
📜 رابعاً: ورقة الملقن المتصلة (Teleprompter Dialogue)
------------------------------------------------------
${activeHook.spokenText}

${script.scenes.map((s) => s.spokenText).join('\n\n')}

${script.callToAction ? `[الخاتمة]: ${script.callToAction}` : ''}

------------------------------------------------------
📝 خامساً: كابشن إنستغرام الجاهز للنشر
------------------------------------------------------
${script.instagramCaption}

------------------------------------------------------
🏷️ سادساً: الهاشتاغات المقترحة
------------------------------------------------------
${script.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}

دعوة التفاعل: ${script.callToAction}
======================================================`;
  };

  // Generate Teleprompter text only
  const generatePrompterText = () => {
    return `📜 ورقة ملقن التصوير - ${script.title}
----------------------------------------

[الهوك الافتتاحي]:
${activeHook.spokenText}

----------------------------------------
[المشاهد المتتابعة]:
${script.scenes
  .map((s) => `مشهد ${s.sceneNumber} (${s.timestamp}):\n${s.spokenText}`)
  .join('\n\n')}

----------------------------------------
[دعوة التفاعل والختام]:
${script.callToAction}
`;
  };

  // Download plain text file
  const handleDownloadTxt = (isPrompterOnly = false) => {
    const content = isPrompterOnly ? generatePrompterText() : generateFullText();
    const fileName = `${isPrompterOnly ? 'prompter' : 'script'}-${script.title.slice(0, 20).replace(/\s+/g, '_')}.txt`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    triggerCopyFeedback(isPrompterOnly ? 'download_prompter' : 'download_txt');
  };

  // Print as PDF with clean styling
  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${script.title} - ورقة إنتاج السكربت</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
    
    @page {
      size: A4;
      margin: 15mm;
    }
    
    body {
      font-family: 'Cairo', Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.6;
      font-size: 13px;
      margin: 0;
      padding: 0;
    }

    .header-box {
      border-bottom: 2px solid #f59e0b;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }

    .title {
      font-size: 22px;
      font-weight: 900;
      color: #0f172a;
      margin: 0 0 6px 0;
    }

    .meta-row {
      display: flex;
      gap: 12px;
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }

    .badge {
      background: #fef3c7;
      color: #b45309;
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid #fde68a;
    }

    .section-title {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      border-right: 4px solid #f59e0b;
      padding-right: 8px;
      margin: 16px 0 10px 0;
    }

    .hook-box {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
    }

    .hook-spoken {
      font-size: 15px;
      font-weight: 800;
      color: #92400e;
      margin-bottom: 6px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 12px;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: right;
      vertical-align: top;
    }

    th {
      background: #f8fafc;
      font-weight: 800;
      color: #334155;
    }

    .spoken-col {
      font-weight: 700;
      color: #0f172a;
      width: 40%;
    }

    .notes-box {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 10px;
      font-size: 11px;
      margin-bottom: 16px;
    }

    .prompter-box {
      background: #fafafa;
      border: 1px dashed #94a3b8;
      border-radius: 8px;
      padding: 14px;
      font-size: 14px;
      line-height: 1.9;
      font-weight: 600;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }

    .caption-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      white-space: pre-line;
      font-size: 12px;
    }

    .footer {
      margin-top: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div style="font-size: 11px; font-weight: 800; color: #f59e0b; margin-bottom: 4px;">عراق ريلز • ورقة إنتاج السكربت ومواصفات التصوير</div>
    <h1 class="title">${script.title}</h1>
    <div class="meta-row">
      <span class="badge">التصنيف: ${script.category || script.tone || 'عام'}</span>
      <span>اللهجة: ${script.dialect || 'بغدادي'}</span>
      <span>عدد المشاهد: ${script.scenes.length}</span>
      <span>الكلمات: ${script.estimatedWordsCount || 'محدد'}</span>
      <span>تاريخ: ${new Date().toLocaleDateString('ar-IQ')}</span>
    </div>
  </div>

  <div class="section-title">⚡ الهوك الافتتاحي (The Hook - أول 3 ثواني)</div>
  <div class="hook-box">
    <div class="hook-spoken">"${activeHook.spokenText}"</div>
    <div style="font-size: 11px; color: #475569; margin-top: 4px;">
      <strong>النص على الشاشة:</strong> ${activeHook.onScreenText} | 
      <strong>توجيه الكاميرا:</strong> ${activeHook.visualAction}
    </div>
  </div>

  <div class="section-title">🎥 جدول المشاهد وتوجيهات الكاميرا (Storyboard)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 12%;">المشهد</th>
        <th>الكلام المنطوق باللهجة العراقية</th>
        <th style="width: 25%;">البصريات وتوجيه الكاميرا</th>
        <th style="width: 20%;">النص بالشاشة والصوت</th>
      </tr>
    </thead>
    <tbody>
      ${script.scenes
        .map(
          (s) => `
        <tr>
          <td>
            <strong>مشهد ${s.sceneNumber}</strong><br>
            <span style="color: #64748b; font-size: 10px;">${s.timestamp}</span>
          </td>
          <td class="spoken-col">${s.spokenText}</td>
          <td>${s.visualCue}</td>
          <td>
            <div style="font-size: 11px; color: #0284c7;">${s.onScreenText}</div>
            <div style="font-size: 10px; color: #16a34a; margin-top: 3px;">🎵 ${s.audioSfx}</div>
          </td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="section-title">💡 توجيهات المخرج والأداء</div>
  <div class="notes-box">
    <div><strong>نبرة الصوت:</strong> ${script.deliveryNotes?.vibe || 'عفوية وحماسية'}</div>
    <div><strong>لغة الجسد:</strong> ${script.deliveryNotes?.bodyLanguage || 'حركات يدين واتصال بصري'}</div>
    <div><strong>سرعة الإلقاء:</strong> ${script.deliveryNotes?.pacing || 'سريع في الهوك ومتوازن بالشرح'}</div>
  </div>

  <div class="section-title">📜 ورقة الملقن المستقلة للمقدم / الممثل (Teleprompter Copy)</div>
  <div class="prompter-box">
    ${activeHook.spokenText}<br><br>
    ${script.scenes.map((s) => s.spokenText).join('<br><br>')}<br><br>
    <strong>[الخاتمة]:</strong> ${script.callToAction}
  </div>

  <div class="section-title">📝 كابشن إنستغرام والهاشتاغات</div>
  <div class="caption-box">
    ${script.instagramCaption}<br><br>
    <strong>الهاشتاغات:</strong> ${script.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
  </div>

  <div class="footer">
    <span>تم إنشاء هذا السكربت بواسطة صانع سكربتات إنستغرام العراقية (عراق ريلز)</span>
    <span>تاريخ التصدير: ${new Date().toLocaleString('ar-IQ')}</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const copyWhatsAppFormat = () => {
    const text = `🎬 *سكربت ريلز: ${script.title}*
------------------------------
⚡ *الهوك (أول 3 ثواني):*
"${activeHook.spokenText}"
_الكاميرا: ${activeHook.visualAction}_

🎥 *المشاهد:*
${script.scenes
  .map(
    (s) => `*مشهد ${s.sceneNumber} (${s.timestamp}):*
🗣️ "${s.spokenText}"
📹 _${s.visualCue}_`
  )
  .join('\n\n')}

💡 *الخاتمة (CTA):*
${script.callToAction}

📝 *الكابشن:*
${script.instagramCaption}
`;
    navigator.clipboard.writeText(text);
    triggerCopyFeedback('copy_whatsapp');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
              <FileDown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>تصدير ومشاركة السكربت</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  جاهز للفريق
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                اختر صيغة التصدير المناسبة لمشاركة السكربت مع فريق العمل أو حفظه
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Switcher Tabs */}
        <div className="p-4 sm:p-6 pb-2 border-b border-slate-800/80 bg-slate-950/40">
          <div className="grid grid-cols-3 gap-2">
            
            {/* PDF Tab */}
            <button
              onClick={() => setActiveFormat('pdf')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFormat === 'pdf'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>ملف PDF للطباعة</span>
            </button>

            {/* Text File Tab */}
            <button
              onClick={() => setActiveFormat('txt')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFormat === 'txt'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>ملف نصي (.txt)</span>
            </button>

            {/* Prompter Cue Tab */}
            <button
              onClick={() => setActiveFormat('prompter')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFormat === 'prompter'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <Tv2 className="w-4 h-4" />
              <span>ورقة الملقن فقط</span>
            </button>

          </div>
        </div>

        {/* Modal Body / Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* PDF Format Info */}
          {activeFormat === 'pdf' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-amber-300 text-sm">
                    ورقة إنتاج احترافية جاهزة للطباعة والـ PDF (A4)
                  </p>
                  <p>
                    تحتوي على جدول المشاهد وتوجيهات الكاميرا والـ B-Roll، النص المنطوق بالعراقي، الكابشن، وتوجيهات الإلقاء بتنسيق عربي عالي الدقة وخط أصيل بدون أي تشويه.
                  </p>
                </div>
              </div>

              {/* PDF Preview Snapshot */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono space-y-2 text-slate-400 max-h-60 overflow-y-auto">
                <div className="text-amber-400 font-bold">📄 وثيقة الإنتاج: {script.title}</div>
                <div>• الهوك: "{activeHook.spokenText}"</div>
                <div>• عدد المشاهد: {script.scenes.length} مشهد تفصيلي بالثواني</div>
                <div>• المخرج: نبرة {script.deliveryNotes?.vibe || ''}</div>
                <div>• ورقة الملقن المدمجة: جاهزة للمذيع / الممثل</div>
              </div>

              {/* Main Action Button */}
              <button
                onClick={handlePrintPdf}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                <span>فتح نافذة الطباعة والحفظ كملف PDF 📄</span>
              </button>
            </div>
          )}

          {/* TXT Format Info */}
          {activeFormat === 'txt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  معاينة الملف النصي الكامل:
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateFullText());
                    triggerCopyFeedback('copy_full_txt');
                  }}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-white cursor-pointer"
                >
                  {copiedType === 'copy_full_txt' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ النص كاملاً</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                readOnly
                value={generateFullText()}
                rows={10}
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs text-slate-300 font-mono leading-relaxed outline-none resize-none"
              />

              <button
                onClick={() => handleDownloadTxt(false)}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm sm:text-base hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>تنزيل ملف نصي (.txt) 📥</span>
              </button>
            </div>
          )}

          {/* Prompter Format Info */}
          {activeFormat === 'prompter' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    ورقة الملقن (كلام المتحدث فقط بدون تعقيدات):
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatePrompterText());
                      triggerCopyFeedback('copy_prompter');
                    }}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-white cursor-pointer"
                  >
                    {copiedType === 'copy_prompter' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ كلام الملقن</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={generatePrompterText()}
                  rows={8}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-slate-300 font-mono leading-relaxed outline-none resize-none"
                />
              </div>

              <button
                onClick={() => handleDownloadTxt(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm sm:text-base hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>تنزيل ورقة الملقن (.txt) 📜</span>
              </button>
            </div>
          )}

          {/* Quick Team Chat Share Banner */}
          <div className="pt-3 border-t border-slate-800/80">
            <button
              onClick={copyWhatsAppFormat}
              className="w-full py-3 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {copiedType === 'copy_whatsapp' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">تم نسخ رسالة الواتساب المنسقة!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>نسخ كرسالة واتساب / تيليجرام منسقة لكروب العمل 💬</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
