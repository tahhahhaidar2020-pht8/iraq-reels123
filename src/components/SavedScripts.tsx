import React, { useState, useMemo } from 'react';
import { InstagramScript } from '../types';
import { 
  BookmarkCheck, 
  Trash2, 
  Tv2, 
  Eye, 
  Calendar, 
  Clapperboard, 
  Search, 
  Tag, 
  Plus, 
  Check, 
  Smile, 
  GraduationCap, 
  Video, 
  ShoppingBag, 
  Mic2, 
  UtensilsCrossed, 
  Zap, 
  Layers,
  Sparkles,
  ArrowUpDown,
  Star,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface ScriptCategoryInfo {
  id: string;
  name: string;
  icon: any;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const SCRIPT_CATEGORIES: ScriptCategoryInfo[] = [
  {
    id: 'comedy',
    name: 'كوميدي وميمز',
    icon: Smile,
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
  },
  {
    id: 'educational',
    name: 'تعليمي وتثقيفي',
    icon: GraduationCap,
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/30',
  },
  {
    id: 'vlog',
    name: 'فلوق وسوالف وقصص',
    icon: Video,
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/30',
  },
  {
    id: 'business',
    name: 'إعلاني وتسويقي',
    icon: ShoppingBag,
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
  },
  {
    id: 'podcast',
    name: 'بودكاست ومقابلات',
    icon: Mic2,
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/30',
  },
  {
    id: 'food_review',
    name: 'تقييم أكل ومطاعم',
    icon: UtensilsCrossed,
    color: 'text-orange-400',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-500/30',
  },
  {
    id: 'motivational',
    name: 'تحفيز وتطوير',
    icon: Zap,
    color: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/15',
    badgeText: 'text-yellow-300',
    badgeBorder: 'border-yellow-500/30',
  },
];

export const getCategoryMeta = (categoryId?: string): ScriptCategoryInfo => {
  return (
    SCRIPT_CATEGORIES.find((c) => c.id === categoryId) || {
      id: 'other',
      name: 'منوع / عام',
      icon: Layers,
      color: 'text-slate-400',
      badgeBg: 'bg-slate-800',
      badgeText: 'text-slate-300',
      badgeBorder: 'border-slate-700',
    }
  );
};

// Interactive 1-5 Star Rating Component
interface StarRatingProps {
  rating?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onChange,
  readOnly = false,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayRating = hovered !== null ? hovered : rating;

  return (
    <div className="flex items-center gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => {
              if (readOnly || !onChange) return;
              // Toggle or set
              const newRating = star === rating ? 0 : star;
              onChange(newRating);
              if (newRating === 5) {
                try {
                  confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
                } catch {}
              }
            }}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(null)}
            className={`p-0.5 rounded transition-transform ${
              readOnly ? 'cursor-default' : 'hover:scale-125 cursor-pointer'
            }`}
            title={`${star} من 5 نجوم (اضغط للتقييم)`}
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]'
                  : 'text-slate-600 hover:text-slate-400'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

interface SavedScriptsProps {
  savedScripts: InstagramScript[];
  onSelectScript: (script: InstagramScript) => void;
  onOpenTeleprompter: (script: InstagramScript) => void;
  onDeleteScript: (id: string) => void;
  onUpdateCategory?: (id: string, newCategory: string) => void;
  onAddTag?: (id: string, tag: string) => void;
  onUpdateRating?: (id: string, newRating: number) => void;
}

