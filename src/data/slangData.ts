export interface SlangItem {
  id: string;
  phrase: string;
  category: 'hook' | 'transition' | 'closer' | 'expression';
  meaning: string;
  exampleUse: string;
  dialect: 'بغدادي' | 'بصراوي/جنوبي' | 'مصلاوي' | 'عراقي عام';
}

export const IRAQI_SLANG_VAULT: SlangItem[] = [
  // Hooks
  {
    id: 'h1',
    phrase: 'دقيقة عيوني.. صدك جذب هذا اللي داسمعه؟!',
    category: 'hook',
    meaning: 'افتتاحية صادمة تلفت انتباه المشاهد فوراً وتجعله يتوقف عن التمرير.',
    exampleUse: 'تستخدم في بداية فيديوهات الأخبار المثيرة أو المعلومات الصادمة.',
    dialect: 'بغدادي',
  },
  {
    id: 'h2',
    phrase: 'جا شني هاي السالفة الما تنبلع؟',
    category: 'hook',
    meaning: 'تعبير جنوبي بليغ يعبر عن الاستنكار أو الفضول الشديد.',
    exampleUse: 'بداية قوية لمناقشة ظاهرة غريبة أو خطأ شائع.',
    dialect: 'بصراوي/جنوبي',
  },
  {
    id: 'h3',
    phrase: 'لحد يكلك ولا تكول لأحد.. هاي السالفة حصرياً بيناتنا!',
    category: 'hook',
    meaning: 'إشعار المشاهد بامتلاك سر أو معلومة خاصة ونادرة.',
    exampleUse: 'لعروض الخصومات، المواقع المفيدة، أو الخدع الحياتية.',
    dialect: 'عراقي عام',
  },
  {
    id: 'h4',
    phrase: 'أشونو هاد الشي.. قفوا معاي دقيقة!',
    category: 'hook',
    meaning: 'افتتاحية مصلاوية ناعمة ومميزة تجذب الأذن فوراً.',
    exampleUse: 'لفيديوهات الاستكشاف أو تجارب الأكل والتراث.',
    dialect: 'مصلاوي',
  },
  {
    id: 'h5',
    phrase: 'لو بيك حظ وطلعتلك هاي الريلز.. لا تسوي سكرول!',
    category: 'hook',
    meaning: 'هوك التحدي والفضول النفسي.',
    exampleUse: 'لفيديوهات التحفيز، الاستثمار، والفرص الذهبية.',
    dialect: 'عراقي عام',
  },
  {
    id: 'h6',
    phrase: 'المصيبة مو هنا.. المصيبة باللي صار بعدين!',
    category: 'hook',
    meaning: 'هوك تشويق تصاعدي عالي جداً.',
    exampleUse: 'لسرد القصص والمواقف الطريفة أو المحرجة.',
    dialect: 'عراقي عام',
  },

  // Transitions
  {
    id: 't1',
    phrase: 'هسة تكلي شلون؟ اني اكلك..',
    category: 'transition',
    meaning: 'انتقال ذكي بين طرح المشكلة وتقديم الحل.',
    exampleUse: 'بعد طرح التساؤل وقبل بدء الشرح أو عرض المنتج.',
    dialect: 'بغدادي',
  },
  {
    id: 't2',
    phrase: 'باوع وياية وركز زين..',
    category: 'transition',
    meaning: 'لفت نظر بصرية قبل اللقطة المهمة أو الشرح العملي.',
    exampleUse: 'عند استعراض شاشة الهاتف أو مقادير الطبخة أو خطوات العمل.',
    dialect: 'عراقي عام',
  },
  {
    id: 't3',
    phrase: 'طكة وحدة وكلشي تغير!',
    category: 'transition',
    meaning: 'تعبير عن التحول السريع والمفاجئ.',
    exampleUse: 'للمقارنة بين قبل وبعد (Before & After).',
    dialect: 'بغدادي',
  },
  {
    id: 't4',
    phrase: 'خايب مو داكلك السالفة چايدة!',
    category: 'transition',
    meaning: 'تأكيد على أهمية وعمق النقطة المشروحة.',
    exampleUse: 'لإبراز خطورة تجاهل النصيحة أو العرض.',
    dialect: 'بصراوي/جنوبي',
  },

  // Expressions
  {
    id: 'e1',
    phrase: 'فد شي من الأخير يخبل',
    category: 'expression',
    meaning: 'وصف لأعلى درجات الجودة والروعة والجمال.',
    exampleUse: 'لوصف طعم أكل، لبسة، أو تطبيق مميز.',
    dialect: 'بغدادي',
  },
  {
    id: 'e2',
    phrase: 'ع الرنة وبالملم!',
    category: 'expression',
    meaning: 'دقيق جداً وجاهز بدون أي تعب.',
    exampleUse: 'للحديث عن خدمة سريعة أو جهاز مضبوط.',
    dialect: 'عراقي عام',
  },
  {
    id: 'e3',
    phrase: 'طركاعة سودة صابتني!',
    category: 'expression',
    meaning: 'تعبير كوميدي عن المصيبة أو الصدمة الفكاهية.',
    exampleUse: 'في الريلز الكوميدي ومواقف النحس والمقالب.',
    dialect: 'عراقي عام',
  },
  {
    id: 'e4',
    phrase: 'بعد كلبي وعيوني..',
    category: 'expression',
    meaning: 'نداء محبب وقريب جداً من القلب لجعل المشاهد يرتاح لصوتك.',
    exampleUse: 'لبناء علاقة دافئة وحميمية مع المتابعين.',
    dialect: 'بصراوي/جنوبي',
  },

  // Closers / CTA
  {
    id: 'c1',
    phrase: 'سيف الفيديو يمك بالخاص حتى لا يضيع ترة ترجع تحتاجه!',
    category: 'closer',
    meaning: 'دعوة للحفظ (Saves) ترفع ريتش خوارزميات إنستغرام للأعلى.',
    exampleUse: 'في نهاية أي فيديو تعليمي أو نصيحة ثمينة.',
    dialect: 'عراقي عام',
  },
  {
    id: 'c2',
    phrase: 'دزه لصاحبك اللي 24 ساعة مسوي هيج!',
    category: 'closer',
    meaning: 'دعوة للمشاركة والمناكفة الودية (Share / Mention).',
    exampleUse: 'في الفيديوهات الكوميدية ومواقف الأصدقاء.',
    dialect: 'عراقي عام',
  },
  {
    id: 'c3',
    phrase: 'انتوا شتكولون؟ انزل الجزء الثاني لو كافي؟ كتبوا بالتعليقات!',
    category: 'closer',
    meaning: 'تحفيز كتابة التعليقات والنقاش الحماسي.',
    exampleUse: 'لزيادة عدد الكومنتات وإشعال التفاعل.',
    dialect: 'بغدادي',
  },
  {
    id: 'c4',
    phrase: 'ولا تنسى تتابع الحساب حتى يوصلك كل جديد أول بأول!',
    category: 'closer',
    meaning: 'كول تو أكشن صريح ومباشر للمتابعة (Follow).',
    exampleUse: 'خاتمة قياسية احترافية.',
    dialect: 'عراقي عام',
  },
];

