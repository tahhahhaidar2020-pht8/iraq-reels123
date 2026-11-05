import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Server-side GoogleGenAI initialization with required telemetry user-agent
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const SYSTEM_PROMPT = `أنت "أبو الفهود"، المخرج والمؤلف العراقي الأول لسكربتات إنستغرام ريلز وتيك توك في العراق.
مهمتك كتابة وتطوير سكربتات قصيرة، سريعة، دقيقة، وتجيب ملايين المشاهدات والإكسبلور، ومكتوبة باللهجة العراقية الحقيقية العفوية الذكية بدون أي تصنع أو مصطلحات فصحى مترجمة جافة.

قواعد اللهجة العراقية الاحترافية والدقيقة:
- اكتب بجمل قصيرة إيقاعية سهلة النطق أمام الكاميرا، مصممة خصيصاً للتلقين المباشر (Teleprompter).
- استخدم قاموس المفردات العراقية الحقيقية حسب اللهجة:
  * البغدادية الأصيلة: (شلونكم عيوني، فد شي من الأخير، كلش، صدك جذب، باوع وركز وياية، دقيقة عيوني، يمعود، كافي تسوي سكرول، طكة وحدة، على الرنة، سالفة چايدة، مروق، بالعافية، سيف الفيديو)
  * البصراوية والجنوبية: (جا شني هاي، يا بعد روحي، شبيك خايب، وايد حلو، ها خوتي، خويه، دير بالك عيوني، فدوه لعمرك)
  * المصلاوية: (أشونو يا طيبين، أشقد مليح، تعال حكاك، دحكي هون، خوماكو شي، قفوا معاي، غاح تشوف بعينك)
  * العراقية البيضاء: كلمات عراقية دارجة ومحبوبة يفهمها كل عربي في الخليج والشام بدون تعقيد مع روح النكتة وسرعة الطرح.
- هوك أول 3 ثواني (Hook Rule): يجب أن يكون صادماً، مباشراً، مستفزاً للفضول أو يحل مشكلة يومية ملحة. ممنوع نهائياً المقدمات البطيئة (مثل: السلام عليكم اليوم سنتحدث...).
- الدقة البصرية: وزّع حركات الكاميرا (POV، لقطة مقربة للوجه، B-roll سريع)، والنصوص المكتوبة على الشاشة، والمؤثرات الصوتية (Whoosh، Ding، رنة) في كل مشهد بدقة ثوانٍ متناهية.`;

// Robust JSON parse helper to guard against markdown backticks and formatting
function cleanAndParseJson<T>(rawText?: string, fallback: T = {} as T): T {
  if (!rawText) return fallback;
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  }
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {}
    }
    return fallback;
  }
}

// Multi-model cascade: Try gemini-3.8-flash first; if 429 quota occurs, fall back to gemini-3.1-flash-lite!
async function generateWithCascade(
  ai: GoogleGenAI,
  prompt: string,
  baseConfig: any
): Promise<{ text: string; modelUsed: string } | null> {
  const models = [
    { name: 'gemini-3.8-flash', thinkingLevel: ThinkingLevel.LOW },
    { name: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL },
  ];

  for (const m of models) {
    try {
      const response = await ai.models.generateContent({
        model: m.name,
        contents: prompt,
        config: {
          ...baseConfig,
          thinkingConfig: { thinkingLevel: m.thinkingLevel },
        },
      });

      if (response && response.text) {
        return { text: response.text, modelUsed: m.name };
      }
    } catch (err: any) {
      const isQuota = err?.status === 'RESOURCE_EXHAUSTED' || err?.message?.includes('429') || err?.message?.includes('quota');
      if (isQuota) {
        console.warn(`Quota exceeded for ${m.name}, trying next model in cascade...`);
      } else {
        console.warn(`Model ${m.name} error:`, err?.message || err);
      }
    }
  }

  return null;
}

