import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Tv2, 
  MessageSquareText, 
  BookOpen, 
  BookmarkCheck,
  Video,
  Crown,
  Settings,
  Zap,
  Gem
} from 'lucide-react';
import { UserSubscriptionState, OwnerPricingConfig } from '../types';

interface HeaderProps {
  activeTab: 'generator' | 'hooks' | 'teleprompter' | 'chat' | 'slang' | 'saved';
  setActiveTab: (tab: 'generator' | 'hooks' | 'teleprompter' | 'chat' | 'slang' | 'saved') => void;
  savedCount: number;
  userState: UserSubscriptionState;
  pricingConfig: OwnerPricingConfig;
  onOpenSubscriptionModal: () => void;
  onOpenOwnerModal: () => void;
}

interface TabItem {
  id: 'generator' | 'hooks' | 'teleprompter' | 'chat' | 'slang' | 'saved';
  label: string;
  icon: any;
  badge?: string;
  count?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  savedCount,
  userState,
  pricingConfig,
  onOpenSubscriptionModal,
  onOpenOwnerModal,
}) => {
  const tabs: TabItem[] = [
    { id: 'generator', label: 'مُوَلّد السكربتات', icon: Sparkles, badge: 'رئيسي' },
    { id: 'hooks', label: 'صائد الهوكات', icon: Flame, badge: 'ترند' },
    { id: 'teleprompter', label: 'الملقن الذكي', icon: Tv2 },
    { id: 'chat', label: 'مستشار المحتوى', icon: MessageSquareText, badge: 'فحص الحساب' },
    { id: 'slang', label: 'قاموس التعبيرات', icon: BookOpen },
    { id: 'saved', label: 'سكربتاتي', icon: BookmarkCheck, count: savedCount },
  ];

  const remainingFree = Math.max(0, pricingConfig.freeDailyLimit - userState.usageToday);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 shadow-lg shadow-amber-500/20 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-rose-300 to-amber-400 bg-clip-text text-transparent">
                  عراق ريلز
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hidden md:flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ذكاء اصطناعي فائق السرعة
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
                بوت صناعة سكربتات وفحص حسابات إنستغرام باللهجة العراقية
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 max-w-full no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>

                  {tab.badge && (
                    <span className="hidden xl:inline-block text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {tab.badge}
                    </span>
                  )}

                  {typeof tab.count === 'number' && tab.count > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 px-1">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User / Owner Subscription Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            {userState.isOwner ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenOwnerModal}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="لوحة تحكم وتحديد أسعار الاشتراكات للمالك"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">لوحة المالك والأسعار</span>
                  <Settings className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            ) : userState.isPro ? (
              <button
                onClick={onOpenSubscriptionModal}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>اشتراك VIP مفعل</span>
              </button>
            ) : (
              <button
                onClick={onOpenSubscriptionModal}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <Gem className="w-3.5 h-3.5 text-slate-950" />
                <span>الترقية للباقة الاحترافية</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-950/20 text-slate-950 font-mono">
                  {remainingFree} متبقي
                </span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
