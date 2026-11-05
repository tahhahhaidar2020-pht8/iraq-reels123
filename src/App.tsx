/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScriptGeneratorForm } from './components/ScriptGeneratorForm';
import { ScriptViewer } from './components/ScriptViewer';
import { TeleprompterModal } from './components/TeleprompterModal';
import { HooksLab } from './components/HooksLab';
import { ChatAssistant } from './components/ChatAssistant';
import { SlangVault } from './components/SlangVault';
import { SavedScripts } from './components/SavedScripts';
import { 
  InstagramScript, 
  IraqiDialect, 
  ScriptTone, 
  ScriptDuration,
  OwnerPricingConfig,
  UserSubscriptionState
} from './types';
import { SubscriptionModal } from './components/SubscriptionModal';
import { OwnerPricingModal } from './components/OwnerPricingModal';
import confetti from 'canvas-confetti';
import { AlertCircle, Crown, ShieldCheck } from 'lucide-react';

const OWNER_EMAIL = 'tahhahhaidar2020@gmail.com';

const DEFAULT_PRICING: OwnerPricingConfig = {
  ownerEmail: OWNER_EMAIL,
  monthlyPrice: 15000,
  yearlyPrice: 120000,
  lifetimePrice: 250000,
  currency: 'د.ع',
  freeDailyLimit: 3,
  zainCashNumber: '07801234567',
  qiCardNumber: '9000-1234-5678',
  fastPayNumber: '07501234567',
  whatsappContact: '+9647801234567',
  telegramContact: '@IraqReelsOwner',
  promoCodes: ['VIP2025', 'ALFAHOOD', 'HAIDAR_VIP', 'BAGHDAD_PRO', 'IRAQ_REELS_PRO'],
  discountNotice: '🔥 عرض خاص لفترة محدودة: خصم 40% على الباقة السنوية!',
  isSubscriptionEnforced: true,
};

