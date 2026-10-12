import React from 'react';
import { Shield, ShieldAlert, Smartphone, Share2, Layers, Cpu, Presentation, RefreshCw, Activity, Plus } from 'lucide-react';
import { BrandProfile, SourceHealth } from '../types/drp';

interface HeaderProps {
  activeTab: 'social' | 'apps' | 'brand' | 'lookalike' | 'architecture' | 'presentation';
  setActiveTab: (tab: 'social' | 'apps' | 'brand' | 'lookalike' | 'architecture' | 'presentation') => void;
  brands: BrandProfile[];
  currentBrand: BrandProfile;
  setCurrentBrand: (brand: BrandProfile) => void;
  sourceHealthList: SourceHealth[];
  onOpenSourceHealth: () => void;
  onOpenNewBrand: () => void;
  onTriggerScan: () => void;
  isScanning: boolean;
  activeThreatCount: number;
  criticalThreatCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  brands,
  currentBrand,
  setCurrentBrand,
  sourceHealthList,
  onOpenSourceHealth,
  onOpenNewBrand,
  onTriggerScan,
  isScanning,
  activeThreatCount,
  criticalThreatCount,
}) => {
  const degradedSources = sourceHealthList.filter(
    (s) => s.status === 'degraded' || s.status === 'simulated_fallback'
  ).length;

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
      {/* Top Bar: Brand, Status, Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950">
            <Shield className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-tight text-base sm:text-lg">
                Vanguard<span className="text-emerald-400">DRP</span>
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                SOC v3.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Digital Risk Protection · Social & App Threat Monitor
            </p>
          </div>
        </div>

        {/* Middle: Brand Target Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <span className="text-xs text-slate-400 px-2 font-medium">Protecting:</span>
            <select
              value={currentBrand.id}
              onChange={(e) => {
                const found = brands.find((b) => b.id === e.target.value);
                if (found) setCurrentBrand(found);
              }}
              className="bg-slate-950 text-slate-100 text-xs font-semibold rounded px-2.5 py-1 border border-slate-700/60 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.primaryDomain})
                </option>
              ))}
            </select>
            <button
              onClick={onOpenNewBrand}
              title="Add Custom Brand Profile"
              className="ml-1 p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Threats: <strong className="text-slate-100">{activeThreatCount}</strong></span>
              <span className="text-slate-500">·</span>
              <span className="text-rose-400 font-semibold">{criticalThreatCount} Critical</span>
            </div>
          </div>
        </div>

        {/* Right Actions: Source Health & Scan Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSourceHealth}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              degradedSources > 0
                ? 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
            }`}
            title="Inspect Source & Ingestion Health"
          >
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>Sources</span>
            {degradedSources > 0 ? (
              <span className="text-[10px] text-amber-400 font-mono">({degradedSources} degraded)</span>
            ) : (
              <span className="text-[10px] text-emerald-400 font-mono">All OK</span>
            )}
          </button>

          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Trigger Scan'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto border-t border-slate-850 scrollbar-none">
        <nav className="flex space-x-1 py-1.5">
          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'social'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Social Monitoring</span>
            <span className="text-[11px] font-mono text-slate-400">
              ({activeThreatCount})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'apps'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>App Store Monitoring</span>
          </button>

          <button
            onClick={() => setActiveTab('lookalike')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'lookalike'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Look-alike Lab</span>
            <span className="text-[10px] uppercase font-mono text-cyan-400 bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-800/50">
              Bonus
            </span>
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'brand'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Brand Profile & Assets</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-purple-400" />
            <span>Architecture & Data Flow</span>
            <span className="text-[10px] uppercase font-mono text-purple-400 bg-purple-950/60 px-1 py-0.2 rounded border border-purple-800/50">
              Deliverable
            </span>
          </button>

          <button
            onClick={() => setActiveTab('presentation')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'presentation'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Presentation className="h-3.5 w-3.5 text-amber-400" />
            <span>Presentation & Demo</span>
            <span className="text-[10px] uppercase font-mono text-amber-400 bg-amber-950/60 px-1 py-0.2 rounded border border-amber-800/50">
              Slides
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