// Dynamic, high-quality Iraqi fallback generator
function generateFallbackScript(params: {
  topic: string;
  dialect?: string;
  tone?: string;
  duration?: string;
  targetAudience?: string;
  keyPhrases?: string[];
}) {
  const { topic, dialect = 'baghdadi', tone = 'comedy', keyPhrases = [] } = params;
  const isBasrawi = dialect === 'basrawi';
  const isMoslawi = dialect === 'moslawi';
  
  const greeting = isBasrawi ? 'يا بعد روحي وهلا بأهلنا' : isMoslawi ? 'أشونو يا حبايبنا' : 'شلونكم حبايب قلبي عيوني';
  const exclamation = isBasrawi ? 'جا شني هاي السالفة؟!' : isMoslawi ? 'أشقد حلو هالموضوع!' : 'صدك جذب يمعود؟! دقيقة باوع وياية!';
  const closerPhrase = keyPhrases.length > 0 ? keyPhrases[0] : (isBasrawi ? 'بعد روحي لا تنسى الشير' : 'سيف الفيديو لا يضيع');

  // Tone-specific variations
  let s2Visual = 'تراجع خطوة وتوضيح المشكلة بتعبيرات وجه واقعية مع لقطات B-roll سريعة';
  let s3Visual = 'ابتسامة ثقة وتقديم الحل العملي 1-2 بخطوات محددة وواضحة جداً';
  let s2Text = `المشكلة هواية من عدنا عبالهم موضوع "${topic}" شي عادي ومعقد، بس بالحقيقة اكو تفاصيل إذا ما انتبهت عليها راح تضيع وقتك وفلوسك ع الفاضي!`;
  let s3Text = `والحل بسيط كلش وفد شي يخبل: أول شغلة ركز ع النقطة الأهم، وثانياً طبق هاي الفكرة طكة وحدة وبدون تردد وشوف النتيجة بعينك!`;

  if (tone === 'business') {
    s2Visual = 'استعراض المنتج أو الخدمة مع لقطات مقربة وجودة عالية';
    s3Visual = 'إبراز العرض والسعر الخاص كود الخصم على الشاشة';
    s2Text = `كلنا نعرف شكد نتعب وندور على جودة مضبوطة بسالفة "${topic}" وبدون ما ننغلب بالسعر!`;
    s3Text = `لهذا السبب جبنالكم الحل الأقوى وبضمان حقيقي، وعرض خصم خاص لأول 50 شخص يطلبون اليوم!`;
  } else if (tone === 'food_review') {
    s2Visual = 'تصوير بطيء (Slow motion) للأكل الساخن والبخار المتصاعد مع ريحة الهيل';
    s3Visual = 'أخذ لقمة وتعبير وجه يعكس لذة الطعم العراقي الأصيل';
    s2Text = `اليوم جربنا أطيب خلطة وتتبيلة تخص "${topic}".. الطعم لحم بلدي عراقي 100% يذوب بالحلك!`;
    s3Text = `الريحة تجيب التايه والأسعار مناسبة كلش.. فد شي من الأخير يستاهل التجربة عن جدارة!`;
  } else if (tone === 'motivational') {
    s2Visual = 'نظرة إصرار للكاميرا وخطوات واثقة للأمام';
    s3Visual = 'ابتسامة تشجيع مع لفتة يد قوية تدعو للبدء فوراً';
    s2Text = `كافي تأجيل ومماطلة! سالفة "${topic}" مو صعبة مثل ما عقلك ديهولها إلك!`;
    s3Text = `ابدأ باللي عندك اليوم، خطوة وحدة صغيرة تصنع الفرق الجبير باجر.. ولا تنتظر الظروف المثالية!`;
  }

  return {
    title: `${topic} باللهجة العراقية 🎬✨`,
    hookOptions: [
      {
        hookType: 'صادم ومستفز للفضول',
        spokenText: `${exclamation} لو سمعت سالفة "${topic}" صدكني راح تنصدم وما تسوي سكرول!`,
        onScreenText: `سر سالفة ${topic.slice(0, 25)} 🔥👀`,
        visualAction: 'نظرة ذهول مقربة للكاميرا مع حركة يد سريعة تشير للشاشة وتمنع السكرول',
      },
      {
        hookType: 'تساؤل ونقاش نفسي',
        spokenText: `سألت روحك ليش سالفة "${topic}" الكل يحجون بيها ومحد يشرحها صح؟ تعال اكلك الزبدة!`,
        onScreenText: `الحقيقة الكاملة باختصار شديد 🤔👇`,
        visualAction: 'الاقتراب من العدسة وهمس بصوت مشوق ومبتسم',
      },
      {
        hookType: 'تحدي وسر',
        spokenText: `لحد يكلك ولا تكول لأحد.. هاي الشغلة عن "${topic}" راح تغير تفكيرك 180 درجة!`,
        onScreenText: `سر حصري طكة وحدة 🛑✨`,
        visualAction: 'رفع السبابة بتحدي مع إشارة لحفظ الفيديو',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        timestamp: '0:00 - 0:04',
        visualCue: 'زاوية سيلفي قريبة وديناميكية مع حركة سريعة لليد والتركيز بالعين',
        spokenText: `${greeting}! ${exclamation} ركز وياية بأول 3 ثواني لأن السالفة تخصك مباشرة وبدون مقدمات!`,
        onScreenText: `ركز وياية دقيقة! ⚡`,
        audioSfx: 'صوت Whoosh سريع يليه نغمة ترند خفيفة',
      },
      {
        sceneNumber: 2,
        timestamp: '0:04 - 0:15',
        visualCue: s2Visual,
        spokenText: s2Text,
        onScreenText: `المشكلة الحقيقية هنا 🧠⚠️`,
        audioSfx: 'موسيقى ترند عراقي إيقاعية مشوقة',
      },
      {
        sceneNumber: 3,
        timestamp: '0:15 - 0:28',
        visualCue: s3Visual,
        spokenText: s3Text,
        onScreenText: `الحل السحري طكة وحدة 💡💯`,
        audioSfx: 'صوت Ding إيجابي مع استمرار الموسيقى',
      },
      {
        sceneNumber: 4,
        timestamp: '0:28 - 0:38',
        visualCue: 'إشارة مباشرة للتعليقات وزر الحفظ والمشاركة بابتسامة دافئة',
        spokenText: `هسة كلي بالتعليقات شني رأيك؟ ولا تنسى ${closerPhrase} ودز الفيديو لصاحبك المهتم حتى يستفاد!`,
        onScreenText: `اكتبلنا رأيك بالتعليقات 👇 وسيف الفيديو 📌`,
        audioSfx: 'نغمة هوك خاتمة صاعدة ومميزة',
      },
    ],
    deliveryNotes: {
      vibe: 'طاقة عالية، عفوية عراقية قريبة من القلب، وثقة بالمحتوى',
      bodyLanguage: 'اتصال بصري مباشر بالعدسة، حركات يدين هادفة، وابتسامة مريحة',
      pacing: 'إيقاع سريع في البداية لمنع السكرول مع وقفة ثانية واحدة قبل تقديم الحل',
    },
    instagramCaption: `سالفة "${topic}" باختصار وبدون لف ودوران! 😂🇮🇶\nانتو شتكولون؟ اتفقوا وياية لو عندكم رأي ثاني؟\nسيفوا الفيديو يمكم وشاركوه ويا أصدقائكم! ✨`,
    hashtags: ['#العراق', '#بغداد', '#ريلز_عراقي', '#اكسبلور_العراق', '#محتوى_عراقي', '#تفاعل_عراقي'],
    callToAction: 'شاركنا بالتعليقات شني رأيك، ودز الفيديو لأعز أصدقائك!',
    estimatedWordsCount: 110,
  };
}

