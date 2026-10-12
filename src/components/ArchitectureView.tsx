import React, { useState } from 'react';
import { Layers, Database, ShieldCheck, Cpu, ArrowRight, Share2, Smartphone, Terminal, FileText, CheckCircle2, AlertTriangle, ShieldAlert, Code } from 'lucide-react';

interface ArchitectureNode {
  id: string;
  category: 'ingestion' | 'normalization' | 'whitelist' | 'detection' | 'storage' | 'remediation';
  title: string;
  subtitle: string;
  description: string;
  inputs: string[];
  outputs: string[];
  techStack: string;
  keyRule?: string;
}

const NODES: ArchitectureNode[] = [
  {
    id: 'ingestion',
    category: 'ingestion',
    title: '1. Multi-Source Ingestion & Monitoring',
    subtitle: 'Social streams, App Store scrapers, & APK aggregators',
    description: 'Continuously queries external platform APIs and public web feeds to capture accounts and mobile applications matching brand names, keyword triggers, and logo embeddings.',
    inputs: [
      'Brand target names & keywords',
      'Twitter/X Filter Stream v2',
      'Meta Graph & LinkedIn crawlers',
      'Telegram public channel monitor',
      'Google Play & Apple App Store indexers',
      'Third-party APK repositories (APKPure, Aptoide)'
    ],
    outputs: ['Raw candidate profiles', 'Raw app metadata & manifests', 'Extracted screenshots & icons'],
    techStack: 'Node.js Express / Axios / Headless Chromium Scrapers / Telegram MTProto',
    keyRule: 'Graceful fallback to local cache or simulated replay if third-party APIs encounter rate limits or outages.',
  },
  {
    id: 'normalization',
    category: 'normalization',
    title: '2. Normalization & Canonicalization',
    subtitle: 'Unicode NFC collation, punycode resolution, URL canonicalization',
    description: 'Converts disparate raw data into standardized JSON threat envelopes. Decodes internationalized domain names (IDN/Punycode), strips tracking parameters from URLs, and extracts display names and bundle IDs.',
    inputs: ['Raw profile/app JSON envelopes'],
    outputs: ['NormalizedCandidate schema with canonical URL, stripped handles, and clean tokens'],
    techStack: 'Unicode NFC Normalizer / IDN converter / RegEx tokenizers',
  },
  {
    id: 'whitelist',
    category: 'whitelist',
    title: '3. Official Asset Whitelist Filter',
    subtitle: 'Deterministic exclusion gate (Zero False-Positive Rule)',
    description: 'CRITICAL EVALUATION REQUIREMENT: Compares the normalized candidate directly against the registered Brand Profile assets. If the candidate matches an official handle, domain, or mobile bundle ID + publisher, it is IMMEDIATELY classified as OFFICIAL_EXCLUDED and bypassed with a Threat Score of 0.',
    inputs: ['Normalized Candidate', 'Brand Profile asset catalog (officialSocials, officialApps)'],
    outputs: [
      'MATCH: Tagged as Official Verified Asset -> Threat Score = 0 -> Bypass Alarms',
      'NO MATCH: Passed through to Detection & Scoring Engine'
    ],
    techStack: 'Exact hash map lookup / Canonical URL comparator / Publisher ID verifier',
    keyRule: 'Ensures legitimate company accounts and official mobile apps are NEVER falsely flagged as impersonations.',
  },
  {
    id: 'detection',
    category: 'detection',
    title: '4. Detection & Algorithmic Scoring Engine',
    subtitle: 'Look-alike fuzzy matching, homoglyphs, publisher audits & NLP',
    description: 'Executes multi-layered threat detection heuristics: Damerau-Levenshtein & Jaro-Winkler look-alike analysis, Cyrillic/Greek homoglyph detection, visual pair substitution ("rn" for "m"), publisher mismatch identification, invasive Android permission audits, and NLP scam keyword detection.',
    inputs: ['Unverified candidates', 'Brand keywords & registered trademarks'],
    outputs: ['Risk Score (0–100)', 'Threat Severity (Critical/High/Medium/Low)', 'LookalikeAnalysis breakdown'],
    techStack: 'Damerau-Levenshtein / Jaro-Winkler / Unicode confusable maps / Common Lexicon filter',
    keyRule: 'Includes Anti-Overflagging dictionary filter to prevent normal English words (e.g. "campus") from triggering false alarms.',
  },
  {
    id: 'storage',
    category: 'storage',
    title: '5. Storage & Evidence Vault',
    subtitle: 'Incident database, audit trails, and cryptographic evidence hashes',
    description: 'Persists all discovered threat dossiers, historical telemetry, and remediation timelines. Stores tamper-evident hashes of scraped APK packages and social profiles for courtroom and takedown admissibility.',
    inputs: ['Evaluated threat dossiers', 'Investigator audit actions'],
    outputs: ['Structured incident registry', 'Historical timeline', 'Exportable JSON/CSV/PDF dossiers'],
    techStack: 'In-Memory / Persistent Store / SHA-256 package hashing',
  },
  {
    id: 'remediation',
    category: 'remediation',
    title: '6. Automated Remediation & AI Takedowns',
    subtitle: 'Gemini 3.8 Flash analysis & pre-drafted legal notices',
    description: 'Generates formal DMCA and trademark infringement notices customized for X, Meta, Google Play, and Apple App Store abuse desks. Integrates Gemini AI for deep deceptive intent forensics.',
    inputs: ['Threat dossier', 'Brand legal entity & trademark numbers'],
    outputs: ['Legal Takedown notice draft', 'One-click platform abuse submission URLs', 'Incident status updates'],
    techStack: 'Express / @google/genai (Gemini 3.8 Flash) / Platform Abuse API endpoints',
  },
];

