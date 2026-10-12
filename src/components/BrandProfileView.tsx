import React, { useState } from 'react';
import { BrandProfile, OfficialSocialAccount, OfficialMobileApp } from '../types/drp';
import { ShieldCheck, Globe, CheckCircle2, AlertCircle, Plus, Trash2, Smartphone, Share2, Key, Users, BookOpen, ExternalLink } from 'lucide-react';

interface BrandProfileViewProps {
  brand: BrandProfile;
  onUpdateBrand: (updated: BrandProfile) => void;
  onOpenNewBrand: () => void;
}

export const BrandProfileView: React.FC<BrandProfileViewProps> = ({
  brand,
  onUpdateBrand,
  onOpenNewBrand,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'socials' | 'apps' | 'identifiers'>('overview');
  const [newAlias, setNewAlias] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [showAddApp, setShowAddApp] = useState(false);

  // New social form state
  const [newSocialPlatform, setNewSocialPlatform] = useState<any>('twitter');
  const [newSocialHandle, setNewSocialHandle] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // New app form state
  const [newAppStore, setNewAppStore] = useState<any>('google_play');
  const [newAppName, setNewAppName] = useState('');
  const [newAppBundle, setNewAppBundle] = useState('');
  const [newAppPublisher, setNewAppPublisher] = useState('');

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlias.trim()) return;
    if (!brand.aliases.includes(newAlias.trim())) {
      onUpdateBrand({
        ...brand,
        aliases: [...brand.aliases, newAlias.trim()],
      });
    }
    setNewAlias('');
  };

  const handleRemoveAlias = (alias: string) => {
    onUpdateBrand({
      ...brand,
      aliases: brand.aliases.filter((a) => a !== alias),
    });
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    if (!brand.keywords.includes(newKeyword.trim())) {
      onUpdateBrand({
        ...brand,
        keywords: [...brand.keywords, newKeyword.trim()],
      });
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kw: string) => {
    onUpdateBrand({
      ...brand,
      keywords: brand.keywords.filter((k) => k !== kw),
    });
  };

  const handleAddSocialAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialHandle.trim()) return;
    const cleanHandle = newSocialHandle.replace(/^@/, '');
    const newAccount: OfficialSocialAccount = {
      id: `soc-${Date.now()}`,
      platform: newSocialPlatform,
      handle: cleanHandle,
      url: newSocialUrl.trim() || `https://${newSocialPlatform}.com/${cleanHandle}`,
      verified: true,
      followerCount: 0,
    };
    onUpdateBrand({
      ...brand,
      officialSocials: [...brand.officialSocials, newAccount],
    });
    setNewSocialHandle('');
    setNewSocialUrl('');
    setShowAddSocial(false);
  };

  const handleRemoveSocial = (id: string) => {
    onUpdateBrand({
      ...brand,
      officialSocials: brand.officialSocials.filter((s) => s.id !== id),
    });
  };

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim() || !newAppBundle.trim()) return;
    const newApp: OfficialMobileApp = {
      id: `app-${Date.now()}`,
      store: newAppStore,
      appName: newAppName.trim(),
      bundleId: newAppBundle.trim(),
      publisherName: newAppPublisher.trim() || brand.legalEntity,
      officialUrl: '#',
      currentVersion: '1.0.0',
    };
    onUpdateBrand({
      ...brand,
      officialApps: [...brand.officialApps, newApp],
    });
    setNewAppName('');
    setNewAppBundle('');
    setNewAppPublisher('');
    setShowAddApp(false);
  };

  const handleRemoveApp = (id: string) => {
    onUpdateBrand({
      ...brand,
      officialApps: brand.officialApps.filter((a) => a.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Whitelist Logic Explainer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="h-16 w-16 rounded-xl object-cover border border-slate-700 bg-slate-950 p-1 flex-shrink-0"
              onError={(e) => {
                // Fallback placeholder
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-100">{brand.name}</h1>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  Active Asset Baseline
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">{brand.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                <span>Legal Entity: <strong className="text-slate-200">{brand.legalEntity}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Primary Domain: <strong className="text-emerald-400 font-mono">{brand.primaryDomain}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Support: <strong className="text-slate-300 font-mono">{brand.supportEmail}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={onOpenNewBrand}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              + Create New Brand
            </button>
          </div>
        </div>

        {/* Exclusion Gate Protocol Callout */}
        <div className="mt-5 p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-slate-300 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-emerald-300">
              Deterministic Whitelist Exclusion Gatekeeper (Zero False-Positive Rule)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Every asset registered below represents a verified corporate baseline. During automated ingestion across social streams and app stores, any candidate exactly matching these canonical handles, domains, or package bundle IDs is <strong>immediately routed through the Exclusion Gate (Threat Score: 0)</strong>. Legitimate corporate channels and official mobile releases will <strong>never be flagged as impersonations</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Section Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-lg max-w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'overview'
              ? 'bg-slate-800 text-slate-100 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Brand Overview & Aliases
        </button>
        <button
          onClick={() => setActiveTab('socials')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'socials'
              ? 'bg-slate-800 text-slate-100 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Official Social Accounts ({brand.officialSocials.length})
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'apps'
              ? 'bg-slate-800 text-slate-100 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Official Mobile Apps ({brand.officialApps.length})
        </button>
        <button
          onClick={() => setActiveTab('identifiers')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'identifiers'
              ? 'bg-slate-800 text-slate-100 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Trademarks & Executives
        </button>
      </div>

      {/* Tab: Overview & Aliases */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand Aliases Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Brand Names & Authorized Aliases</h3>
                <p className="text-xs text-slate-400">Used by look-alike fuzzy logic and homoglyph scanner</p>
              </div>
              <BookOpen className="h-4 w-4 text-slate-500" />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {brand.aliases.map((alias) => (
                <div
                  key={alias}
                  className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/70 text-slate-200 text-xs px-2.5 py-1 rounded"
                >
                  <span className="font-mono">{alias}</span>
                  {brand.aliases.length > 1 && (
                    <button
                      onClick={() => handleRemoveAlias(alias)}
                      className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddAlias} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add brand alias (e.g. Kampus Studio)..."
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium rounded-lg border border-slate-700"
              >
                Add Alias
              </button>
            </form>
          </div>

          {/* Monitored Keywords Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">High-Risk Brand Keywords</h3>
                <p className="text-xs text-slate-400">Triggers semantic scrutiny in bio text and descriptions</p>
              </div>
              <Key className="h-4 w-4 text-slate-500" />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {brand.keywords.map((kw) => (
                <div
                  key={kw}
                  className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/70 text-slate-200 text-xs px-2.5 py-1 rounded"
                >
                  <span>{kw}</span>
                  <button
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddKeyword} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add keyword (e.g. AI Grants, Seed Fund)..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium rounded-lg border border-slate-700"
              >
                Add Keyword
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Official Social Accounts */}
      {activeTab === 'socials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Whitelisted Official Social Channels</h3>
              <p className="text-xs text-slate-400">
                Any crawler candidate matching these handles is confirmed legitimate and excluded from threat alerts
              </p>
            </div>
            <button
              onClick={() => setShowAddSocial(!showAddSocial)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Official Account</span>
            </button>
          </div>

          {showAddSocial && (
            <form onSubmit={handleAddSocialAccount} className="bg-slate-900 border border-emerald-500/40 rounded-xl p-4 space-y-3">
              <div className="text-xs font-semibold text-emerald-400">Register New Official Social Account</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Platform</label>
                  <select
                    value={newSocialPlatform}
                    onChange={(e) => setNewSocialPlatform(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs rounded-lg p-2 border border-slate-700"
                  >
                    <option value="twitter">X (Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="telegram">Telegram</option>
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Handle (without @)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. kampus_vc"
                    value={newSocialHandle}
                    onChange={(e) => setNewSocialHandle(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs rounded-lg p-2 border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Profile URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs rounded-lg p-2 border border-slate-700"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddSocial(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold rounded-lg"
                >
                  Save & Whitelist
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brand.officialSocials.map((soc) => (
              <div
                key={soc.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                        {soc.platform}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <button
                      onClick={() => handleRemoveSocial(soc.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove official account"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-slate-100 font-mono">@{soc.handle}</div>
                    <div className="text-xs text-slate-400 truncate mt-0.5">{soc.url}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{soc.followerCount ? `${soc.followerCount.toLocaleString()} followers` : 'Verified asset'}</span>
                  <span className="text-emerald-400 font-medium">Excluded from Flags ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Official Mobile Apps */}
      {activeTab === 'apps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Whitelisted Official Mobile Applications</h3>
              <p className="text-xs text-slate-400">
                Registered Bundle IDs and publishers. Apps matching these keys are verified and excluded from clone alerts.
              </p>
            </div>
            <button
              onClick={() => setShowAddApp(!showAddApp)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Register Official App</span>
            </button>
          </div>

          {showAddApp && (
            <form onSubmit={handleAddApp} className="bg-slate-900 border border-emerald-500/40 rounded-xl p-4 space-y-3">
              <div className="text-xs font-semibold text-emerald-400">Register Official Mobile Application</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Store</label>
                  <select
                    value={newAppStore}
                    onChange={(e) => setNewAppStore(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs rounded-lg p-2 border border-slate-700"
                  >
                    <option value="google_play">Google Play Store</option>
                    <option value="apple_app_store">Apple App Store</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">App Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kampus Founder Portal"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs rounded-lg p-2 border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Bundle ID / Package Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. vc.kampus.connect"
                    value={newAppBundle}
                    onChange={(e) => setNewAppBundle(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs rounded-lg p-2 border border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Publisher Name</label>
                  <input
                    type="text"
                    placeholder={brand.legalEntity}
                    value={newAppPublisher}
                    onChange={(e) => setNewAppPublisher(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs rounded-lg p-2 border border-slate-700"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddApp(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold rounded-lg"
                >
                  Save & Whitelist
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brand.officialApps.map((app) => (
              <div
                key={app.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                        <Smartphone className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-100">{app.appName}</div>
                        <div className="text-xs text-slate-400 font-mono">{app.store === 'google_play' ? 'Google Play' : 'Apple App Store'} · v{app.currentVersion}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveApp(app.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove app"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Package / Bundle ID:</span>
                      <span className="font-mono text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {app.bundleId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Verified Publisher:</span>
                      <span className="text-slate-200 font-medium">{app.publisherName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Exclusion Status</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Whitelisted (Zero-Threat)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Trademarks & Executives */}
      {activeTab === 'identifiers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trademarks */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">Registered Trademarks & Marks</h3>
            <p className="text-xs text-slate-400">
              Legally recognized intellectual property cited during automated takedown dispatch
            </p>
            <div className="space-y-2 pt-2">
              {brand.trademarks.map((tm) => (
                <div
                  key={tm}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center justify-between"
                >
                  <span className="font-medium">{tm}</span>
                  <span className="text-[11px] text-emerald-400 font-mono">Protected</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Executives */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">Key Personnel & Executive Identifiers</h3>
            <p className="text-xs text-slate-400">
              Founders and leadership identities monitored for VIP executive impersonation and fake recruitment schemes
            </p>
            <div className="space-y-2 pt-2">
              {brand.keyExecutives.map((exec) => (
                <div
                  key={exec}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{exec}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Monitored</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