const INITIAL_SAVED_SCRIPTS: InstagramScript[] = [
  {
    id: 'demo-script-1',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    title: 'سر استهلاك الجاي بالعراق بعز الصيف 50 درجة! ☕🔥',
    dialect: 'baghdadi',
    tone: 'comedy',
    category: 'comedy',
    rating: 5,
    tags: ['ترند_عراقي', 'ضحك', 'صيف_العراق'],
    topic: 'ليش العراقيين يشربون جاي حار حتى بالصيف',
    estimatedWordsCount: 110,
    hookOptions: [
      {
        hookType: 'صادم ومستفز للفضول',
        spokenText: 'دقيقة عيوني.. صدك جذب؟ درجة الحرارة 52 بالظل، والعراقي كاعد يشرب استكان جاي يغلي؟!',
        onScreenText: 'درجة الحرارة 52° والوضع طبيعي؟! 🔥☕',
        visualAction: 'لقطة مقربة للوجه مع نظرة ذهول، ثم توجيه الكاميرا لاستكان جاي مع بخار كثيف',
      },
      {
        hookType: 'تساؤل ونقاش نفسي',
        spokenText: 'سألت نفسك ليش كل شعوب العالم تشرب مثلجات بالحر، إلا إحنا بالعراق نخلي القوري ع النار 24 ساعة؟',
        onScreenText: 'ليش بس العراقيين يسوون هيج؟ 🤔',
        visualAction: 'الجلوس بطريقة مروق مع هز الرأس واستكان الجاي بيدك',
      },
      {
        hookType: 'تحدي وسخرية واقعية',
        spokenText: 'إذا تكول للجاي لا بعز تموز، فأنت مو عراقي رسمي.. باوع العلم شيكول!',
        onScreenText: 'ممنوع تعترض ع الجاي العراقي 🛑',
        visualAction: 'رفع الإصبع للكاميرا بتحدي وابتسامة عريضة',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        timestamp: '0:00 - 0:04',
        visualCue: 'كاميرا سريعة تركز على كوب جاي عراقي مخدر وفوقه شمس حارقة أو مروحة تفتر',
        spokenText: 'دقيقة عيوني.. صدك جذب؟ درجة الحرارة 52 بالظل، والعراقي كاعد يشرب استكان جاي يغلي؟!',
        onScreenText: 'الحرارة 52° والجاي يغلي! 🔥',
        audioSfx: 'صوت هواء حار، يليه صوت سكب الجاي في الاستكان (Glug Glug)',
      },
      {
        sceneNumber: 2,
        timestamp: '0:04 - 0:15',
        visualCue: 'المتحدث يرجع خطوة للخلف، يشرح بحركات يدين عراقية حماسية',
        spokenText: 'السالفة مو عناد ولا ضربة شمس يمعود! علمياً السوائل الحارة تحفز الغدد العرقية فتسوي تبريد ذاتي للجسم.. يعني تكييف داخلي طكة وحدة!',
        onScreenText: 'العلم شيكول؟ تبريد ذاتي! 🧠',
        audioSfx: 'موسيقى ترند عراقي إيقاع خفيف وممتع',
      },
      {
        sceneNumber: 3,
        timestamp: '0:15 - 0:26',
        visualCue: 'لقطة مقربة سريعة للعين مع ابتسامة (POV الشخص اللي مكيّف ع الهيل)',
        spokenText: 'وثانياً، استكان الجاي المهيّل مو مجرد مشروب.. هذا مهدئ أعصاب، روقان بعد الدوام، وحل لأي مشكلة عائلية وسياسية تكعدون تحلوها بالصالة!',
        onScreenText: 'استكان الجاي = حل لكل مشاكلك ☕✨',
        audioSfx: 'صوت قرقعة ملعقة الاستكان الخفيفة الرنانة',
      },
      {
        sceneNumber: 4,
        timestamp: '0:26 - 0:35',
        visualCue: 'رفع الاستكان باتجاه الكاميرا كأنك تعزم المشاهد، والإشارة باليد الأخرى للتعليقات',
        spokenText: 'هسة اعترف بالتعليقات.. جم استكان جاي شربت اليوم من الصبح لهسة؟ ولا تنسى تدز الفيديو لصاحبك المدمن جاي!',
        onScreenText: 'جم استكان شربت اليوم؟ شاركنا بالتعليقات 👇',
        audioSfx: 'نغمة هوك خاتمة صاعدة ومميزة',
      },
    ],
    deliveryNotes: {
      vibe: 'طاقة عالية، روح مرحة، وعفوية بغدادية قريبة من القلب',
      bodyLanguage: 'حركات أصابع اليد عند الشرح، اتصال بصري مباشر بالعدسة، ابتسامة واثقة',
      pacing: 'إيقاع سريع في أول 4 ثواني لمنع السكرول، ثم هدوء نسبي في نقطة العلم، ثم تصعيد في الكول تو أكشن',
    },
    instagramCaption: `والله مو عناد.. العلم يكول استكان الجاي بالحر تكييف طبيعي للجسم! 😂🔥
انتو شتكولون.. كم استكان جاي ينزل بالمعدة باليوم العراقي الصيفي؟
سيفوا الفيديو يمكم ودزوه لأكثر واحد بالبيت ميعرف يعيش بدون قوري الجاي! ☕✨`,
    hashtags: [
      '#العراق',
      '#بغداد',
      '#ريلز_عراقي',
      '#اكسبلور_العراق',
      '#جاي_عراقي',
      '#سوالف_عراقية',
      '#ترند_العراق',
      '#ريلز_العراق',
      '#ضحك_عراقي',
    ],
    callToAction: 'اعترف بالتعليقات جم استكان شربت اليوم، ودز الفيديو للمدمن جاي!',
  },
  {
    id: 'demo-script-2',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    title: '3 حركات تحمي بطاقتك الذكية وحسابك المصرفي من السرقة بالعراق 💳🔒',
    dialect: 'white_iraqi',
    tone: 'educational',
    category: 'educational',
    rating: 4,
    tags: ['أمن_رقمي', 'بنوك_العراق', 'توعية_مالية'],
    topic: 'حماية البطاقات الذكية والحسابات البنكية من النصب بالعراق',
    estimatedWordsCount: 130,
    hookOptions: [
      {
        hookType: 'صادم وتحذيري',
        spokenText: 'دير بالك! رسالة وحدة ع الواتساب تكدر تصفر حسابك بالكي كارد أو الماستر بثواني.. شوف شتسوي!',
        onScreenText: 'حسابك البنكي بخطر لو سويت هاي الغلطة! ⚠️💳',
        visualAction: 'النظر للكاميرا بحزم وإمساك بطاقة بنكية مع تغطية الأرقام',
      },
      {
        hookType: 'سؤال مباشر',
        spokenText: 'كم مرة وصلتك رسالة "تم ربح جائزة، أرسل الكود للتأكيد"؟ لو دزيت الكود.. راحت فلوسك صابر!',
        onScreenText: 'أكبر فخ نصب يقع بيه العراقيين 🚨',
        visualAction: 'توجيه شاشة الهاتف للكاميرا كأنها رسالة احتيال',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        timestamp: '0:00 - 0:04',
        visualCue: 'لقطة مقربة للبطاقة المصرفية مع علامة تحذير حمراء على الشاشة',
        spokenText: 'دير بالك! رسالة وحدة ع الواتساب تكدر تصفر حسابك بالكي كارد أو الماستر بثواني.. شوف شتسوي!',
        onScreenText: 'حسابك بخطر! ⚠️',
        audioSfx: 'صوت تنبيه رقمي سريع (Alert beep)',
      },
      {
        sceneNumber: 2,
        timestamp: '0:04 - 0:18',
        visualCue: 'المتحدث يعد على أصابعه 1-2-3 بتركيز ونبرة ناصحة',
        spokenText: 'أولاً: مستحيل أي مصرف عراقي يطلب منك رمز الـ OTP برسالة. ثانياً: لا تنطي الثلاث أرقام اللي بظهر البطاقة لأي مخلوق حتى لو كال أني مدير الفرع!',
        onScreenText: 'رمز الـ OTP = خط أحمر 🛑',
        audioSfx: 'نغمة إيقاعية هادئة تشد التركيز',
      },
      {
        sceneNumber: 3,
        timestamp: '0:18 - 0:32',
        visualCue: 'إشارة واضحة للإعدادات في تطبيق الموبايل البنكي',
        spokenText: 'وثالثاً: فعّل إشعارات السحب الفوري ع الموبايل حتى تكشف أي حركة مشبوهة بنفس اللحظة وتغلق البطاقة من التطبيق بكبسة زر.',
        onScreenText: 'فعّل إشعارات السحب الفورية 📱✅',
        audioSfx: 'صوت إشعار هاتف ناجح (Ding)',
      },
      {
        sceneNumber: 4,
        timestamp: '0:32 - 0:40',
        visualCue: 'حركة اليد للكاميرا بدعوة الحفظ والمشاركة لحماية الأهل',
        spokenText: 'سيف الفيديو يمك بالخاص ودزه لأهلك بالكروب ترة هواية كبار سن ديقعون بهذا الفخ وميدرون!',
        onScreenText: 'سيف الفيديو ودزه لأهلك يحميهم 🛡️',
        audioSfx: 'نغمة هوك ختامية قوية',
      },
    ],
    deliveryNotes: {
      vibe: 'ثقة، هدوء، ونبرة نصيحة أخوية حريصة',
      bodyLanguage: 'إشارات يد واضحة ومحددة مع تواصل بصري ثابت',
      pacing: 'نطق مخارج الحروف بهدوء ووضوح حتى يفهمها المتابع البسيط',
    },
    instagramCaption: `لا تنطي كود الـ OTP لأي أحد لو شكد ما حلفلك! 💳🛑
هواي عراقيين خسروا فلوسهم بسبب رسائل وهمية.
سيفوا الفيديو يمكم وشاركوه ويا أهلكم وأصدقائكم حتى نوقف هاي السوالف! 🔒`,
    hashtags: ['#العراق', '#وعي_مالي', '#حماية_رقمية', '#ماستركارد', '#كي_كارد', '#نصائح_تقنية'],
    callToAction: 'سيف الفيديو ودزه لأهلك بالكروب يحميهم من النصب!',
  },
  {
    id: 'demo-script-3',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    title: 'فلوق عصرونية بشارع المتنبي والقشلة وسوالف الشاي والكتب 📚☕',
    dialect: 'baghdadi',
    tone: 'story',
    category: 'vlog',
    rating: 5,
    tags: ['فلوق_بغداد', 'المتنبي', 'القشلة', 'تراث_عراقي'],
    topic: 'فلوق وأجواء يوم الجمعة في شارع المتنبي والقشلة',
    estimatedWordsCount: 120,
    hookOptions: [
      {
        hookType: 'فضول وحنين تراثي',
        spokenText: 'تعالوا وياية نعيش أجمل ساعتين ببغداد.. مكان تحس بيه روح دجلة والتاريخ بكل زاوية!',
        onScreenText: 'أجمل ساعتين ببغداد الحبيبة ❤️🇮🇶',
        visualAction: 'دوران بطيء بالكاميرا بزاوية عريضة يظهر فيها تمثال المتنبي وضفاف دجلة',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        timestamp: '0:00 - 0:05',
        visualCue: 'دخول ساحر لشارع المتنبي مع الكتب المصفوفة وأصوات الناس والشارع',
        spokenText: 'تعالوا وياية نعيش أجمل ساعتين ببغداد.. مكان تحس بيه روح دجلة والتاريخ بكل زاوية!',
        onScreenText: 'شارع المتنبي | الجمعة العصرية 📖✨',
        audioSfx: 'صوت عود عراقي شجي خفيف بالخلفية',
      },
      {
        sceneNumber: 2,
        timestamp: '0:05 - 0:18',
        visualCue: 'لقطات B-roll مقربة لكتب قديمة ونادرة، ولقطة مقهى الشابندر مع الاستكانات',
        spokenText: 'أول محطة لازم مقهى الشابندر.. الاستكان المهيّل والحيطان اللي تسولف عن مئة سنة من أدباء وفنانين العراق.',
        onScreenText: 'مقهى الشابندر.. 100 سنة تاريخ ☕📜',
        audioSfx: 'صوت قرقعة الفناجين والضحكات البغدادية الدافئة',
      },
      {
        sceneNumber: 3,
        timestamp: '0:18 - 0:32',
        visualCue: 'المشي في حدائق القشلة وساعة القشلة الشهيرة وغروب الشمس الذهبي',
        spokenText: 'وبعدها نكعد بحدائق القشلة.. نسيم دجلة العصر ويه غروب الشمس يخليك تنسى كل هموم الأسبوع!',
        onScreenText: 'غروب القشلة ونسمات دجلة 🌅',
        audioSfx: 'موسيقى هادئة تنبض بالجمال',
      },
      {
        sceneNumber: 4,
        timestamp: '0:32 - 0:40',
        visualCue: 'ابتسامة للمصور والكاميرا مع سيلفي وراءك ساعة القشلة',
        spokenText: 'شوكت آخر مرة زرتوا المتنبي؟ اكتبولي بالتعليقات، ودز الفيديو للي تحب تروح وياه الجمعة الجاية!',
        onScreenText: 'منو ودك تروح وياه الجمعة الجاية؟ منشنه 👇',
        audioSfx: 'نغمة ختامية دافئة',
      },
    ],
    deliveryNotes: {
      vibe: 'دفء، هدوء، شجن عراقي جميل، وحب للمدينة',
      bodyLanguage: 'حركات كاميرا سلسة وسينمائية، وابتسامة رايقة',
      pacing: 'إيقاع سردي شاعري بدون استعجال',
    },
    instagramCaption: `بغداد ما ينشبع منها أبد.. خصوصاً عصرية المتنبي وريحة الكتب والچاي بالشابندر ❤️🇮🇶
منو مشتاق لهيج كعدة؟ منشن صديقك اللي لازم تروحون سوا الجمعة الجاية! ✨`,
    hashtags: ['#بغداد', '#المتنبي', '#القشلة', '#فلوق_عراقي', '#ريلز_بغداد', '#دجلة', '#الشابندر'],
    callToAction: 'منشن صاحبك اللي وعدك يوديك المتنبي وما ودّاك!',
  },
  {
    id: 'demo-script-4',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    title: 'إعلان افتتاح كافيه ومطعم عراقي: خصم 40% لأول 50 زبون 🍔🎉',
    dialect: 'baghdadi',
    tone: 'business',
    category: 'business',
    rating: 4,
    tags: ['إعلان_مميز', 'مطاعم_بغداد', 'خصومات', 'المنصور'],
    topic: 'إعلان ترويجي لافتتاح مطعم وبرجر جديد بالمنصور',
    estimatedWordsCount: 115,
    hookOptions: [
      {
        hookType: 'عرض مجنون وصادم',
        spokenText: 'أهل المنصور جهزوا روحكم! اليوم البرجر والستيك بخصم 40%.. بس لأول 50 شخص يوصلون للمحل!',
        onScreenText: 'خصم 40% لأول 50 زبون بالمنصور! 🍔🔥',
        visualAction: 'تقطيع برجر ساخن ينزل منه الجبن الذائب بدقة عالية وبطء (Slow motion)',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        timestamp: '0:00 - 0:04',
        visualCue: 'لقطة سريعة شهية للبرجر والجبن السايح والصوص',
        spokenText: 'أهل المنصور جهزوا روحكم! اليوم البرجر والستيك بخصم 40%.. بس لأول 50 شخص يوصلون للمحل!',
        onScreenText: 'عرض الافتتاح الناري 💥',
        audioSfx: 'صوت شواء اللحم (Sizzle sound)',
      },
      {
        sceneNumber: 2,
        timestamp: '0:04 - 0:15',
        visualCue: 'لقطات من ديكور المطعم الراقي وأماكن الجلوس العائلية الهادئة',
        spokenText: 'المكان فد شي يخبل.. قعدة عائلية وشبابية راقية، وأكلهم لحم عراقي بلدي 100% مو مستورد!',
        onScreenText: 'لحم عراقي بلدي 100% 🥩💯',
        audioSfx: 'موسيقى ترند حماسية سريعة',
      },
      {
        sceneNumber: 3,
        timestamp: '0:15 - 0:26',
        visualCue: 'صاحب المحل يرفع طبق الضيافة ويبتسم للترحيب بالزبائن',
        spokenText: 'والحلو حتى المقبلات والحلويات مسوين عليها عرض خاص بمناسبة الافتتاح الضخم!',
        onScreenText: 'عروض خاصة بمناسبة الافتتاح 🎁',
        audioSfx: 'صوت كرانش مقرمش وسريع',
      },
      {
        sceneNumber: 4,
        timestamp: '0:26 - 0:35',
        visualCue: 'كتابة العنوان بالخط العريض على الشاشة مع إشارة للموقع',
        spokenText: 'موقعنا بالمنصور تقاطع الرواد.. رابط الموقع واللوكيشن بالبايو، تعالوا قبل لا تخلص الوجبات!',
        onScreenText: 'المنصور - تقاطع الرواد 📍 الموقع بالبايو',
        audioSfx: 'نغمة نهاية إعلانية مشوقة',
      },
    ],
    deliveryNotes: {
      vibe: 'حماس تسويقي، طاقة مبيعات عالية، وإغراء بصري للأكل',
      bodyLanguage: 'إشارات سريعة للطبق وللشاشة وللموقع',
      pacing: 'إيقاع تسويقي سريع يشجع على اتخاذ قرار الشراء الفوري',
    },
    instagramCaption: `افتتاح رسمي بنار الأسعار! 🔥🍔
خصم 40% لأول 50 زبون فقط بمناسبة الافتتاح في فرع المنصور.
📍 الموقع: المنصور - تقاطع الرواد. رابط اللوكيشن الكامل بالبايو!`,
    hashtags: ['#المنصور', '#مطاعم_بغداد', '#برجر_عراقي', '#خصم', '#افتتاح', '#بغداد_المنصور'],
    callToAction: 'منشن صاحبك الأكول وكله العشا اليوم عليك بالخصم!',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'hooks' | 'teleprompter' | 'chat' | 'slang' | 'saved'>('generator');
  const [currentScript, setCurrentScript] = useState<InstagramScript | null>(INITIAL_SAVED_SCRIPTS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [prefilledSlang, setPrefilledSlang] = useState<string | undefined>();
  const [prefilledTopic, setPrefilledTopic] = useState<string | undefined>();

  // Teleprompter state
  const [teleprompterScript, setTeleprompterScript] = useState<InstagramScript | null>(null);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);

  // Helper to map script tone to category
  const toneToCategory = (tone: ScriptTone): string => {
    switch (tone) {
      case 'comedy': return 'comedy';
      case 'educational': return 'educational';
      case 'story': return 'vlog';
      case 'business': return 'business';
      case 'podcast': return 'podcast';
      case 'food_review': return 'food_review';
      case 'motivational': return 'motivational';
      default: return 'comedy';
    }
  };

  // Saved scripts state from localStorage
  const [savedScripts, setSavedScripts] = useState<InstagramScript[]>(() => {
    try {
      const stored = localStorage.getItem('iraq_reels_saved_scripts');
      return stored ? JSON.parse(stored) : INITIAL_SAVED_SCRIPTS;
    } catch {
      return INITIAL_SAVED_SCRIPTS;
    }
  });

  // Pricing & Subscription state
  const [pricingConfig, setPricingConfig] = useState<OwnerPricingConfig>(() => {
    try {
      const stored = localStorage.getItem('iraq_reels_pricing_config');
      return stored ? JSON.parse(stored) : DEFAULT_PRICING;
    } catch {
      return DEFAULT_PRICING;
    }
  });

  const [userSubscription, setUserSubscription] = useState<UserSubscriptionState>(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    try {
      const stored = localStorage.getItem('iraq_reels_user_sub');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.lastUsageDate !== todayStr) {
          return { ...parsed, usageToday: 0, lastUsageDate: todayStr };
        }
        return parsed;
      }
    } catch {}

    // Default: tahhahhaidar2020@gmail.com is identified as Owner with 100% Free VIP Lifetime access
    return {
      email: OWNER_EMAIL,
      isOwner: true,
      isPro: true,
      planId: 'lifetime',
      usageToday: 0,
      lastUsageDate: todayStr,
    };
  });

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  // Sync pricing config from server on mount
  useEffect(() => {
    fetch('/api/owner-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setPricingConfig(data.config);
          localStorage.setItem('iraq_reels_pricing_config', JSON.stringify(data.config));
        }
      })
      .catch(() => {});
  }, []);

  // Save user subscription state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('iraq_reels_user_sub', JSON.stringify(userSubscription));
    } catch {}
  }, [userSubscription]);

  const checkAndIncrementUsage = (): boolean => {
    if (userSubscription.isOwner || userSubscription.isPro) {
      return true;
    }
    if (userSubscription.usageToday >= pricingConfig.freeDailyLimit) {
      setIsSubscriptionModalOpen(true);
      setErrorMessage(`لقد استهلكت رصيدك اليومي المجاني (${pricingConfig.freeDailyLimit} سكربتات). يرجى الترقية للباقة الاحترافية لمتابعة الاستخدام غير المحدود!`);
      return false;
    }
    setUserSubscription((prev) => ({
      ...prev,
      usageToday: prev.usageToday + 1,
    }));
    return true;
  };

  const handleActivateCode = async (code: string) => {
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, userEmail: userSubscription.email }),
      });
      const data = await response.json();
      if (data.success) {
        setUserSubscription((prev) => ({
          ...prev,
          isPro: true,
          planId: 'lifetime',
          activatedCode: code,
        }));
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: 'تعذر الاتصال بالخادم للتحقق من الكود.' };
    }
  };

  const handleSaveOwnerPricing = async (updatedConfig: OwnerPricingConfig): Promise<boolean> => {
    try {
      const res = await fetch('/api/owner-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: updatedConfig,
          userEmail: userSubscription.email,
          secretPin: '2025',
        }),
      });
      const data = await res.json();
      if (data.success && data.config) {
        setPricingConfig(data.config);
        localStorage.setItem('iraq_reels_pricing_config', JSON.stringify(data.config));
        return true;
      }
    } catch {}
    return false;
  };

  useEffect(() => {
    try {
      localStorage.setItem('iraq_reels_saved_scripts', JSON.stringify(savedScripts));
    } catch (e) {
      console.error('Failed to sync to local storage', e);
    }
  }, [savedScripts]);

  const handleGenerateScript = async (params: {
    topic: string;
    dialect: IraqiDialect;
    tone: ScriptTone;
    duration: ScriptDuration;
    targetAudience: string;
    additionalNotes: string;
    keyPhrases: string[];
  }) => {
    if (!checkAndIncrementUsage()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const fullScript: InstagramScript = {
          ...result.data,
          id: `script-${Date.now()}`,
          createdAt: new Date().toISOString(),
          dialect: params.dialect,
          tone: params.tone,
          category: toneToCategory(params.tone),
          tags: [params.dialect, params.tone, 'جديد'],
          topic: params.topic,
        };

        setCurrentScript(fullScript);
        setActiveTab('generator');
        
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        setTimeout(() => {
          const viewerEl = document.getElementById('script-output-section');
          if (viewerEl) {
            viewerEl.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        setErrorMessage(result.error || 'فشل توليد السكربت العراقي.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مجدداً.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineScript = async (instruction: string) => {
    if (!currentScript) return;
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/refine-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentScript,
          instruction,
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setCurrentScript({
          ...currentScript,
          ...result.data,
        });
        try {
          confetti({
            particleCount: 35,
            spread: 50,
            origin: { y: 0.8 },
          });
        } catch {}
      } else {
        setErrorMessage(result.error || 'تعذر تعديل السكربت.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'خطأ أثناء تعديل السكربت.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleSaveScript = (scriptToSave: InstagramScript) => {
    const isAlreadySaved = savedScripts.some((s) => s.id === scriptToSave.id);
    if (isAlreadySaved) {
      setSavedScripts((prev) => prev.filter((s) => s.id !== scriptToSave.id));
    } else {
      const withCategory = {
        ...scriptToSave,
        category: scriptToSave.category || (scriptToSave.tone ? toneToCategory(scriptToSave.tone) : 'comedy'),
      };
      setSavedScripts((prev) => [withCategory, ...prev]);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {}
    }
  };

  const handleDeleteSaved = (id: string) => {
    setSavedScripts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateCategory = (id: string, newCategory: string) => {
    setSavedScripts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, category: newCategory } : s))
    );
    if (currentScript?.id === id) {
      setCurrentScript((prev) => (prev ? { ...prev, category: newCategory } : null));
    }
  };

  const handleAddTag = (id: string, newTag: string) => {
    setSavedScripts((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const currentTags = s.tags || [];
          if (!currentTags.includes(newTag)) {
            return { ...s, tags: [...currentTags, newTag] };
          }
        }
        return s;
      })
    );
    if (currentScript?.id === id) {
      setCurrentScript((prev) => {
        if (!prev) return null;
        const currentTags = prev.tags || [];
        return currentTags.includes(newTag) ? prev : { ...prev, tags: [...currentTags, newTag] };
      });
    }
  };

  const handleUpdateRating = (id: string, newRating: number) => {
    setSavedScripts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, rating: newRating } : s))
    );
    if (currentScript?.id === id) {
      setCurrentScript((prev) => (prev ? { ...prev, rating: newRating } : null));
    }
  };

  const handleOpenTeleprompter = (script: InstagramScript) => {
    setTeleprompterScript(script);
    setIsTeleprompterOpen(true);
  };

  const handleHookSelectedForScript = (hookText: string, topicText: string) => {
    setPrefilledTopic(topicText || hookText);
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleGenerateScript({
      topic: topicText || hookText,
      dialect: 'baghdadi',
      tone: 'comedy',
      duration: '30_60',
      targetAudience: 'المتابع العراقي',
      additionalNotes: `اعتمد هذا الهوك تحديداً في البداية: "${hookText}"`,
      keyPhrases: ['صدك جذب', 'فد شي يخبل'],
    });
  };

  const isCurrentScriptSaved = Boolean(
    currentScript && savedScripts.some((s) => s.id === currentScript.id)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedScripts.length}
        userState={userSubscription}
        pricingConfig={pricingConfig}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        onOpenOwnerModal={() => setIsOwnerModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center justify-between gap-3 text-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-300 hover:text-white underline cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* TAB 1: Generator & Main Studio */}
        {activeTab === 'generator' && (
          <div className="space-y-8">
            <ScriptGeneratorForm
              onGenerate={handleGenerateScript}
              isLoading={isLoading}
              prefilledSlang={prefilledSlang}
              prefilledTopic={prefilledTopic}
            />

            {currentScript && (
              <div id="script-output-section" className="pt-2">
                <ScriptViewer
                  script={currentScript}
                  onOpenTeleprompter={handleOpenTeleprompter}
                  onSaveScript={handleSaveScript}
                  isSaved={isCurrentScriptSaved}
                  onRefineScript={handleRefineScript}
                  isRefining={isRefining}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Viral Hooks Lab */}
        {activeTab === 'hooks' && (
          <HooksLab onSelectHookForScript={handleHookSelectedForScript} />
        )}

        {/* TAB 3: Teleprompter standalone preview */}
        {activeTab === 'teleprompter' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <span className="text-3xl">🎥</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              الملقن الذكي للتصوير المباشر أمام الكاميرا
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              شاشة عرض احترافية تمكنك من قراءة السكربت العراقي بانسجام كامل وسرعة قابلة للتحكم، مع ميزة المرآة (Mirror Mode) وزر ملء الشاشة.
            </p>

            {currentScript ? (
              <div className="pt-4">
                <div className="inline-block p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-4 max-w-md text-right">
                  <div className="text-xs text-amber-400 font-bold mb-1">السكربت الجاهز للتلقين:</div>
                  <div className="font-bold text-white text-sm line-clamp-1">{currentScript.title}</div>
                </div>
                <br />
                <button
                  onClick={() => handleOpenTeleprompter(currentScript)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  افتح شاشة الملقن الآن 🎥
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                يرجى توليد أو اختيار سكربت أولاً لتشغيله في الملقن.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AI Content Strategist Chat, Profile Audit & Dialect Enhancer */}
        {activeTab === 'chat' && (
          <ChatAssistant 
            currentScript={currentScript}
            onUseReelIdea={(hook, topic) => {
              handleHookSelectedForScript(hook, topic);
            }}
            onUseDialectText={(text) => {
              setPrefilledTopic(text);
              setActiveTab('generator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 5: Iraqi Slang Vault */}
        {activeTab === 'slang' && (
          <SlangVault
            onInsertSlang={(phrase) => {
              setPrefilledSlang(phrase);
              setActiveTab('generator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 6: Saved Scripts Library with Classification */}
        {activeTab === 'saved' && (
          <SavedScripts
            savedScripts={savedScripts}
            onSelectScript={(script) => {
              setCurrentScript(script);
              setActiveTab('generator');
              setTimeout(() => {
                document.getElementById('script-output-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            onOpenTeleprompter={handleOpenTeleprompter}
            onDeleteScript={handleDeleteSaved}
            onUpdateCategory={handleUpdateCategory}
            onAddTag={handleAddTag}
            onUpdateRating={handleUpdateRating}
          />
        )}

      </main>

      {/* Fullscreen Teleprompter Modal */}
      <TeleprompterModal
        script={teleprompterScript}
        isOpen={isTeleprompterOpen}
        onClose={() => setIsTeleprompterOpen(false)}
      />

      {/* Subscription Modal for Visitors / Users */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        pricingConfig={pricingConfig}
        userState={userSubscription}
        onActivateCode={handleActivateCode}
        onOpenOwnerPanel={() => setIsOwnerModalOpen(true)}
      />

      {/* Owner Pricing Control Modal */}
      <OwnerPricingModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        config={pricingConfig}
        onSaveConfig={handleSaveOwnerPricing}
        onPreviewAsVisitor={() => setIsSubscriptionModalOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-400 font-semibold">عراق ريلز | صانع سكربتات إنستغرام الذكي</span>
          </div>

          <div className="flex items-center gap-3">
            {userSubscription.isOwner ? (
              <button
                onClick={() => setIsOwnerModalOpen(true)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>حساب المالك ({userSubscription.email}) • وصول مجاني شامل ⚙️</span>
              </button>
            ) : (
              <button
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>خطط الاشتراك والترقية VIP</span>
              </button>
            )}
          </div>

          <p className="text-slate-500">
            مصمم خصيصاً لصناع المحتوى في العراق لتوليد ريلز احترافية وزيادة الإكسبلور.
          </p>
        </div>
      </footer>

    </div>
  );
}
