import React, { useState } from 'react';
import { SocialThreat, BrandProfile, PlatformType, ThreatSeverity, ThreatStatus } from '../types/drp';
import { Share2, AlertTriangle, ShieldCheck, Search, Filter, ExternalLink, Bot, CheckCircle2, Clock, FileText, ChevronRight } from 'lucide-react';

interface SocialMonitoringViewProps {
  threats: SocialThreat[];
  brand: BrandProfile;
  onSelectThreat: (threat: SocialThreat) => void;
  onUpdateStatus: (threatId: string, newStatus: ThreatStatus) => void;
}

export const SocialMonitoringView: React.FC<SocialMonitoringViewProps> = ({
  threats,
  brand,
  onSelectThreat,
  onUpdateStatus,
}) => {
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWhitelisted, setShowWhitelisted] = useState(false);

  // Filter logic
  const filteredThreats = threats.filter((th) => {
    // Brand filter
    if (th.brandId !== brand.id) return false;

    // Official exclusion toggle
    if (th.isOfficialExcluded && !showWhitelisted) return false;

    // Platform
    if (platformFilter !== 'all' && th.platform !== platformFilter) return false;

    // Severity
    if (severityFilter !== 'all' && th.severity !== severityFilter) return false;

    // Status
    if (statusFilter !== 'all' && th.status !== statusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        th.accountName.toLowerCase().includes(q) ||
        th.handle.toLowerCase().includes(q) ||
        th.bio.toLowerCase().includes(q) ||
        th.indicators.some((ind) => ind.toLowerCase().includes(q));
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

  const getThreatTypeLabel = (type: string) => {
    switch (type) {
      case 'scam_account':
        return 'Financial Scam / Lure';
      case 'impersonation_profile':
        return 'Brand Impersonation';
      case 'fake_company_page':
        return 'Fake Corporate Page';
      case 'phishing_lure':
        return 'Credential Phishing';
      case 'verified_spoof':
        return 'Spoofed Verified Badge';
      default:
        return type;
    }
  };

  const officialAccountForPlatform = (platform: PlatformType) => {
    return brand.officialSocials.find((s) => s.platform === platform);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Metrics Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Share2 className="h-5 w-5 text-emerald-400" />
              Social Media Threat Feed · {brand.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active surveillance across X/Twitter, LinkedIn, Telegram, and Meta for brand impersonation and scam accounts.
            </p>
          </div>

          {/* Quick Filter Counts */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
              Active Threats: <strong className="text-rose-400">{threats.filter((t) => t.brandId === brand.id && !t.isOfficialExcluded).length}</strong>
            </span>
            <span className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
              Official Channels Excluded: <strong className="text-emerald-400">{threats.filter((t) => t.brandId === brand.id && t.isOfficialExcluded).length}</strong>
            </span>
          </div>
        </div>

        {/* Filter Row */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search handles, names, lures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Platform Filter */}
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Platforms</option>
              <option value="twitter">X (Twitter)</option>
              <option value="linkedin">LinkedIn</option>
              <option value="telegram">Telegram</option>
              <option value="instagram">Instagram</option>
            </select>

            {/* Severity Filter */}
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

            {/* Status Filter */}
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
              <option value="whitelisted">Whitelisted</option>
            </select>
          </div>

          {/* Toggle Official / Whitelisted Assets */}
          <label className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showWhitelisted}
              onChange={(e) => setShowWhitelisted(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500"
            />
            <span>Show Excluded Official Assets (0 Threat Score)</span>
          </label>
        </div>
      </div>

      {/* Threats Grid / Feed */}
      <div className="space-y-4">
        {filteredThreats.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <ShieldCheck className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
            <div className="text-sm font-semibold text-slate-200">No matching social threats found</div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              All monitored social channels match expected baselines or filters filtered out results.
            </p>
          </div>
        ) : (
          filteredThreats.map((threat) => {
            const officialAccount = officialAccountForPlatform(threat.platform);

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
                {/* Header line of card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={threat.avatarUrl}
                      alt={threat.accountName}
                      className="h-11 w-11 rounded-full object-cover border border-slate-700 bg-slate-950 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{threat.accountName}</span>
                        <span className="text-xs font-mono text-slate-400">@{threat.handle}</span>
                        <span className="text-[11px] font-mono uppercase tracking-wide text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {threat.platform}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{getThreatTypeLabel(threat.threatType)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{threat.followersCount.toLocaleString()} followers</span>
                        <span aria-hidden="true">·</span>
                        <span>Created {threat.creationDate}</span>
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

                {/* Body: Bio & Threat Vector Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
                  {/* Left 2 Cols: Content & Look-alike Analysis */}
                  <div className="lg:col-span-2 space-y-3">
                    {/* Bio Snippet */}
                    <div className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-850">
                      <span className="text-slate-500 block mb-1 font-mono text-[11px]">BIO & INTENT SNIPPET:</span>
                      "{threat.bio}"
                      {threat.websiteInBio && (
                        <div className="mt-2 text-rose-400 font-mono text-[11px] flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Malicious External Link:</span>
                          <span className="underline">{threat.websiteInBio}</span>
                        </div>
                      )}
                    </div>

                    {/* Look-alike Breakdown */}
                    {threat.lookalikeAnalysis.isLookalike && (
                      <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-xs">
                        <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
                          <span>Look-alike Detection Engine (Bonus Algorithm)</span>
                          <span className="font-mono text-[11px] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                            Technique: {threat.lookalikeAnalysis.technique.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-slate-300">{threat.lookalikeAnalysis.explanation}</p>
                        <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-cyan-400/90">
                          <span>Levenshtein Distance: {threat.lookalikeAnalysis.distance}</span>
                          <span aria-hidden="true">·</span>
                          <span>Jaro-Winkler: {(threat.lookalikeAnalysis.jaroWinklerScore * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    )}

                    {/* Key Indicators */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono uppercase text-slate-400">Telemetry Indicators:</span>
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

                  {/* Right Col: Comparison with Official Asset & Actions */}
                  <div className="space-y-3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-4">
                    {/* Official Whitelist Cross-Check */}
                    <div>
                      <div className="text-[11px] font-mono uppercase text-slate-400 mb-1.5 flex items-center justify-between">
                        <span>Legitimate Asset Baseline</span>
                        {threat.isOfficialExcluded ? (
                          <span className="text-emerald-400 font-semibold">MATCHES (EXCLUDED)</span>
                        ) : (
                          <span className="text-rose-400 font-semibold">MISMATCH (FLAGGED)</span>
                        )}
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
                        <div className="text-slate-400">Official Channel:</div>
                        <div className="text-emerald-400 font-mono font-medium truncate">
                          @{officialAccount ? officialAccount.handle : brand.name}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Official Domain: {brand.primaryDomain}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => onSelectThreat(threat)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        <span>AI Forensic & Takedown</span>
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
                          <option value="removed">Status: Taken Down</option>
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
