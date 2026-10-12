import React, { useState } from 'react';
import { SocialThreat, AppStoreThreat, BrandProfile, AIForensicReport, ThreatStatus } from '../types/drp';
import { requestAIForensicAnalysis } from '../services/aiThreatService';
import { X, ShieldAlert, Bot, Copy, Check, ExternalLink, Download, FileText, AlertTriangle, ShieldCheck, RefreshCw, Scale } from 'lucide-react';

interface ThreatDetailModalProps {
  threat: SocialThreat | AppStoreThreat | null;
  brand: BrandProfile;
  isApp: boolean;
  onClose: () => void;
  onUpdateStatus: (threatId: string, status: ThreatStatus) => void;
}

export const ThreatDetailModal: React.FC<ThreatDetailModalProps> = ({
  threat,
  brand,
  isApp,
  onClose,
  onUpdateStatus,
}) => {
  if (!threat) return null;

  const [aiReport, setAiReport] = useState<AIForensicReport | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'comparison' | 'ai_forensics' | 'takedown'>('comparison');

  const appThreat = isApp ? (threat as AppStoreThreat) : null;
  const socialThreat = !isApp ? (threat as SocialThreat) : null;

  const targetName = isApp ? appThreat!.appName : socialThreat!.accountName;
  const targetId = isApp ? appThreat!.bundleId : `@${socialThreat!.handle}`;
  const targetPlatform = isApp ? appThreat!.store.replace(/_/g, ' ') : socialThreat!.platform;

  // Run AI Analysis
  const handleRunAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const report = await requestAIForensicAnalysis(threat, brand, isApp);
      setAiReport(report);
      setActiveTab('ai_forensics');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopyNotice = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ threat, brand, aiReport }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `incident-${threat.id}-dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm ${
              threat.severity === 'critical'
                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                : 'bg-amber-950 text-amber-400 border border-amber-800'
            }`}>
              {threat.riskScore}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">{targetName}</h2>
                <span className="text-[11px] font-mono uppercase bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                  {targetPlatform}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{targetId}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Incident ID: <strong className="font-mono text-slate-300">{threat.id}</strong> · Detected: {threat.detectedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Export Incident Dossier JSON"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-5 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'comparison'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side Asset Comparison
          </button>
          <button
            onClick={() => setActiveTab('ai_forensics')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai_forensics'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Gemini AI Forensic Audit</span>
            {aiReport && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>}
          </button>
          <button
            onClick={() => setActiveTab('takedown')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'takedown'
                ? 'border-emerald-400 text-emerald-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Legal Takedown Notice</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: Comparison */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              {/* Side-by-side Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Official Asset */}
                <div className="bg-slate-950 border border-emerald-900/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4" />
                      Legitimate Brand Asset
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Baseline</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 text-[11px] block">ORGANIZATION NAME:</span>
                      <span className="text-sm font-bold text-slate-100">{brand.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">REGISTERED ENTITY:</span>
                      <span className="text-slate-300 font-medium">{brand.legalEntity}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">OFFICIAL DOMAIN:</span>
                      <span className="text-emerald-400 font-mono font-medium">{brand.primaryDomain}</span>
                    </div>
                    {isApp ? (
                      <div>
                        <span className="text-slate-500 text-[11px] block">AUTHORIZED BUNDLE ID:</span>
                        <span className="text-emerald-400 font-mono">
                          {brand.officialApps[0]?.bundleId || 'vc.kampus.connect'}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-slate-500 text-[11px] block">VERIFIED CHANNEL:</span>
                        <span className="text-emerald-400 font-mono">
                          @{brand.officialSocials[0]?.handle || 'kampus_vc'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suspect Threat Asset */}
                <div className="bg-slate-950 border border-rose-900/60 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-[11px] font-mono text-rose-400 uppercase font-bold flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Suspected Threat Asset
                    </span>
                    <span className="text-[11px] font-mono text-rose-400 font-bold">
                      Risk {threat.riskScore}/100
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 text-[11px] block">CLAIMED DISPLAY NAME:</span>
                      <span className="text-sm font-bold text-slate-100">{targetName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">
                        {isApp ? 'LISTED PUBLISHER / DEVELOPER:' : 'HANDLE / USERNAME:'}
                      </span>
                      <span className="text-rose-400 font-semibold font-mono">
                        {isApp ? appThreat!.publisherName : `@${socialThreat!.handle}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">
                        {isApp ? 'UNAUTHORIZED BUNDLE ID:' : 'BIO / INTENT SNIPPET:'}
                      </span>
                      <span className="text-slate-300 font-mono">
                        {isApp ? appThreat!.bundleId : socialThreat!.bio}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Look-alike Breakdown */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-mono uppercase text-[11px] block font-semibold">
                  Algorithmic Look-alike Analysis (Bonus Engine)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">TECHNIQUE</span>
                    <span className="text-cyan-400 font-mono font-bold uppercase">
                      {threat.lookalikeAnalysis.technique.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">LEVENSHTEIN DISTANCE</span>
                    <span className="text-slate-200 font-mono font-bold">
                      {threat.lookalikeAnalysis.distance}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">JARO-WINKLER SIMILARITY</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {(threat.lookalikeAnalysis.jaroWinklerScore * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 pt-1 leading-relaxed">
                  {threat.lookalikeAnalysis.explanation}
                </p>
              </div>

              {/* Indicators */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-mono uppercase text-[11px] block font-semibold">
                  Technical Telemetry Indicators
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {threat.indicators.map((ind, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action trigger for AI */}
              {!aiReport && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-purple-200">Generate Deep AI Forensic Report</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Executes Gemini 3.8 Flash model to analyze social engineering tactics and draft an enforceable takedown demand.
                    </p>
                  </div>
                  <button
                    onClick={handleRunAiAnalysis}
                    disabled={loadingAi}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Bot className={`h-4 w-4 ${loadingAi ? 'animate-spin' : ''}`} />
                    <span>{loadingAi ? 'Analyzing...' : 'Run Gemini AI Analysis'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI Forensics */}
          {activeTab === 'ai_forensics' && (
            <div className="space-y-4">
              {!aiReport ? (
                <div className="p-10 text-center space-y-3 bg-slate-950 rounded-xl border border-slate-800">
                  <Bot className="h-10 w-10 text-purple-400 mx-auto" />
                  <div className="text-slate-200 font-semibold">AI Forensic Analysis not yet generated</div>
                  <p className="text-slate-400 max-w-sm mx-auto">
                    Click below to generate forensic intelligence using Gemini 3.8 Flash.
                  </p>
                  <button
                    onClick={handleRunAiAnalysis}
                    disabled={loadingAi}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg"
                  >
                    {loadingAi ? 'Analyzing threat vectors...' : 'Analyze with Gemini Threat AI'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-mono uppercase text-purple-400 font-bold block">
                      Executive Threat Summary (Gemini 3.8 Flash)
                    </span>
                    <p className="text-slate-200 leading-relaxed text-xs">
                      {aiReport.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tactics */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block">
                        Impersonation Tactics
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {aiReport.impersonationTactics?.map((t, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-purple-400">›</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Psychological Triggers */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block">
                        Social Engineering & Urgency Triggers
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {aiReport.psychologicalTriggers?.map((p, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-400">›</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Potential Harm & Legal Grounds */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block">
                      Statutory Takedown Grounds
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {aiReport.legalTakedownGrounds?.map((g, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 text-slate-200 px-2.5 py-1 rounded">
                          {g}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Re-run button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleRunAiAnalysis}
                      disabled={loadingAi}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-purple-400 text-xs"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
                      <span>Refresh AI Analysis</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Takedown Notice */}
          {activeTab === 'takedown' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-100">Formal Platform Takedown Notice</h4>
                  <p className="text-slate-400 text-[11px]">
                    Ready to submit to {targetPlatform} abuse and legal review desks
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleCopyNotice(
                      aiReport?.takedownNoticeDraft ||
                        `LEGAL TAKEDOWN NOTICE: Immediately remove ${targetName} (${targetId}) for infringing on ${brand.name} trademarks.`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold rounded-lg cursor-pointer"
                >
                  {copiedNotice ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedNotice ? 'Copied to Clipboard!' : 'Copy Notice'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {aiReport?.takedownNoticeDraft ||
                  `FORMAL DEMAND FOR IMMEDIATE REMOVAL OF INFRINGING ASSET\n\nTo: Trust & Safety Department, ${targetPlatform}\nRe: Infringement of Registered Trademark "${brand.name}" by ${targetName} (${targetId})\n\nWe represent ${brand.legalEntity}, owner of the registered trademark "${brand.name}".\n\nThe asset located at ${targetId} is impersonating our brand without authorization.\nInfringing Activity: ${threat.indicators.join('; ')}\n\nPursuant to your platform's Terms of Service and applicable law (15 U.S.C. § 1125), we demand the immediate suspension of this account.\n\nSigned,\nDigital Risk Protection Legal Operations\nContact: ${brand.supportEmail}`}
              </div>

              {/* Direct links to Platform Abuse Desks */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 font-mono uppercase text-[11px] block font-semibold">
                  Direct Platform Abuse Reporting Intake Links:
                </span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://help.twitter.com/forms/impersonation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-200 rounded border border-slate-800 text-xs"
                  >
                    <span>Twitter/X Impersonation Desk</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                  <a
                    href="https://support.google.com/googleplay/android-developer/contact/takedown"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-200 rounded border border-slate-800 text-xs"
                  >
                    <span>Google Play Developer Takedown Desk</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                  <a
                    href="https://www.apple.com/legal/internet-services/itunes/appstorenotices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-200 rounded border border-slate-800 text-xs"
                  >
                    <span>Apple App Store IP Dispute Desk</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Status Workflow Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Current Status:</span>
            <span className="text-xs font-mono font-semibold text-slate-200 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {threat.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateStatus(threat.id, 'investigating')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-700"
            >
              Mark Investigating
            </button>
            <button
              onClick={() => onUpdateStatus(threat.id, 'takedown_requested')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-semibold rounded-lg"
            >
              Dispatch Takedown
            </button>
            <button
              onClick={() => onUpdateStatus(threat.id, 'removed')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold rounded-lg"
            >
              Confirm Removed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
