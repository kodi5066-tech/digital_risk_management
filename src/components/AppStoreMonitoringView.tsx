import React, { useState } from 'react';
import { AppStoreThreat, BrandProfile, AppStoreType, ThreatSeverity, ThreatStatus } from '../types/drp';
import { Smartphone, AlertTriangle, ShieldCheck, Search, Filter, ShieldAlert, Bot, ChevronRight, CheckCircle2, Lock, Download, Award } from 'lucide-react';

interface AppStoreMonitoringViewProps {
  threats: AppStoreThreat[];
  brand: BrandProfile;
  onSelectThreat: (threat: AppStoreThreat) => void;
  onUpdateStatus: (threatId: string, newStatus: ThreatStatus) => void;
}

export const AppStoreMonitoringView: React.FC<AppStoreMonitoringViewProps> = ({
  threats,
  brand,
  onSelectThreat,
  onUpdateStatus,
}) => {
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [publisherMismatchOnly, setPublisherMismatchOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWhitelisted, setShowWhitelisted] = useState(false);

  // Filter logic
  const filteredThreats = threats.filter((th) => {
    // Brand filter
    if (th.brandId !== brand.id) return false;

    // Official exclusion toggle
    if (th.isOfficialExcluded && !showWhitelisted) return false;

    // Store filter
    if (storeFilter !== 'all' && th.store !== storeFilter) return false;

    // Severity
    if (severityFilter !== 'all' && th.severity !== severityFilter) return false;

    // Status
    if (statusFilter !== 'all' && th.status !== statusFilter) return false;

    // Publisher mismatch check
    if (publisherMismatchOnly && th.isOfficialExcluded) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        th.appName.toLowerCase().includes(q) ||
        th.bundleId.toLowerCase().includes(q) ||
        th.publisherName.toLowerCase().includes(q) ||
        th.descriptionSnippet.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const getSeverityBadge = (severity: ThreatSeverity) => {
    switch (severity) {
      case 'critical':
        return <span className="text-rose-400 font-semibold font-mono text-xs">CRITICAL</span>;
      case 'high':
        return <span className="text-amber-400 font-semibold font-mono text-xs">HIGH</span>;
      case 'medium':
        return <span className="text-yellow-400 font-semibold font-mono text-xs">MEDIUM</span>;
      case 'low':
        return <span className="text-blue-400 font-medium font-mono text-xs">LOW</span>;
      case 'safe':
        return <span className="text-emerald-400 font-semibold font-mono text-xs">SAFE (OFFICIAL)</span>;
    }
  };

  const getStoreLabel = (store: AppStoreType) => {
    switch (store) {
      case 'google_play':
        return 'Google Play Store';
      case 'apple_app_store':
        return 'Apple App Store';
      case 'apk_mirror':
        return 'APKPure / Mirror';
      case 'aptoide':
        return 'Aptoide Repository';
    }
  };

  const officialAppForStore = (store: AppStoreType) => {
    return brand.officialApps.find((a) => a.store === store);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-emerald-400" />
              App Store Surveillance · {brand.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Automated scanning across Google Play, Apple App Store, and third-party APK mirrors for unauthorized publisher clones and repackaged malware.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
              Suspicious Apps: <strong className="text-rose-400">{threats.filter((t) => t.brandId === brand.id && !t.isOfficialExcluded).length}</strong>
            </span>
            <span className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
              Official Apps Excluded: <strong className="text-emerald-400">{threats.filter((t) => t.brandId === brand.id && t.isOfficialExcluded).length}</strong>
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search apps, bundle IDs, publishers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All App Stores</option>
              <option value="google_play">Google Play</option>
              <option value="apple_app_store">Apple App Store</option>
              <option value="apk_mirror">APKPure / Sideload Mirrors</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="new">New Detected</option>
              <option value="investigating">Under Investigation</option>
              <option value="takedown_requested">Takedown Requested</option>
              <option value="removed">Removed / Taken Down</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={publisherMismatchOnly}
                onChange={(e) => setPublisherMismatchOnly(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span>Publisher Discrepancies Only</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showWhitelisted}
                onChange={(e) => setShowWhitelisted(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span>Show Excluded Official Apps</span>
            </label>
          </div>
        </div>
      </div>

      {/* App Threat Cards List */}
      <div className="space-y-4">
        {filteredThreats.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <ShieldCheck className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
            <div className="text-sm font-semibold text-slate-200">No matching app store threats found</div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              All monitored stores match expected baselines or filters filtered out results.
            </p>
          </div>
        ) : (
          filteredThreats.map((threat) => {
            const officialApp = officialAppForStore(threat.store);

            return (
              <div
                key={threat.id}
                className={`border rounded-xl p-5 transition-all ${
                  threat.isOfficialExcluded
                    ? 'bg-slate-950/60 border-emerald-900/50'
                    : threat.severity === 'critical'
                    ? 'bg-slate-900 border-rose-900/50 hover:border-rose-700/70'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={threat.iconUrl}
                      alt={threat.appName}
                      className="h-12 w-12 rounded-xl object-cover border border-slate-700 bg-slate-950 flex-shrink-0 p-0.5"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{threat.appName}</span>
                        <span className="text-[11px] font-mono uppercase tracking-wide text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {getStoreLabel(threat.store)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-300">{threat.bundleId}</span>
                        <span aria-hidden="true">·</span>
                        <span>{threat.downloadsEstimated} downloads</span>
                        <span aria-hidden="true">·</span>
                        <span>Rating: {threat.rating} ★</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Risk Score</div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-base font-bold font-mono text-slate-100">
                          {threat.riskScore}
                        </span>
                        <span className="text-xs text-slate-500">/100</span>
                        <span className="ml-1">{getSeverityBadge(threat.severity)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
                  {/* Left 2 cols */}
                  <div className="lg:col-span-2 space-y-3">
                    {/* Publisher Mismatch Warning Box */}
                    <div className={`p-3 rounded-lg border text-xs ${
                      threat.isOfficialExcluded
                        ? 'bg-emerald-950/20 border-emerald-800/40'
                        : 'bg-rose-950/20 border-rose-800/40'
                    }`}>
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className={threat.isOfficialExcluded ? 'text-emerald-300' : 'text-rose-300'}>
                          Publisher Verification Status
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {threat.isOfficialExcluded ? 'Verified Official' : 'Discrepant Publisher'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div className="bg-slate-950 p-2 rounded border border-slate-850">
                          <span className="text-slate-500 block text-[11px]">REGISTERED OFFICIAL PUBLISHER:</span>
                          <span className="text-emerald-400 font-semibold">{brand.legalEntity}</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded border border-slate-850">
                          <span className="text-slate-500 block text-[11px]">SUSPECT APP'S LISTED PUBLISHER:</span>
                          <span className={threat.isOfficialExcluded ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold font-mono'}>
                            {threat.publisherName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description Snippet */}
                    <div className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-850">
                      <span className="text-slate-500 block mb-1 font-mono text-[11px]">SCRAPED DESCRIPTION LURE:</span>
                      "{threat.descriptionSnippet}"
                    </div>

                    {/* Dangerous Android Permissions */}
                    {threat.suspiciousPermissions.length > 0 && (
                      <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs">
                        <div className="text-amber-300 font-semibold flex items-center gap-1.5 mb-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                          <span>High-Risk Invasive Permissions Flagged:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {threat.suspiciousPermissions.map((perm, i) => (
                            <span
                              key={i}
                              className="font-mono text-[11px] text-amber-200 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Indicators list */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono uppercase text-slate-400">Detection Heuristics:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {threat.indicators.map((ind, i) => (
                          <div
                            key={i}
                            className="text-xs text-slate-300 bg-slate-950 border border-slate-800 px-2 py-1 rounded"
                          >
                            • {ind}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right col: Official App Baseline & Remediation */}
                  <div className="space-y-3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-4">
                    <div>
                      <div className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 flex items-center justify-between">
                        <span>Official Bundle Baseline</span>
                        {threat.isOfficialExcluded ? (
                          <span className="text-emerald-400 font-semibold">EXCLUDED (OFFICIAL)</span>
                        ) : (
                          <span className="text-rose-400 font-semibold">SPOOFED</span>
                        )}
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
                        <div className="text-slate-400">Official App Name:</div>
                        <div className="text-emerald-400 font-medium truncate">
                          {officialApp ? officialApp.appName : `${brand.name} Official`}
                        </div>
                        <div className="text-slate-500 font-mono text-[11px] truncate">
                          Official ID: {officialApp ? officialApp.bundleId : 'vc.kampus.connect'}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => onSelectThreat(threat)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        <span>AI Forensic & Store Takedown</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <select
                          value={threat.status}
                          onChange={(e) => onUpdateStatus(threat.id, e.target.value as ThreatStatus)}
                          className="flex-1 bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer"
                        >
                          <option value="new">Status: New</option>
                          <option value="investigating">Status: Investigating</option>
                          <option value="takedown_requested">Status: Takedown Requested</option>
                          <option value="removed">Status: Removed</option>
                          <option value="whitelisted">Status: Whitelist (False Positive)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