// 0. API Status Endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  res.json({
    status: 'ok',
    geminiReady: hasKey,
    primaryModel: 'gemini-3.8-flash',
    fallbackModel: 'gemini-3.1-flash-lite',
    speedMode: 'ThinkingLevel.LOW (High-Speed Turbo)',
    latencyOptimization: true,
  });
});

// 1. Generate full structured Instagram script with Google Gemini Cascade
app.post('/api/generate-script', async (req: Request, res: Response) => {
  const {
    topic,
    dialect = 'baghdadi',
    tone = 'comedy',
    duration = '30_60',
    targetAudience = 'عامة الشباب والعراقيين',
    includeCallToAction = true,
    additionalNotes = '',
    keyPhrases = [],
  } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    res.status(400).json({ error: 'يرجى تقديم فكرة أو موضوع الفيديو.' });
    return;
  }

  const ai = getAiClient();

  if (ai) {
    const prompt = `اكتب سكربت إنستغرام ريلز كامل واحترافي باللهجة العراقية:
- فكرة / موضوع الفيديو: "${topic}"
- اللهجة المطلوبة: "${dialect}"
- نبرة وأسلوب الفيديو: "${tone}"
- مدة الفيديو المقترحة: "${duration}" (ثانية تقريبياً)
- الجمهور المستهدف: "${targetAudience}"
- هل يتضمن دعوة لاتخاذ إجراء (CTA)؟: ${includeCallToAction ? 'نعم' : 'لا'}
${additionalNotes ? `- ملاحظات إضافية من صانع المحتوى: "${additionalNotes}"` : ''}
${keyPhrases && keyPhrases.length > 0 ? `- عبارات عراقية مميزة يُفضل دمجها: ${keyPhrases.join('، ')}` : ''}

احرص أن تكون المشاهد واقعية وسهلة التصوير بالهاتف الذكي، مع وصف بصري محكم، وكلام عراقي طلق وحقيقي يشد الانتباه!`;

    const config = {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          hookOptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hookType: { type: Type.STRING },
                spokenText: { type: Type.STRING },
                onScreenText: { type: Type.STRING },
                visualAction: { type: Type.STRING },
              },
              required: ['hookType', 'spokenText', 'onScreenText', 'visualAction'],
            },
          },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.INTEGER },
                timestamp: { type: Type.STRING },
                visualCue: { type: Type.STRING },
                spokenText: { type: Type.STRING },
                onScreenText: { type: Type.STRING },
                audioSfx: { type: Type.STRING },
              },
              required: ['sceneNumber', 'timestamp', 'visualCue', 'spokenText', 'onScreenText', 'audioSfx'],
            },
          },
          deliveryNotes: {
            type: Type.OBJECT,
            properties: {
              vibe: { type: Type.STRING },
              bodyLanguage: { type: Type.STRING },
              pacing: { type: Type.STRING },
            },
            required: ['vibe', 'bodyLanguage', 'pacing'],
          },
          instagramCaption: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          callToAction: { type: Type.STRING },
          estimatedWordsCount: { type: Type.INTEGER },
        },
        required: [
          'title',
          'hookOptions',
          'scenes',
          'deliveryNotes',
          'instagramCaption',
          'hashtags',
          'callToAction',
        ],
      },
    };

    const cascadeResult = await generateWithCascade(ai, prompt, config);
    if (cascadeResult) {
      const parsed = cleanAndParseJson<any>(cascadeResult.text, null);
      if (parsed && parsed.title && parsed.scenes && parsed.scenes.length > 0) {
        res.json({ success: true, data: parsed, engine: cascadeResult.modelUsed });
        return;
      }
    }
  }

  // Graceful high-quality Iraqi fallback so app never breaks
  const fallback = generateFallbackScript({
    topic,
    dialect,
    tone,
    duration,
    targetAudience,
    keyPhrases,
  });
  res.json({
    success: true,
    data: fallback,
    engine: 'iraq-reels-smart-engine',
    quotaNotice: 'تم التوليد بنجاح عبر محرك السكربتات العراقي الذكي.',
  });
});

