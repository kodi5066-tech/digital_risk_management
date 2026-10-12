import React, { useState } from 'react';
import { BrandProfile } from '../types/drp';
import { X, ShieldPlus, Check } from 'lucide-react';

interface NewBrandModalProps {
  onClose: () => void;
  onCreateBrand: (newBrand: BrandProfile) => void;
}

export const NewBrandModal: React.FC<NewBrandModalProps> = ({ onClose, onCreateBrand }) => {
  const [name, setName] = useState('');
  const [legalEntity, setLegalEntity] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [aliases, setAliases] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [officialTwitter, setOfficialTwitter] = useState('');
  const [officialBundleId, setOfficialBundleId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) return;

    const brandId = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
    const aliasArray = aliases
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const newBrand: BrandProfile = {
      id: brandId,
      name: name.trim(),
      legalEntity: legalEntity.trim() || `${name.trim()} Inc.`,
      description: description.trim() || `Digital assets and brand perimeter for ${name.trim()}.`,
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      primaryDomain: domain.trim(),
      alternateDomains: [],
      aliases: aliasArray.length > 0 ? aliasArray : [name.trim()],
      trademarks: [`${name.trim()}®`],
      keyExecutives: [`Executive Leadership of ${name.trim()}`],
      officialSocials: officialTwitter
        ? [
            {
              id: `soc-custom-1`,
              platform: 'twitter',
              handle: officialTwitter.replace(/^@/, '').trim(),
              url: `https://x.com/${officialTwitter.replace(/^@/, '').trim()}`,
              verified: true,
              followerCount: 5000,
            },
          ]
        : [],
      officialApps: officialBundleId
        ? [
            {
              id: `app-custom-1`,
              store: 'google_play',
              appName: `${name.trim()} Mobile`,
              bundleId: officialBundleId.trim(),
              publisherName: legalEntity.trim() || `${name.trim()} Inc.`,
              officialUrl: '#',
              currentVersion: '1.0.0',
            },
          ]
        : [],
      keywords: [name.trim(), 'support', 'official'],
      supportEmail: supportEmail.trim() || `security@${domain.trim()}`,
      createdAt: new Date().toISOString(),
    };

    onCreateBrand(newBrand);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
              <ShieldPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Add New Brand Profile</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Define brand baseline for automated social and app store protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[70vh]">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Company / Brand Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme AI, Stripe, Revolut"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Registered Legal Entity</label>
            <input
              type="text"
              placeholder="e.g. Acme Technologies Inc."
              value={legalEntity}
              onChange={(e) => setLegalEntity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Primary Domain *</label>
              <input
                type="text"
                required
                placeholder="e.g. acme.ai"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Support / Abuse Email</label>
              <input
                type="email"
                placeholder="security@acme.ai"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Authorized Brand Aliases (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Acme, AcmeAI, Acme Corp"
              value={aliases}
              onChange={(e) => setAliases(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="font-semibold text-emerald-400 block">
              Official Whitelisted Channels (Never Flagged)
            </span>

            <div>
              <label className="block text-slate-400 mb-1">Official Twitter / X Handle</label>
              <input
                type="text"
                placeholder="e.g. acme_official (without @)"
                value={officialTwitter}
                onChange={(e) => setOfficialTwitter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-750 rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Official Google Play Package ID</label>
              <input
                type="text"
                placeholder="e.g. com.acme.android"
                value={officialBundleId}
                onChange={(e) => setOfficialBundleId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-750 rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Create & Activate Baseline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
