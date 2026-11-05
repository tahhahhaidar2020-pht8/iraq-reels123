import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Check, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Smartphone, 
  CreditCard, 
  KeyRound, 
  Copy, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { OwnerPricingConfig, UserSubscriptionState } from '../types';
import confetti from 'canvas-confetti';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricingConfig: OwnerPricingConfig;
  userState: UserSubscriptionState;
  onActivateCode: (code: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  onOpenOwnerPanel?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  pricingConfig,
  userState,
  onActivateCode,
  onOpenOwnerPanel,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [activationMessage, setActivationMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [copiedPayment, setCopiedPayment] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setIsActivating(true);
    setActivationMessage(null);

    try {
      const res = await onActivateCode(promoCode.trim());
      if (res.success) {
        setActivationMessage({ text: res.message || 'تم التفعيل بنجاح!', isError: false });
        try {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}
      } else {
        setActivationMessage({ text: res.error || 'كود غير صحيح.', isError: true });
      }
    } catch {
      setActivationMessage({ text: 'تعذر التحقق من الكود حالياً.', isError: true });
    } finally {
      setIsActivating(false);
    }
  };

  const copyNumber = (num: string, label: string) => {
    navigator.clipboard.writeText(num);
    setCopiedPayment(label);
    setTimeout(() => setCopiedPayment(null), 2000);
  };

  const formatPrice = (amount: number) => {
    return `${amount.toLocaleString('en-US')} ${pricingConfig.currency}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 text-xs font-black shadow-inner">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>باقات صناع المحتوى العراقيين VIP</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            اصنع ريلز احترافية تتصدر الإكسبلور بدون حدود 🚀
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            سكربتات ريلز غير محدودة، فحص الحسابات التلقائي، صائد الهوكات، وشاشة الملقن الذكي
          </p>

          {/* Owner Recognition Banner */}
          {userState.isOwner && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3 mt-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">
                  أهلاً بك يا مالك التطبيق ({pricingConfig.ownerEmail}): حسابك مجاني 100% مدى الحياة!
                </span>
              </div>
              {onOpenOwnerPanel && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenOwnerPanel();
                  }}
                  className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-[11px] hover:brightness-110 cursor-pointer"
                >
                  لوحة تعديل الأسعار ⚙️
                </button>
              )}
            </div>
          )}

          {/* Special Discount Notice if configured */}
          {pricingConfig.discountNotice && !userState.isOwner && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold inline-block mt-1">
              {pricingConfig.discountNotice}
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
          
          {/* 1. Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`rounded-3xl p-5 sm:p-6 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedPlan === 'monthly'
                ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500 shadow-xl shadow-amber-500/10'
                : 'bg-slate-950/70 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-slate-400 mb-1">الباقة الشهرية</div>
              <div className="text-2xl font-black text-white font-mono">
                {formatPrice(pricingConfig.monthlyPrice)}
                <span className="text-xs text-slate-400 font-normal"> / شهرياً</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                مثالية للتجربة وإطلاق أول 30 ريلز شهرياً.
              </p>

              <ul className="space-y-2.5 mt-5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>توليد سكربتات ريلز غير محدودة</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>شاشة الملقن الذكي للتصوير</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>فحص وتقييم البروفايل التلقائي</span>
                </li>
              </ul>
            </div>

            <button
              className={`w-full mt-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                selectedPlan === 'monthly'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              اختر الشهرية
            </button>
          </div>

          {/* 2. Yearly Plan (Best Value / Most Popular) */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`rounded-3xl p-5 sm:p-6 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedPlan === 'yearly'
                ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/20'
                : 'bg-slate-950/70 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
              الأكثر توفيراً وشعبية ⭐
            </div>

            <div>
              <div className="text-xs font-bold text-amber-400 mb-1">الباقة السنوية VIP</div>
              <div className="text-2xl font-black text-white font-mono">
                {formatPrice(pricingConfig.yearlyPrice)}
                <span className="text-xs text-slate-400 font-normal"> / سنوياً</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                توفير أكثر من 35% لصناع المحتوى والبراندات الجادة.
              </p>

              <ul className="space-y-2.5 mt-5 text-xs text-slate-200">
                <li className="flex items-center gap-2 font-bold text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>وصول فوري وشامل لجميع الميزات 24/7</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>تصدير ملفات PDF وText للفرق</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>استوديو تطوير اللهجة العراقية المتكامل</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>صائد الهوكات الفيروسية وترندات بغداد</span>
                </li>
              </ul>
            </div>

            <button
              className={`w-full mt-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                selectedPlan === 'yearly'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              اختر السنوية (الأفضل)
            </button>
          </div>

          {/* 3. Lifetime VIP Plan */}
          <div
            onClick={() => setSelectedPlan('lifetime')}
            className={`rounded-3xl p-5 sm:p-6 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedPlan === 'lifetime'
                ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-500 shadow-xl shadow-rose-500/10'
                : 'bg-slate-950/70 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-rose-400 mb-1">باقة مدى الحياة</div>
              <div className="text-2xl font-black text-white font-mono">
                {formatPrice(pricingConfig.lifetimePrice)}
                <span className="text-xs text-slate-400 font-normal"> / دفعة واحدة</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                ادفع مرة واحدة واستمتع للأبد مع كافة التحديثات المستقبلية.
              </p>

              <ul className="space-y-2.5 mt-5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>بدون أي اشتراك شهري أو سنوي</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>دعم فني خاص على الواتساب</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>كافة الموديلات العراقية المطورة تلقائياً</span>
                </li>
              </ul>
            </div>

            <button
              className={`w-full mt-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                selectedPlan === 'lifetime'
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              اختر مدى الحياة
            </button>
          </div>

        </div>

        {/* Payment Methods & How to Pay in Iraq */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h4 className="text-sm font-black text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>طرق الدفع المتوفرة داخل العراق:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Zain Cash */}
            {pricingConfig.zainCashNumber && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">محفظة زين كاش (Zain Cash)</div>
                  <div className="text-xs font-mono font-bold text-amber-300 dir-ltr text-right">
                    {pricingConfig.zainCashNumber}
                  </div>
                </div>
                <button
                  onClick={() => copyNumber(pricingConfig.zainCashNumber, 'zain')}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  title="نسخ الرقم"
                >
                  {copiedPayment === 'zain' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* FastPay */}
            {pricingConfig.fastPayNumber && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">فاست بي / آسيا حوالة</div>
                  <div className="text-xs font-mono font-bold text-rose-300 dir-ltr text-right">
                    {pricingConfig.fastPayNumber}
                  </div>
                </div>
                <button
                  onClick={() => copyNumber(pricingConfig.fastPayNumber, 'fastpay')}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  title="نسخ الرقم"
                >
                  {copiedPayment === 'fastpay' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* QiCard / Master */}
            {pricingConfig.qiCardNumber && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">سوبر كي / ماستركارد</div>
                  <div className="text-xs font-mono font-bold text-emerald-300 dir-ltr text-right">
                    {pricingConfig.qiCardNumber}
                  </div>
                </div>
                <button
                  onClick={() => copyNumber(pricingConfig.qiCardNumber, 'qi')}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  title="نسخ الرقم"
                >
                  {copiedPayment === 'qi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <span>
              💡 بعد إرسال المبلغ، تواصل مع الدعم لإرسال وصل الدفع واستلام كود التفعيل الفوري.
            </span>
            {pricingConfig.whatsappContact && (
              <a
                href={`https://wa.me/${pricingConfig.whatsappContact.replace(/\+/g, '')}?text=${encodeURIComponent(`مرحباً، أود الاشتراك في بوت عراق ريلز - باقة (${selectedPlan})`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-xs shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال الإشعار عبر واتساب</span>
              </a>
            )}
          </div>
        </div>

        {/* Promo Code & Instant Activation Form */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>عندك كود تفعيل أو بطاقة اشتراك؟</span>
            </div>
            <p className="text-[11px] text-slate-500">أدخل الكود لتفعيل اشتراكك فورياً بدون انتظار</p>
          </div>

          <form onSubmit={handleApplyCode} className="w-full sm:w-auto flex items-center gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="مثال: VIP2025"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 uppercase"
            />
            <button
              type="submit"
              disabled={isActivating || !promoCode.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isActivating ? 'جارِ التحقق...' : 'تفعيل'}
            </button>
          </form>
        </div>

        {activationMessage && (
          <div className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${activationMessage.isError ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'}`}>
            {activationMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{activationMessage.text}</span>
          </div>
        )}

      </div>
    </div>
  );
};