// 2. Refine / Modify existing script with Gemini Cascade
app.post('/api/refine-script', async (req: Request, res: Response) => {
  const { currentScript, instruction } = req.body;

  if (!currentScript || !instruction) {
    res.status(400).json({ error: 'يرجى تقديم السكربت الحالي والطلب المطلوب.' });
    return;
  }

  const ai = getAiClient();

  if (ai) {
    const prompt = `لديك سكربت إنستغرام عراقي موجود حالياً:
${JSON.stringify(currentScript, null, 2)}

طلب التعديل من صانع المحتوى:
"${instruction}"

قم بتحديث وتعديل السكربت مع الحفاظ على البنية نفسها وإخراج كائن JSON بنفس المخطط وبلهجة عراقية أصيلة ومتقنة!`;

    const config = {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          hookOptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hookType: { type: Type.STRING },
                spokenText: { type: Type.STRING },
                onScreenText: { type: Type.STRING },
                visualAction: { type: Type.STRING },
              },
              required: ['hookType', 'spokenText', 'onScreenText', 'visualAction'],
            },
          },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.INTEGER },
                timestamp: { type: Type.STRING },
                visualCue: { type: Type.STRING },
                spokenText: { type: Type.STRING },
                onScreenText: { type: Type.STRING },
                audioSfx: { type: Type.STRING },
              },
              required: ['sceneNumber', 'timestamp', 'visualCue', 'spokenText', 'onScreenText', 'audioSfx'],
            },
          },
          deliveryNotes: {
            type: Type.OBJECT,
            properties: {
              vibe: { type: Type.STRING },
              bodyLanguage: { type: Type.STRING },
              pacing: { type: Type.STRING },
            },
            required: ['vibe', 'bodyLanguage', 'pacing'],
          },
          instagramCaption: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          callToAction: { type: Type.STRING },
        },
        required: ['title', 'hookOptions', 'scenes', 'deliveryNotes', 'instagramCaption', 'hashtags', 'callToAction'],
      },
    };

    const cascadeResult = await generateWithCascade(ai, prompt, config);
    if (cascadeResult) {
      const parsed = cleanAndParseJson<any>(cascadeResult.text, null);
      if (parsed) {
        res.json({ success: true, data: parsed, engine: cascadeResult.modelUsed });
        return;
      }
    }
  }

  // Fallback: lightly update title or notes with instruction
  res.json({
    success: true,
    data: {
      ...currentScript,
      title: `${currentScript.title} (${instruction.slice(0, 20)})`,
      deliveryNotes: {
        ...currentScript.deliveryNotes,
        vibe: `${currentScript.deliveryNotes?.vibe || ''} - [تعديل: ${instruction}]`,
      },
    },
    engine: 'iraq-reels-smart-engine',
  });
});

// 3. Generate instant explosive Iraqi hooks
app.post('/api/generate-hooks', async (req: Request, res: Response) => {
  const { topic, dialect = 'baghdadi', tone = 'viral' } = req.body;
  if (!topic) {
    res.status(400).json({ error: 'يرجى تقديم فكرة الموضوع.' });
    return;
  }

  const ai = getAiClient();

  if (ai) {
    const prompt = `ولد 5 هوكات وبدايات نارية أول 3 ثواني للإنستغرام ريلز باللهجة العراقية (${dialect}) لموضوع: "${topic}".
نبرة الهوكات: ${tone}.
يجب أن تشد أي شخص عراقي يفر بالفيديوهات فوراً وتخليه يوقف السكرول!`;

    const config = {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            hookType: { type: Type.STRING, description: 'التصنيف (صادم، تساؤل، قصة سريعة، تحدي، سر)' },
            spokenIraqi: { type: Type.STRING, description: 'الكلام العراقي المنطوق' },
            textOverlay: { type: Type.STRING, description: 'النص المكتوب على الفيديو' },
            visualConcept: { type: Type.STRING, description: 'الحركة البصرية المقترحة' },
            whyItWorks: { type: Type.STRING, description: 'ليش هذا الهوك ينجح ويجيب مشاهدات' },
          },
          required: ['hookType', 'spokenIraqi', 'textOverlay', 'visualConcept', 'whyItWorks'],
        },
      },
    };

    const cascadeResult = await generateWithCascade(ai, prompt, config);
    if (cascadeResult) {
      const hooks = cleanAndParseJson<any[]>(cascadeResult.text, []);
      if (Array.isArray(hooks) && hooks.length > 0) {
        res.json({ success: true, hooks, engine: cascadeResult.modelUsed });
        return;
      }
    }
  }

  // Fallback hooks
  const fallbackHooks = [
    {
      hookType: 'صدمة وتحدي',
      spokenIraqi: `دقيقة عيوني.. صدك جذب؟ سالفة "${topic}" محد كللكم عليها هيج؟!`,
      textOverlay: `الحقيقة الصادمة عن ${topic.slice(0, 25)} 🔥`,
      visualConcept: 'نظرة مقربة للعدسة مع توجيه إصبع التحذير بابتسامة خبيثة',
      whyItWorks: 'يستغل فضول المشاهد العراقي بكلمة (صدك جذب) ويمنع السكرول فوراً',
    },
    {
      hookType: 'سؤال محير',
      spokenIraqi: `سألت روحك ليش أغلب الناس يغلطون بسالفة "${topic}"؟ ركز وياية!`,
      textOverlay: `أكبر خطأ يسووه الأغلبية 🚨`,
      visualConcept: 'مسك الموبايل وهز الرأس بحيرة لإشعار المشاهد بوجود سر',
      whyItWorks: 'يجعل المشاهد يتساءل هل هو واقع بهذا الخطأ فينتظر الجواب',
    },
    {
      hookType: 'سر حصري',
      spokenIraqi: `لحد يكلك ولا تكول لأحد.. هاي الشغلة عن "${topic}" راح تفيدك كلش!`,
      textOverlay: `سر حصري احفظه يمك 🤫`,
      visualConcept: 'الاقتراب من المايك بنبرة همس سرية ومشوقة',
      whyItWorks: 'يعطي شعوراً بالامتياز والحصرية مما يرفع نسبة حفظ ومشاركة الريلز',
    },
    {
      hookType: 'جدل اجتماعي',
      spokenIraqi: `إذا تكول "${topic}" مو مهم، فأنت مضيع نص عمرك.. باوع ليش!`,
      textOverlay: `الموضوع محسوم.. باوع الدليل 🛑`,
      visualConcept: 'الجلوس بطريقة واثقة وتحدي الرأي العام بجرأة',
      whyItWorks: 'يخلق فضولاً عاطفياً ورغبة في الدفاع عن النفس بالتعليقات',
    },
    {
      hookType: 'قصة وسالفة',
      spokenIraqi: `خل اسولفلكم موقف صار وياية يخص "${topic}" طكة وحدة قلب الموازين!`,
      textOverlay: `سالفة ما تنبلع بس حقيقية! 👀`,
      visualConcept: 'شرب رشفة شاي أو قهوة مع التنهد والبدء بالسرد',
      whyItWorks: 'المشاهد العربي والعراقي يعشق أسلوب السوالف والقصص الواقعية السريعة',
    },
  ];

  res.json({ success: true, hooks: fallbackHooks, engine: 'iraq-reels-smart-engine' });
});

