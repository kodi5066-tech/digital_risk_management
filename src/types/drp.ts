export type PlatformType = 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'telegram' | 'youtube' | 'tiktok';
export type AppStoreType = 'google_play' | 'apple_app_store' | 'apk_mirror' | 'aptoide';
export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'safe';
export type ThreatStatus = 'new' | 'investigating' | 'takedown_requested' | 'removed' | 'whitelisted';

export interface OfficialSocialAccount {
  id: string;
  platform: PlatformType;
  handle: string;
  url: string;
  verified: boolean;
  followerCount?: number;
}

export interface OfficialMobileApp {
  id: string;
  store: AppStoreType;
  appName: string;
  bundleId: string; // e.g. vc.kampus.connect or com.kampus.app
  publisherName: string;
  officialUrl: string;
  currentVersion: string;
  iconUrl?: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  legalEntity: string;
  description: string;
  logoUrl: string;
  primaryDomain: string;
  alternateDomains: string[];
  aliases: string[];
  trademarks: string[];
  keyExecutives: string[];
  officialSocials: OfficialSocialAccount[];
  officialApps: OfficialMobileApp[];
  keywords: string[];
  supportEmail: string;
  createdAt: string;
}

export interface LookalikeAnalysis {
  isLookalike: boolean;
  technique: 'character_swap' | 'homoglyph' | 'added_word' | 'spacing_change' | 'visual_pair' | 'none';
  distance: number; // Levenshtein
  jaroWinklerScore: number;
  confusableChars: Array<{ original: string; replaced: string; unicodeHex: string }>;
  explanation: string;
  mitigationApplied?: string;
  isFalsePositiveSuppressed?: boolean;
}

export interface SocialThreat {
  id: string;
  brandId: string;
  platform: PlatformType;
  accountName: string;
  handle: string;
  profileUrl: string;
  avatarUrl: string;
  followersCount: number;
  followingCount: number;
  creationDate: string;
  bio: string;
  websiteInBio?: string;
  threatType: 'impersonation_profile' | 'fake_company_page' | 'scam_account' | 'phishing_lure' | 'verified_spoof';
  severity: ThreatSeverity;
  status: ThreatStatus;
  riskScore: number; // 0 - 100
  lookalikeAnalysis: LookalikeAnalysis;
  indicators: string[];
  detectedAt: string;
  lastActive: string;
  isOfficialExcluded: boolean;
  takedownSubmittedAt?: string;
  evidenceNotes?: string;
}

export interface AppStoreThreat {
  id: string;
  brandId: string;
  store: AppStoreType;
  appName: string;
  bundleId: string;
  publisherName: string;
  developerEmail?: string;
  appUrl: string;
  iconUrl: string;
  downloadsEstimated: string;
  rating: number;
  descriptionSnippet: string;
  threatType: 'fake_app' | 'trojan_malware' | 'brand_hijack' | 'unauthorized_clone' | 'phishing_portal';
  severity: ThreatSeverity;
  status: ThreatStatus;
  riskScore: number; // 0 - 100
  lookalikeAnalysis: LookalikeAnalysis;
  indicators: string[];
  suspiciousPermissions: string[];
  detectedAt: string;
  isOfficialExcluded: boolean;
  takedownSubmittedAt?: string;
  evidenceNotes?: string;
}

export interface SourceHealth {
  id: string;
  name: string;
  type: 'social_api' | 'app_store_scraper' | 'apk_index' | 'crawler';
  status: 'operational' | 'degraded' | 'rate_limited' | 'simulated_fallback';
  latencyMs: number;
  lastSync: string;
  itemsProcessed24h: number;
  failureRate: number;
}

export interface AIForensicReport {
  summary: string;
  impersonationTactics: string[];
  psychologicalTriggers: string[];
  potentialHarm: string;
  legalTakedownGrounds: string[];
  recommendedAction: string;
  takedownNoticeDraft: string;
  analyzedAt: string;
}
