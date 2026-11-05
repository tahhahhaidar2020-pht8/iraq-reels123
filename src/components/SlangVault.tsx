import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  Filter,
  Flame,
  ArrowRightLeft,
  Smile,
  Megaphone
} from 'lucide-react';
import { IRAQI_SLANG_VAULT, SlangItem } from '../data/slangData';
import confetti from 'canvas-confetti';

interface SlangVaultProps {
  onInsertSlang?: (phrase: string) => void;
}

export const SlangVault: React.FC<SlangVaultProps> = ({ onInsertSlang }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDialect, setSelectedDialect] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'الكل', icon: Sparkles },
    { id: 'hook', label: 'هوكات وبدايات نارية', icon: Flame },
    { id: 'transition', label: 'روابط وانتقالات المشاهد', icon: ArrowRightLeft },
    { id: 'expression', label: 'تعبيرات ومفردات قوية', icon: Smile },
    { id: 'closer', label: 'قفلات ودعوة للتفاعل (CTA)', icon: Megaphone },
  ];

  const filteredItems = IRAQI_SLANG_VAULT.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesDialect = selectedDialect === 'all' || item.dialect === selectedDialect;
    const matchesSearch =
      item.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exampleUse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDialect && matchesSearch;
  });

  const handleCopy = (phrase: string, id: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedId(id);
    try {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
    } catch {}
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              قاموس التعبيرات والمصطلحات العراقية لصناع المحتوى
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              مكتبة جاهزة لأقوى الجمل والعبارات العراقية الدارجة التي تزيد جاذبية السكربت وتخليه يلمس قلب المشاهد
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كلمة، معنى، أو موقف بالفيديو..."
              className="w-full rounded-2xl bg-slate-950 border border-slate-800 pr-11 pl-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dialect filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDialect}
                onChange={(e) => setSelectedDialect(e.target.value)}
                className="text-xs rounded-xl bg-slate-950 border border-slate-800 p-2 text-slate-300 outline-none cursor-pointer"
              >
                <option value="all">كل اللهجات</option>
                <option value="بغدادي">بغدادي</option>
                <option value="بصراوي/جنوبي">بصراوي/جنوبي</option>
                <option value="مصلاوي">مصلاوي</option>
                <option value="عراقي عام">عراقي عام</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-amber-500/40 transition-all shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {item.dialect}
                </span>

                <div className="flex items-center gap-1.5">
                  {onInsertSlang && (
                    <button
                      onClick={() => onInsertSlang(item.phrase)}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer font-semibold"
                      title="استخدم هذه العبارة في سكربت جديد"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>وظّفها بالسكربت</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopy(item.phrase, item.id)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-black text-slate-100 leading-snug mb-2">
                "{item.phrase}"
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {item.meaning}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl">
              <strong className="text-amber-400 block mb-0.5">طريقة التوظيف بالريلز:</strong>
              {item.exampleUse}
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400">
            لا توجد مصطلحات مطابقة لبحثك، جرب كلمة أخرى.
          </div>
        )}
      </div>

    </div>
  );
};