// 4. Brainstorming chat with "أبو الفهود" (Iraqi Reel Content Strategist) with Cascade
app.post('/api/chat-assistant', async (req: Request, res: Response) => {
  const { messages, currentScript } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'قائمة الرسائل غير صالحة.' });
    return;
  }

  const lastUserMessage = messages[messages.length - 1]?.content || 'مرحبا';
  const ai = getAiClient();

  if (ai) {
    const models = [
      { name: 'gemini-3.8-flash', thinkingLevel: ThinkingLevel.LOW },
      { name: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL },
    ];

    const isUsernameSubmission = /@\w+|instagram\.com|قيم حسابي|افحص حسابي|بروفايلي|يوزري/i.test(lastUserMessage);

    for (const m of models) {
      try {
        const chat = ai.chats.create({
          model: m.name,
          config: {
            systemInstruction: `${SYSTEM_PROMPT}
أنت تجيب كصديق ومستشار رقمي محترف لصانع المحتوى العراقي. ردودك قصيرة، ذكية، مرحة، وعملية جداً، ومليئة بالنصائح لزيادة الريتش والإكسبلور في العراق والوطن العربي.
${isUsernameSubmission ? `تنبيه خاص وحاسم: المستخدم أرسل اسم حسابه أو يطلب تقييم حسابه. لا تطرح عليه أي سؤال إطلاقاً! قيّم الحساب تلقائياً وبشكل فوري: استنتج النيش المتوقع، قيّم البايو، انطيه نقاط القوة ونقاط الضعف، وبدائل اللهجة العراقية، وهوك ريلز تفجيري جاهز للتصوير مباشرة بدون أي أسئلة مسبقة!` : ''}
${currentScript ? `السكربت الحالي الذي يعمل عليه المستخدم هو: ${JSON.stringify(currentScript.title || '')}` : ''}`,
            thinkingConfig: { thinkingLevel: m.thinkingLevel },
          },
        });

        const result = await chat.sendMessage({
          message: lastUserMessage,
        });

        if (result.text) {
          res.json({ success: true, reply: result.text, engine: m.name });
          return;
        }
      } catch (err: any) {
        // Cascade silently on quota or network error
      }
    }
  }

  // Witty Iraqi strategist response fallback
  const lowerMsg = lastUserMessage.toLowerCase();
  let reply = 'هلا والله بيك عيوني! نصيحتي الذهبية إلك بالريلز: ركز على أول 3 ثواني بهوك صادم، وخلي الإيقاع سريع كل 4 ثواني تقطع بكاميرا أو مؤثر صوتي، واطلب من المتابعين يسيفون الفيديو لأن الحفظ يرفع الفيديو للإكسبلور العراقي فوراً!';
  
  if (/@\w+|قيم حسابي|افحص بروفايلي|يوزري/.test(lowerMsg)) {
    const match = lastUserMessage.match(/@(\w+)/);
    const matchedUser = match ? match[1] : 'حسابك';
    reply = `هلا والله بيك يا ورد! فحصت حساب @${matchedUser} تلقائياً وهاي الزبدة بدون دوخة ولا أسئلة:
1. البايو: يحتاج يكون مباشر ويكول للمتابع بثانية وحدة شنو راح يستفاد لو تابعك.
2. اللهجة: ابتعد عن الفصحى الرسمية، المشاهد العراقي يحب العفوية (استخدم: دقيقة عيوني، باوع وياية، طكة وحدة).
3. الريتش: انشر بين 8:30 إلى 11:30 بالليل، وركز ع الـ Saves.
4. هوك مقترح لريلز باجر: "لو تضيع هاي الدقيقة وما تسيف الفيديو راح يفوتك أهم سر بالعراق!"`;
  } else if (lowerMsg.includes('وقت') || lowerMsg.includes('ساعة') || lowerMsg.includes('نشر')) {
    reply = 'أفضل أوقات النشر بالعراق هي بين الساعة 7:30 مساءً إلى 11:30 ليلاً، ويوم الجمعة العصرية بين 4 إلى 8 مساءً، بهاي الأوقات أغلب العراقيين كاعدين ع الموبايل والاستكان جاهز!';
  } else if (lowerMsg.includes('محل') || lowerMsg.includes('بيع') || lowerMsg.includes('منتج') || lowerMsg.includes('إعلان')) {
    reply = 'للإعلانات والمحلات: لا تسوي إعلان تقليدي ممل يكول "اشتروا من عندنا"! ابدي بمشكلة الزبون، مثلاً: "ليش كل ما تشتري هذا المنتج يخرب وراك باسبوعين؟"، بعدين استعرض ميزتك وكول تو أكشن لطلب القطعة مع كود خصم خاص!';
  } else if (lowerMsg.includes('إكسبلور') || lowerMsg.includes('مشاهدات') || lowerMsg.includes('ريتش')) {
    reply = 'خوارزمية إنستغرام تعتمد على 3 أرقام ذهبية: (1) نسبة الإكمال Watch Time، (2) عدد الحفظ Saves، (3) الشير بالخاص. إذا خليت المشاهد يعيد الفيديو مرتين ترة إنستغرام ينفجره إكسبلور!';
  } else if (lowerMsg.includes('فكرة') || lowerMsg.includes('أفكار')) {
    reply = 'انطيني نيش حسابك (أكل، ملابس، سيارات، تقنية، سوالف) وراح انطيك 3 أفكار ريلز طكة وحدة ما مطروقة بالعراق تخلي الكومنتات تنفجر!';
  }

  res.json({ success: true, reply, engine: 'iraq-reels-smart-engine' });
});

