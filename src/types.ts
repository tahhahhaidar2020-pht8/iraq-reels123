export type IraqiDialect = 'baghdadi' | 'basrawi' | 'moslawi' | 'white_iraqi';

export type ScriptTone = 
  | 'comedy'
  | 'business'
  | 'educational'
  | 'story'
  | 'podcast'
  | 'food_review'
  | 'motivational';

export type ScriptDuration = '15_30' | '30_60' | '60_90';

export interface HookOption {
  hookType: string;
  spokenText: string;
  onScreenText: string;
  visualAction: string;
}

export interface Scene {
  sceneNumber: number;
  timestamp: string;
  visualCue: string;
  spokenText: string;
  onScreenText: string;
  audioSfx: string;
}

export interface DeliveryNotes {
  vibe: string;
  bodyLanguage: string;
  pacing: string;
}

export interface InstagramScript {
  id?: string;
  createdAt?: string;
  title: string;
  hookOptions: HookOption[];
  scenes: Scene[];
  deliveryNotes: DeliveryNotes;
  instagramCaption: string;
  hashtags: string[];
  callToAction: string;
  estimatedWordsCount?: number;
  dialect?: IraqiDialect;
  tone?: ScriptTone;
  category?: string;
  tags?: string[];
  rating?: number;
  topic?: string;
}

export interface InstantHook {
  hookType: string;
  spokenIraqi: string;
  textOverlay: string;
  visualConcept: string;
  whyItWorks: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface DialectReplacement {
  formal: string;
  iraqiSlang: string;
  why: string;
}

export interface ProfileAuditResult {
  username: string;
  niche: string;
  overallScore: number;
  dialectScore: number;
  bioReview: string;
  dialectCritique: {
    feedback: string;
    suggestedReplacements: DialectReplacement[];
  };
  reachKillers: string[];
  growthHacks: string[];
  tailoredReelIdea: {
    hook: string;
    concept: string;
    cta: string;
  };
}

export interface DialectEnhancementResult {
  originalText: string;
  enhancedText: string;
  dialect: IraqiDialect;
  spiceLevel: string;
  pronunciationTips: string;
  culturalNotes: string;
  slangHighlights: string[];
}

export interface SubscriptionPlan {
  id: 'monthly' | 'yearly' | 'lifetime';
  name: string;
  price: number;
  currency: string;
  periodLabel: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
}

export interface OwnerPricingConfig {
  ownerEmail: string;
  monthlyPrice: number;
  yearlyPrice: number;
  lifetimePrice: number;
  currency: 'د.ع' | '$';
  freeDailyLimit: number;
  zainCashNumber: string;
  qiCardNumber: string;
  fastPayNumber: string;
  whatsappContact: string;
  telegramContact: string;
  promoCodes: string[];
  discountNotice: string;
  isSubscriptionEnforced: boolean;
}

export interface UserSubscriptionState {
  email: string;
  isOwner: boolean;
  isPro: boolean;
  planId?: 'free' | 'monthly' | 'yearly' | 'lifetime';
  usageToday: number;
  lastUsageDate: string;
  activatedCode?: string;
}