export const SavedScripts: React.FC<SavedScriptsProps> = ({
  savedScripts,
  onSelectScript,
  onOpenTeleprompter,
  onDeleteScript,
  onUpdateCategory,
  onAddTag,
  onUpdateRating,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'scenes'>('newest');
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newTagInputId, setNewTagInputId] = useState<string | null>(null);
  const [tagText, setTagText] = useState('');

  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: savedScripts.length };
    SCRIPT_CATEGORIES.forEach((cat) => {
      counts[cat.id] = 0;
    });

    savedScripts.forEach((script) => {
      const cat = script.category || (script.tone === 'story' ? 'vlog' : script.tone) || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return counts;
  }, [savedScripts]);

  // Filter and sort scripts
  const filteredScripts = useMemo(() => {
    return savedScripts
      .filter((script) => {
        const scriptCat = script.category || (script.tone === 'story' ? 'vlog' : script.tone) || 'other';
        const matchesCat = selectedCategory === 'all' || scriptCat === selectedCategory;
        if (!matchesCat) return false;

        // Rating filter
        const scriptRating = script.rating || 0;
        if (minRatingFilter > 0 && scriptRating < minRatingFilter) {
          return false;
        }

        if (!searchQuery.trim()) return true;

        const q = searchQuery.toLowerCase();
        const inTitle = script.title.toLowerCase().includes(q);
        const inHook = script.hookOptions?.some((h) => h.spokenText.toLowerCase().includes(q));
        const inScenes = script.scenes?.some((s) => s.spokenText.toLowerCase().includes(q));
        const inTags = script.tags?.some((t) => t.toLowerCase().includes(q));

        return inTitle || inHook || inScenes || inTags;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        if (sortBy === 'scenes') {
          return (b.scenes?.length || 0) - (a.scenes?.length || 0);
        }
        return 0;
      });
  }, [savedScripts, selectedCategory, searchQuery, sortBy, minRatingFilter]);

  const handleCategoryChange = (scriptId: string, newCat: string) => {
    if (onUpdateCategory) {
      onUpdateCategory(scriptId, newCat);
    }
    setEditingCategoryId(null);
  };

  const handleAddTagSubmit = (scriptId: string) => {
    if (!tagText.trim()) {
      setNewTagInputId(null);
      return;
    }
    if (onAddTag) {
      onAddTag(scriptId, tagText.trim());
    }
    setTagText('');
    setNewTagInputId(null);
  };

  if (savedScripts.length === 0) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <BookmarkCheck className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-white mb-2">لا توجد سكربتات محفوظة بعد</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          عند توليد أي سكربت ريلز يعجبك، اضغط على زر "حفظ بالمفضلة" ليتم تصنيفه وتقييمه وحفظه هنا في جهازك دائماً!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      
      {/* Header & Stats Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>مكتبة سكربتاتي المحفوظة</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  {savedScripts.length} سكربت
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                نظّم سكريبتاتك الجاهزة، وقيّم الأفكار الناجحة بالنجوم (1-5) لمعرفة أفضل محتوى جابلك تفاعل
              </p>
            </div>
          </div>

          {/* Quick Sort & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Filter by rating */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <select
                value={minRatingFilter}
                onChange={(e) => setMinRatingFilter(parseInt(e.target.value))}
                className="bg-transparent text-slate-300 outline-none cursor-pointer text-xs"
              >
                <option value={0}>كل التقييمات</option>
                <option value={5}>⭐⭐⭐⭐⭐ (5 نجوم فقط)</option>
                <option value={4}>⭐⭐⭐⭐ (4 نجوم فما فوق)</option>
                <option value={3}>⭐⭐⭐ (3 نجوم فما فوق)</option>
              </select>
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-300 outline-none cursor-pointer text-xs"
              >
                <option value="newest">الأحدث أولاً</option>
                <option value="rating">الأعلى تقييماً ⭐</option>
                <option value="oldest">الأقدم أولاً</option>
                <option value="scenes">الأكثر مشاهد</option>
              </select>
            </div>

          </div>
        </div>

        {/* Search bar */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالعنوان، أو نص الهوك، أو الوسوم المحفوظة..."
            className="w-full rounded-2xl bg-slate-950 border border-slate-800 pr-11 pl-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500/60"
          />
        </div>

        {/* Category Classification Filter Tabs */}
        <div className="mt-4 pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>تصنيفات المحتوى:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* "All" button */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer font-bold ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الكل</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCategory === 'all' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {categoryCounts['all'] || 0}
              </span>
            </button>

            {/* Dynamic category tabs */}
            {SCRIPT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer font-semibold ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : cat.color}`} />
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid of Saved Classified Scripts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScripts.map((script, idx) => {
          const currentCatId = script.category || (script.tone === 'story' ? 'vlog' : script.tone) || 'other';
          const catMeta = getCategoryMeta(currentCatId);
          const CatIcon = catMeta.icon;
          const isEditingCat = editingCategoryId === script.id;

          return (
            <div
              key={script.id || idx}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-amber-500/40 transition-all shadow-md flex flex-col justify-between group"
            >
              <div>
                
                {/* Card Top: Category Badge (Clickable to switch) + Scenes + Date */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
                  
                  {/* Category Selector Badge */}
                  <div className="relative">
                    <button
                      onClick={() => setEditingCategoryId(isEditingCat ? null : (script.id || ''))}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${catMeta.badgeBg} ${catMeta.badgeText} ${catMeta.badgeBorder} hover:brightness-125`}
                      title="اضغط لتغيير تصنيف هذا السكربت"
                    >
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{catMeta.name}</span>
                      <span className="text-[10px] opacity-70">▾</span>
                    </button>

                    {/* Popover to switch category */}
                    {isEditingCat && (
                      <div className="absolute top-8 right-0 z-30 w-52 rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl p-1.5 space-y-1 animate-in fade-in duration-150">
                        <div className="text-[10px] font-bold text-slate-400 px-2 py-1">
                          تغيير التصنيف إلى:
                        </div>
                        {SCRIPT_CATEGORIES.map((cat) => {
                          const IconComp = cat.icon;
                          const isCatSelected = currentCatId === cat.id;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => handleCategoryChange(script.id || '', cat.id)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer text-right ${
                                isCatSelected
                                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                                  : 'text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <IconComp className={`w-3.5 h-3.5 ${cat.color}`} />
                                <span>{cat.name}</span>
                              </div>
                              {isCatSelected && <Check className="w-3 h-3 text-amber-400" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Scenes count & Date */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 flex items-center gap-1">
                      <Clapperboard className="w-3 h-3 text-amber-400" />
                      {script.scenes?.length || 0} مشاهد
                    </span>

                    {script.createdAt && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(script.createdAt).toLocaleDateString('ar-IQ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Script Title */}
                <h4 className="text-base sm:text-lg font-black text-white leading-snug mb-2 group-hover:text-amber-300 transition-colors">
                  {script.title}
                </h4>

                {/* Hook preview */}
                {script.hookOptions?.[0] && (
                  <p className="text-xs text-slate-300 line-clamp-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 mb-3 leading-relaxed">
                    <strong className="text-amber-400">الهوك: </strong>
                    "{script.hookOptions[0].spokenText}"
                  </p>
                )}

                {/* 1-5 Star Rating Row */}
                <div className="flex items-center justify-between bg-slate-950/60 px-3.5 py-2.5 rounded-2xl border border-slate-800/80 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">
                      تقييم التجربة والنجاح:
                    </span>
                    {script.rating === 5 && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                        فكرة مليونية!
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <StarRating
                      rating={script.rating || 0}
                      onChange={(newRating) => onUpdateRating && onUpdateRating(script.id || '', newRating)}
                    />
                    <span className="text-xs font-mono font-bold text-amber-400 min-w-[32px] text-left">
                      {script.rating ? `${script.rating}/5` : 'بدون'}
                    </span>
                  </div>
                </div>

                {/* Tags row with Add Tag */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {script.tags?.map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800"
                    >
                      #{t}
                    </span>
                  ))}

                  {newTagInputId === script.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tagText}
                        onChange={(e) => setTagText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTagSubmit(script.id || '');
                          if (e.key === 'Escape') setNewTagInputId(null);
                        }}
                        autoFocus
                        placeholder="وسم جديد..."
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-amber-500/60 text-white outline-none w-20"
                      />
                      <button
                        onClick={() => handleAddTagSubmit(script.id || '')}
                        className="text-[10px] text-amber-400 hover:text-white cursor-pointer px-1"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setNewTagInputId(script.id || '');
                        setTagText('');
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/40 text-slate-500 hover:text-slate-300 border border-dashed border-slate-800 hover:border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                      title="إضافة وسم مخصص"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>وسم</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
                <button
                  onClick={() => onDeleteScript(script.id || '')}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="حذف من المحفوظات"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenTeleprompter(script)}
                    className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer font-semibold"
                  >
                    <Tv2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>تلقين</span>
                  </button>

                  <button
                    onClick={() => onSelectScript(script)}
                    className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>عرض السكربت</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}

        {filteredScripts.length === 0 && (
          <div className="col-span-full p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 space-y-2">
            <Star className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="font-bold text-white">لا توجد سكربتات تطابق هذا التصنيف أو التقييم أو البحث</p>
            <p className="text-xs text-slate-500">
              جرب تغيير التقييم المختار أو اختيار "كل التقييمات" والبحث مرة أخرى.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