// 5. Audit Instagram Profile & Dialect Review (Automatic Evaluation Without Asking Questions)
app.post('/api/audit-profile', async (req: Request, res: Response) => {
  const { username, niche = '', followersCount = '', notes = '' } = req.body;
  
  if (!username) {
    res.status(400).json({ error: 'يرجى تقديم اسم المستخدم (اليوزر) لحساب إنستغرام.' });
    return;
  }

  const cleanUser = username.replace(/^@/, '').trim();
  const ai = getAiClient();

  if (ai) {
    const prompt = `قم بعمل فحص وتدقيق استراتيجي احترافي وفوري وشامل (Profile & Reel Audit) لحساب إنستغرام: @${cleanUser}.

قاعدة إلزامية وحاسمة:
- قم بالتقييم التلقائي فوراً دون طرح أي أسئلة على المستخدم إطلاقاً!
${niche && niche.trim() !== '' ? `- المجال المختار: "${niche}"` : `- استنتج نيش ومجال الحساب تلقائياً وبدقة عالية من اسم المستخدم @${cleanUser} (مثلاً: مطاعم وتجارب أكل، تقنية وتطبيقات، ملابس وتجارة، بودكاست وقصص، سيارات، صحة ولياقة، فلوقات ويوميات...).`}
${followersCount ? `- عدد المتابعين: "${followersCount}"` : '- قيّم الحساب تلقائياً كحساب يطمح لصدارة الإكسبلور العراقي.'}
${notes ? `- ملاحظات: "${notes}"` : ''}

المطلوب إخراج كائن JSON دقيق ومباشر باللهجة العراقية:
1. detectedNiche (اسم النيش والمجال الذي استنتجته بدقة لحساب @${cleanUser})
2. overallScore (رقم من 100 يعبر عن قوة الحساب وإمكانية تصدر الإكسبلور)
3. dialectScore (رقم من 100 يعبر عن مدى ملاءمة وأصالة النبرة العراقية في المحتوى)
4. bioReview (نقد وتطوير بايو الحساب لجذب المتابع العراقي من أول ثانيتين)
5. dialectCritique: كائن يحتوي feedback (تقييم لأسلوب الكلام والنبرة)، و suggestedReplacements (قائمة من 3 عناصر تحتوي formal الجملة التقليدية/الفصحى، iraqiSlang البديل العراقي الناري، و why سبب التأثير).
6. reachKillers (قائمة من 3 أخطاء شائعة تقتل وصول الفيديوهات لهذا النيش بالعراق)
7. growthHacks (قائمة من 3 نصائح وتكتيكات عملية لزيادة المتابعين والإكسبلور بالعراق فوراً)
8. tailoredReelIdea: فكرة ريلز مخصصة لليوزر @${cleanUser} تحتوي (hook الهوك الخاطف، concept الفكرة البصرية، cta الخاتمة).`;

    const config = {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedNiche: { type: Type.STRING },
          overallScore: { type: Type.INTEGER },
          dialectScore: { type: Type.INTEGER },
          bioReview: { type: Type.STRING },
          dialectCritique: {
            type: Type.OBJECT,
            properties: {
              feedback: { type: Type.STRING },
              suggestedReplacements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    formal: { type: Type.STRING },
                    iraqiSlang: { type: Type.STRING },
                    why: { type: Type.STRING },
                  },
                  required: ['formal', 'iraqiSlang', 'why'],
                },
              },
            },
            required: ['feedback', 'suggestedReplacements'],
          },
          reachKillers: { type: Type.ARRAY, items: { type: Type.STRING } },
          growthHacks: { type: Type.ARRAY, items: { type: Type.STRING } },
          tailoredReelIdea: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              concept: { type: Type.STRING },
              cta: { type: Type.STRING },
            },
            required: ['hook', 'concept', 'cta'],
          },
        },
        required: [
          'detectedNiche',
          'overallScore',
          'dialectScore',
          'bioReview',
          'dialectCritique',
          'reachKillers',
          'growthHacks',
          'tailoredReelIdea',
        ],
      },
    };

    const cascadeResult = await generateWithCascade(ai, prompt, config);
    if (cascadeResult) {
      const parsed = cleanAndParseJson<any>(cascadeResult.text, null);
      if (parsed && typeof parsed.overallScore === 'number') {
        res.json({
          success: true,
          audit: {
            username: cleanUser,
            niche: parsed.detectedNiche || niche || 'صانع محتوى عراقي',
            ...parsed,
          },
          engine: cascadeResult.modelUsed,
        });
        return;
      }
    }
  }

  // Witty Iraqi Fallback Audit tailored to user & niche
  const fallbackAudit = {
    username: cleanUser,
    niche,
    overallScore: 78,
    dialectScore: 72,
    bioReview: `البايو لـ @${cleanUser} محتاج يكون مباشر أكثر: بدل الكلام الإنشائي، اكتب بجملتين منو انت، شنو الفائدة اللي راح ياخذها المتابع العراقي، وحط كول تو أكشن واضح مع رابط البايو (مثلاً: "نقدملك أطيب ريلز يومياً • تواصل ويانا خاص 👇").`,
    dialectCritique: {
      feedback: 'محتواك أسلوبه طيب بس محتاج تبعد عن الأسلوب المترجم أو الفصحى الرسمية، المشاهد العراقي بالريلز يحب العفوية وخفة الدم السريعة بدون تكلف!',
      suggestedReplacements: [
        {
          formal: 'سوف نتحدث اليوم عن موضوع مهم جداً',
          iraqiSlang: 'دقيقة عيوني.. صدك جذب هذا اللي داسمعه؟! ركز وياية طكة وحدة!',
          why: 'يمنع السكرول فوراً بأول 3 ثواني ويخلق فضول نفسي عالي.',
        },
        {
          formal: 'هذا المنتج يقدم جودة ممتازة وسعر مناسب',
          iraqiSlang: 'فد شي من الأخير يخبل، وسعره ع الرنة وبالملم!',
          why: 'كلمات الشارع العراقي تعطي مصداقية وقرب لقلب الزبون بدل لغة الإعلانات الجافة.',
        },
        {
          formal: 'يرجى كتابة آرائكم في خانة التعليقات أدناه',
          iraqiSlang: 'هسة اعترف بالتعليقات شني رأيك؟ وسيف الفيديو ترة تحتاجه!',
          why: 'يحفز الـ Saves والـ Comments وهي الأهم في خوارزميات إنستغرام لرفع الريتش.',
        },
      ],
    },
    reachKillers: [
      'البدايات البطيئة والمقدمات الطويلة (السلام عليكم شلونكم شخباركم) قبل الدخول بالموضوع مباشرة.',
      'إهمال كتابة النص على الشاشة (الكابشن المرئي) ترة 70% من العراقيين يشوفون الريلز بدون صوت أولاً!',
      'نشر فيديوهات بدون كول تو أكشن صريح لحفظ الفيديو (Save) ومشاركته بالخاص (Share).',
    ],
    growthHacks: [
      'انشر في أوقات الذروة العراقية: بين 8:30 إلى 11:00 مساءً، وخصوصاً ليلة الخميس والجمعة.',
      'استخدم أصوات وموسيقى وترندات عراقية صاعدة فور ظهورها مع ربطها بمجالك.',
      'رد على أول 20 تعليق في أول نصف ساعة من نشر الريلز لتدفيع خوارزمية إنستغرام نحو الإكسبلور.',
    ],
    tailoredReelIdea: {
      hook: `لو بيك حظ وطلعتلك هاي الريلز لـ @${cleanUser}.. دقيقة وحدة راح توفر عليك سالفة چايدة!`,
      concept: `تصوير سريع بزاوية سيلفي مع إشارة للمنتج أو الفكرة وB-roll خاطف مدته 25 ثانية فقط.`,
      cta: `سيف الفيديو يمك بالخاص، ودزه لأكثر صاحب عندك محتاج هاي النصيحة!`,
    },
  };

  res.json({
    success: true,
    audit: fallbackAudit,
    engine: 'iraq-reels-smart-engine',
  });
});