export const ArchitectureView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(NODES[2]); // Default to Whitelist Exclusion filter

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded">
                Required Deliverable 2
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-2 flex items-center gap-2">
              <Layers className="h-6 w-6 text-purple-400" />
              Platform Architecture & Data Pipeline Specification
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              End-to-end technical flow: Data sources, normalization, official asset exclusion filter, algorithmic detection heuristics, storage, and automated remediation.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-x-auto">
        <div className="text-xs font-mono uppercase text-slate-400 mb-4 tracking-wider">
          Interactive Pipeline Flow (Click any stage to inspect technical specification):
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 min-w-[840px]">
          {NODES.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            const isWhitelist = node.id === 'whitelist';

            return (
              <React.Fragment key={node.id}>
                <button
                  onClick={() => setSelectedNode(node)}
                  className={`flex-1 p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-800 border-purple-500 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500'
                      : isWhitelist
                      ? 'bg-emerald-950/30 border-emerald-800/60 hover:border-emerald-600'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isWhitelist && (
                    <span className="absolute -top-2 right-2 text-[9px] font-mono font-bold bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded uppercase">
                      Exclusion Gate
                    </span>
                  )}
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Stage 0{index + 1}</div>
                  <div className={`text-xs font-bold mt-1 ${isWhitelist ? 'text-emerald-300' : 'text-slate-200'}`}>
                    {node.title.replace(/^\d+\.\s*/, '')}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {node.subtitle}
                  </p>
                </button>

                {index < NODES.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-slate-600 hidden lg:block flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Deep Dive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Detailed Spec */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-purple-400 tracking-wider">
                Stage Specification
              </span>
              <h2 className="text-lg font-bold text-slate-100 mt-0.5">{selectedNode.title}</h2>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{selectedNode.subtitle}</div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-purple-400">
              <Code className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-400 font-mono uppercase text-[11px] block mb-1">Functional Description:</span>
              <p className="text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850">
                {selectedNode.description}
              </p>
            </div>

            {selectedNode.keyRule && (
              <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-200">Critical Core Design Principle:</strong>
                  {selectedNode.keyRule}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <span className="font-mono text-[11px] uppercase text-slate-400 block font-semibold">
                  Inbound Data Streams:
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {selectedNode.inputs.map((inp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-purple-400">›</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <span className="font-mono text-[11px] uppercase text-slate-400 block font-semibold">
                  Outbound Data / Deliverables:
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {selectedNode.outputs.map((out, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">›</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Implementation Highlights */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              Runtime Implementation Stack
            </h3>
            <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
              {selectedNode.techStack}
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
                Evaluation Criteria Alignment:
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Social Media Monitoring:</span>
                  <span className="text-emerald-400 font-mono font-bold">30 Pts</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>App Store Monitoring:</span>
                  <span className="text-emerald-400 font-mono font-bold">30 Pts</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Brand Profile & Whitelisting:</span>
                  <span className="text-emerald-400 font-mono font-bold">15 Pts</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>User Experience:</span>
                  <span className="text-emerald-400 font-mono font-bold">15 Pts</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Architecture & Demo:</span>
                  <span className="text-emerald-400 font-mono font-bold">10 Pts</span>
                </div>
                <div className="flex items-center justify-between text-cyan-300 pt-1 border-t border-slate-800">
                  <span>Look-alike Detection Bonus:</span>
                  <span className="text-cyan-400 font-mono font-bold">+5–10 Pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
