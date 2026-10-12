/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SocialMonitoringView } from './components/SocialMonitoringView';
import { AppStoreMonitoringView } from './components/AppStoreMonitoringView';
import { BrandProfileView } from './components/BrandProfileView';
import { LookalikeLabView } from './components/LookalikeLabView';
import { ArchitectureView } from './components/ArchitectureView';
import { PresentationView } from './components/PresentationView';
import { ThreatDetailModal } from './components/ThreatDetailModal';
import { SourceHealthModal } from './components/SourceHealthModal';
import { NewBrandModal } from './components/NewBrandModal';

import { BrandProfile, SocialThreat, AppStoreThreat, SourceHealth, ThreatStatus } from './types/drp';
import { INITIAL_BRANDS } from './data/mockBrands';
import { INITIAL_SOCIAL_THREATS, INITIAL_APP_THREATS, INITIAL_SOURCE_HEALTH } from './data/threatDatabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'social' | 'apps' | 'brand' | 'lookalike' | 'architecture' | 'presentation'>('social');
  
  // Brands
  const [brands, setBrands] = useState<BrandProfile[]>(() => {
    const saved = localStorage.getItem('vanguard_drp_brands');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_BRANDS;
  });
  const [currentBrand, setCurrentBrand] = useState<BrandProfile>(brands[0]);

  // Threats
  const [socialThreats, setSocialThreats] = useState<SocialThreat[]>(() => {
    const saved = localStorage.getItem('vanguard_drp_social');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SOCIAL_THREATS;
  });

  const [appThreats, setAppThreats] = useState<AppStoreThreat[]>(() => {
    const saved = localStorage.getItem('vanguard_drp_apps');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_APP_THREATS;
  });

  // Source Health
  const [sourceHealthList, setSourceHealthList] = useState<SourceHealth[]>(INITIAL_SOURCE_HEALTH);

  // Modals & Inspection
  const [selectedThreat, setSelectedThreat] = useState<SocialThreat | AppStoreThreat | null>(null);
  const [isAppThreatSelected, setIsAppThreatSelected] = useState<boolean>(false);
  const [showSourceHealthModal, setShowSourceHealthModal] = useState<boolean>(false);
  const [showNewBrandModal, setShowNewBrandModal] = useState<boolean>(false);

  // Live scan simulation
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('vanguard_drp_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('vanguard_drp_social', JSON.stringify(socialThreats));
  }, [socialThreats]);

  useEffect(() => {
    localStorage.setItem('vanguard_drp_apps', JSON.stringify(appThreats));
  }, [appThreats]);

  // Calculate active counts
  const currentActiveSocialThreats = socialThreats.filter(
    (t) => t.brandId === currentBrand.id && !t.isOfficialExcluded && t.status !== 'removed' && t.status !== 'whitelisted'
  );
  const currentActiveAppThreats = appThreats.filter(
    (t) => t.brandId === currentBrand.id && !t.isOfficialExcluded && t.status !== 'removed' && t.status !== 'whitelisted'
  );

  const activeThreatCount = currentActiveSocialThreats.length + currentActiveAppThreats.length;
  const criticalThreatCount =
    currentActiveSocialThreats.filter((t) => t.severity === 'critical').length +
    currentActiveAppThreats.filter((t) => t.severity === 'critical').length;

  // Handlers
  const handleTriggerScan = () => {
    setIsScanning(true);
    setToastMessage(`Initiating live surveillance scan across Twitter, LinkedIn, Telegram, Google Play & App Store for ${currentBrand.name}...`);

    setTimeout(() => {
      setIsScanning(false);
      setToastMessage(`Scan complete. Analyzed 142 external feeds. 0 false-positives on official assets. Telemetry synchronized.`);
      setTimeout(() => setToastMessage(null), 5000);
    }, 1200);
  };

  const handleUpdateThreatStatus = (threatId: string, newStatus: ThreatStatus) => {
    setSocialThreats((prev) =>
      prev.map((t) => (t.id === threatId ? { ...t, status: newStatus } : t))
    );
    setAppThreats((prev) =>
      prev.map((t) => (t.id === threatId ? { ...t, status: newStatus } : t))
    );
    if (selectedThreat && selectedThreat.id === threatId) {
      setSelectedThreat((prev: any) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleUpdateBrand = (updated: BrandProfile) => {
    setBrands((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setCurrentBrand(updated);
  };

  const handleCreateBrand = (newBrand: BrandProfile) => {
    setBrands((prev) => [newBrand, ...prev]);
    setCurrentBrand(newBrand);
    setActiveTab('brand');
    setToastMessage(`New Brand Baseline "${newBrand.name}" activated. Official assets whitelisted.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleSourceStatus = (sourceId: string) => {
    setSourceHealthList((prev) =>
      prev.map((s) => {
        if (s.id === sourceId) {
          const nextStatus = s.status === 'operational' ? 'simulated_fallback' : 'operational';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const openSocialThreat = (th: SocialThreat) => {
    setSelectedThreat(th);
    setIsAppThreatSelected(false);
  };

  const openAppThreat = (th: AppStoreThreat) => {
    setSelectedThreat(th);
    setIsAppThreatSelected(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        brands={brands}
        currentBrand={currentBrand}
        setCurrentBrand={setCurrentBrand}
        sourceHealthList={sourceHealthList}
        onOpenSourceHealth={() => setShowSourceHealthModal(true)}
        onOpenNewBrand={() => setShowNewBrandModal(true)}
        onTriggerScan={handleTriggerScan}
        isScanning={isScanning}
        activeThreatCount={activeThreatCount}
        criticalThreatCount={criticalThreatCount}
      />

      {/* Floating Scan Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-40 max-w-md bg-slate-900 border border-emerald-500/50 shadow-2xl rounded-xl p-3.5 text-xs text-slate-200 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'social' && (
          <SocialMonitoringView
            threats={socialThreats}
            brand={currentBrand}
            onSelectThreat={openSocialThreat}
            onUpdateStatus={handleUpdateThreatStatus}
          />
        )}

        {activeTab === 'apps' && (
          <AppStoreMonitoringView
            threats={appThreats}
            brand={currentBrand}
            onSelectThreat={openAppThreat}
            onUpdateStatus={handleUpdateThreatStatus}
          />
        )}

        {activeTab === 'lookalike' && (
          <LookalikeLabView brand={currentBrand} />
        )}

        {activeTab === 'brand' && (
          <BrandProfileView
            brand={currentBrand}
            onUpdateBrand={handleUpdateBrand}
            onOpenNewBrand={() => setShowNewBrandModal(true)}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}

        {activeTab === 'presentation' && (
          <PresentationView onGoToTab={setActiveTab} />
        )}
      </main>

      {/* Threat Inspection & AI Forensic Modal */}
      {selectedThreat && (
        <ThreatDetailModal
          threat={selectedThreat}
          brand={currentBrand}
          isApp={isAppThreatSelected}
          onClose={() => setSelectedThreat(null)}
          onUpdateStatus={handleUpdateThreatStatus}
        />
      )}

      {/* Source Health & Degraded Mode Simulation Modal */}
      {showSourceHealthModal && (
        <SourceHealthModal
          sources={sourceHealthList}
          onClose={() => setShowSourceHealthModal(false)}
          onToggleStatus={handleToggleSourceStatus}
        />
      )}

      {/* Add New Brand Modal */}
      {showNewBrandModal && (
        <NewBrandModal
          onClose={() => setShowNewBrandModal(false)}
          onCreateBrand={handleCreateBrand}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Vanguard DRP</span>
            <span aria-hidden="true">·</span>
            <span>Social & App Digital Risk Protection Platform</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400">Zero False-Positive Engine</span>
          </div>
          <div>
            Built for the <strong className="text-slate-300">Kampus.VC</strong> Applied AI Venture Studio Challenge
          </div>
        </div>
      </footer>
    </div>
  );
}