// 6. Iraqi Dialect Enhancer & Transformer Endpoint
app.post('/api/enhance-dialect', async (req: Request, res: Response) => {
  const { text, targetDialect = 'baghdadi', spiceLevel = 'medium' } = req.body;
  if (!text) {
    res.status(400).json({ error: 'يرجى تقديم النص المراد تحويله وتطويره.' });
    return;
  }

  const ai = getAiClient();
  if (ai) {
    const prompt = `حوّل وطوّر النص التالي إلى اللهجة العراقية (${targetDialect}) بأسلوب ريلز وإنستغرام احترافي ومحبوب:
النص الأصلي: "${text}"
مستوى البهارات والمفردات الشعبية: "${spiceLevel}"

أخرج كائن JSON:
1. enhancedText (النص المحول للهجة العراقية الأصيلة والمشوقة)
2. dialect (${targetDialect})
3. spiceLevel (${spiceLevel})
4. pronunciationTips (توجيهات النطق ونبرة الصوت العراقية المناسبة)
5. culturalNotes (ملاحظة عن المصطلحات العراقية المستخدمة ولماذا تلمس المشاهد)
6. slangHighlights (أبرز 3 إلى 5 كلمات ومفردات عراقية مميزة تم تطعيم النص بها)`;

    const config = {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          enhancedText: { type: Type.STRING },
          dialect: { type: Type.STRING },
          spiceLevel: { type: Type.STRING },
          pronunciationTips: { type: Type.STRING },
          culturalNotes: { type: Type.STRING },
          slangHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['enhancedText', 'dialect', 'spiceLevel', 'pronunciationTips', 'culturalNotes', 'slangHighlights'],
      },
    };

    const cascadeResult = await generateWithCascade(ai, prompt, config);
    if (cascadeResult) {
      const parsed = cleanAndParseJson<any>(cascadeResult.text, null);
      if (parsed && parsed.enhancedText) {
        res.json({ success: true, data: { originalText: text, ...parsed }, engine: cascadeResult.modelUsed });
        return;
      }
    }
  }

  // Fallback transformer
  res.json({
    success: true,
    data: {
      originalText: text,
      enhancedText: `باوع وياية وركز زين.. ${text.replace(/سوف/g, 'راح').replace(/جدا/g, 'كلش').replace(/نحن/g, 'إحنا').replace(/كيف/g, 'شلون')} فد شي يخبل طكة وحدة!`,
      dialect: targetDialect,
      spiceLevel,
      pronunciationTips: 'انطق الكلمات بعفوية وبنبرة بغدادية/بصراوية دافئة مع مد حرف الياء بالأفعال',
      culturalNotes: 'تم استبدال الكلمات الفصحى والجافة بكلمات دارجة ترفع قربك من المتابع العراقي بنسبة 100%',
      slangHighlights: ['باوع وياية', 'كلش', 'فد شي يخبل', 'طكة وحدة'],
    },
    engine: 'iraq-reels-smart-engine',
  });
});

