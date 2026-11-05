import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Save, 
  ShieldCheck, 
  DollarSign, 
  RefreshCw, 
  Check, 
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Key,
  Smartphone,
  Tag
} from 'lucide-react';
import { OwnerPricingConfig } from '../types';

interface OwnerPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OwnerPricingConfig;
  onSaveConfig: (updatedConfig: OwnerPricingConfig) => Promise<boolean>;
  onPreviewAsVisitor: () => void;
}

export const OwnerPricingModal: React.FC<OwnerPricingModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onPreviewAsVisitor,
}) => {
  const [formData, setFormData] = useState<OwnerPricingConfig>({ ...config });
  const [newPromoCode, setNewPromoCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const ok = await onSaveConfig(formData);
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMessage('حدث خطأ أثناء حفظ الإعدادات على الخادم.');
      }
    } catch {
      setErrorMessage('تعذر الاتصال بالخادم.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPromoCode = () => {
    if (!newPromoCode.trim()) return;
    const code = newPromoCode.trim().toUpperCase();
    if (!formData.promoCodes.includes(code)) {
      setFormData({
        ...formData,
        promoCodes: [...formData.promoCodes, code],
      });
      setNewPromoCode('');
    }
  };

  const handleRemovePromoCode = (codeToRemove: string) => {
    setFormData({
      ...formData,
      promoCodes: formData.promoCodes.filter((c) => c !== codeToRemove),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pb-5 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>لوحة تحكم المالك والاشتراكات</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>تحديد أسعار الاشتراكات وإدارة الباقات</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
              صلاحية المالك
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            الحساب: <span className="font-mono text-amber-300 font-bold">{formData.ownerEmail}</span> • وصول مجاني شامل لكافة الميزات مدى الحياة.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Section 1: Prices & Currency */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>1. أسعار الباقات والعملة:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-bold">
                  سعر الباقة الشهرية
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={formData.monthlyPrice}
                  onChange={(e) => setFormData({ ...formData, monthlyPrice: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-bold">
                  سعر الباقة السنوية (VIP)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.yearlyPrice}
                  onChange={(e) => setFormData({ ...formData, yearlyPrice: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-bold">
                  سعر باقة مدى الحياة
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={formData.lifetimePrice}
                  onChange={(e) => setFormData({ ...formData, lifetimePrice: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-bold">
                  العملة المعروضة
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as 'د.ع' | '$' })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-amber-500 outline-none cursor-pointer"
                >
                  <option value="د.ع">دينار عراقي (د.ع)</option>
                  <option value="$">دولار أمريكي ($)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-bold">
                  الحد اليومي لتوليد السكربتات للزوار المجانيين
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.freeDailyLimit}
                  onChange={(e) => setFormData({ ...formData, freeDailyLimit: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-500 outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  بعد استهلاك هذا العدد، تظهر للمستخدم نافذة الاشتراك بالأسعار التي تحددها.
                </span>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1.5 font-bold">
                  نص شريط الخصم الترويجي (Banner)
                </label>
                <input
                  type="text"
                  value={formData.discountNotice}
                  onChange={(e) => setFormData({ ...formData, discountNotice: e.target.value })}
                  placeholder="مثال: خصم 40% بمناسبة الافتتاح!"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Wallets in Iraq */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>2. بيانات استلام الأموال بالعراق:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-bold">
                  رقم محفظة زين كاش
                </label>
                <input
                  type="text"
                  value={formData.zainCashNumber}
                  onChange={(e) => setFormData({ ...formData, zainCashNumber: e.target.value })}
                  placeholder="078xxxxxxxx"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-bold">
                  رقم فاست بي / آسيا حوالة
                </label>
                <input
                  type="text"
                  value={formData.fastPayNumber}
                  onChange={(e) => setFormData({ ...formData, fastPayNumber: e.target.value })}
                  placeholder="075xxxxxxxx"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-bold">
                  سوبر كي / كارد
                </label>
                <input
                  type="text"
                  value={formData.qiCardNumber}
                  onChange={(e) => setFormData({ ...formData, qiCardNumber: e.target.value })}
                  placeholder="9000-xxxx-xxxx"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-bold">
                  رقم الواتساب لاستلام الإشعارات
                </label>
                <input
                  type="text"
                  value={formData.whatsappContact}
                  onChange={(e) => setFormData({ ...formData, whatsappContact: e.target.value })}
                  placeholder="+9647800000000"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1 font-bold">
                  يوزر التلغرام (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.telegramContact}
                  onChange={(e) => setFormData({ ...formData, telegramContact: e.target.value })}
                  placeholder="@MyHandle"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: VIP Promo Codes Management */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span>3. إدارة أكواد التفعيل VIP للمشتركين:</span>
            </h4>

            <p className="text-xs text-slate-400">
              يمكنك إنشاء أكواد تفعيل خاصة وإرسالها للمشتركين بعد دفعهم المبلغ لتفعيل حساباتهم فورياً.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newPromoCode}
                onChange={(e) => setNewPromoCode(e.target.value)}
                placeholder="أدخل كود جديد (مثلاً: BAGHDAD_VIP_2025)"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white uppercase focus:border-amber-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddPromoCode}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة كود</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.promoCodes.map((code) => (
                <div
                  key={code}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-300"
                >
                  <span>{code}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePromoCode(code)}
                    className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="حذف الكود"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>تم حفظ كافة الأسعار والإعدادات بنجاح!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onPreviewAsVisitor();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>معاينة واجهة الاشتراك كما يراها الزائر</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>جارِ حفظ الأسعار...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ الأسعار والإعدادات 💾</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