export const POPULAR_IRAQI_TOPIC_IDEAS = [
  {
    title: 'ليش العراقيين يشربون جاي حار حتى بعز الصيف 50 درجة؟',
    tone: 'comedy' as const,
    duration: '30_60' as const,
    dialect: 'baghdadi' as const,
    badge: 'ترند عراقي',
  },
  {
    title: 'إعلان مطعم كص ولحم عراقي مشوي على الحطب بطريقة تشهي',
    tone: 'food_review' as const,
    duration: '15_30' as const,
    dialect: 'baghdadi' as const,
    badge: 'تجاري وإعلاني',
  },
  {
    title: '3 أخطاء شائعة يخسر بسببها الشباب العراقي فلوس بالنت',
    tone: 'educational' as const,
    duration: '30_60' as const,
    dialect: 'white_iraqi' as const,
    badge: 'بزنس ومعلومات',
  },
  {
    title: 'سالفة الموقف المحرج اللي صار وياية بأول يوم شغل بالشركة',
    tone: 'story' as const,
    duration: '60_90' as const,
    dialect: 'baghdadi' as const,
    badge: 'سوالف وقصة',
  },
  {
    title: 'مقارنة سريعة: ليش أهل البصرة أطيب سمك مسكوف بالعالم؟',
    tone: 'food_review' as const,
    duration: '30_60' as const,
    dialect: 'basrawi' as const,
    badge: 'بصراوي أصيل',
  },
  {
    title: 'نصيحة ذهبية تخليك تبطل تأجيل وتبدي مشروعك من اليوم',
    tone: 'motivational' as const,
    duration: '15_30' as const,
    dialect: 'white_iraqi' as const,
    badge: 'تحفيز وإصرار',
  },
];