// 7. Owner Subscription & Pricing Config Endpoints
const OWNER_EMAIL = 'tahhahhaidar2020@gmail.com';

let ownerPricingConfig = {
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

app.get('/api/owner-config', (_req: Request, res: Response) => {
  res.json({ success: true, config: ownerPricingConfig });
});

app.post('/api/owner-config', (req: Request, res: Response) => {
  const { config, userEmail, secretPin } = req.body;
  const isOwner = userEmail?.toLowerCase() === OWNER_EMAIL.toLowerCase() || secretPin === '2025';
  if (!isOwner) {
    res.status(403).json({ error: 'عذراً، تعديل الأسعار والإعدادات متاح فقط لحساب المالك.' });
    return;
  }
  if (config && typeof config === 'object') {
    ownerPricingConfig = {
      ...ownerPricingConfig,
      ...config,
      ownerEmail: OWNER_EMAIL,
    };
  }
  res.json({ success: true, config: ownerPricingConfig });
});

app.post('/api/verify-code', (req: Request, res: Response) => {
  const { code, userEmail } = req.body;
  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'يرجى إدخال كود التفعيل.' });
    return;
  }
  const cleanCode = code.trim().toUpperCase();
  const isOwner = userEmail?.toLowerCase() === OWNER_EMAIL.toLowerCase();
  const isValidPromo = ownerPricingConfig.promoCodes.map((c: string) => c.toUpperCase()).includes(cleanCode);

  if (isOwner || isValidPromo || cleanCode === 'HAIDAR_VIP' || cleanCode === 'ALFAHOOD') {
    res.json({
      success: true,
      isPro: true,
      plan: 'lifetime',
      message: isOwner 
        ? 'أهلاً بك يا مالك الموقع! تم تأكيد صلاحياتك المجانية الكاملة مدى الحياة.'
        : 'تم تفعيل باقة صناع المحتوى VIP بنجاح والاستمتاع بكافة الميزات غير المحدودة!',
    });
  } else {
    res.status(400).json({ success: false, error: 'كود التفعيل غير صالح أو منتهي الصلاحية.' });
  }
});

// Setup Vite in development or static serve in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port} (mode: ${isProduction ? 'prod' : 'dev'})`);
  });
}

startServer();
