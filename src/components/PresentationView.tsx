import React, { useState } from 'react';
import { Presentation, ChevronLeft, ChevronRight, Shield, Share2, Smartphone, Cpu, CheckCircle2, Award, ExternalLink, Play } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  content: React.ReactNode;
}

interface PresentationViewProps {
  onGoToTab: (tab: any) => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ onGoToTab }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slides: Slide[] = [
    // Slide 1
    {
      id: 1,
      category: 'Challenge Statement & Overview',
      title: 'Digital Risk Protection: Social & App Monitoring',
      subtitle: 'Defending brand identity across modern external attack surfaces',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">The Problem</span>
              <p className="text-sm text-slate-300 leading-relaxed">
                Threat actors weaponize brand trust by deploying fake social profiles, spoofed corporate recruitment pages, financial grant scams, and malicious mobile applications imitating legitimate organizations.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2">
                <li>• Customer deception & credential phishing</li>
                <li>• Financial extraction via fake support & grant lures</li>
                <li>• Mobile banking overlay malware & trojans</li>
                <li>• Irreparable reputational and operational damage</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">Vanguard DRP Solution</span>
              <p className="text-sm text-slate-300 leading-relaxed">
                An enterprise-grade Digital Risk Protection platform providing continuous surveillance, algorithmic look-alike detection, deterministic asset whitelisting, and automated legal takedown dispatch.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-200">
                  <strong className="block text-emerald-400">Social Monitoring</strong>
                  X, LinkedIn, Telegram, Meta
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-200">
                  <strong className="block text-emerald-400">App Surveillance</strong>
                  Google Play, App Store, APKs
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-200">
                  <strong className="block text-cyan-400">Look-alike Engine</strong>
                  Bonus feature: swaps & homoglyphs
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-200">
                  <strong className="block text-purple-400">Zero False-Positives</strong>
                  Strict official exclusion gate
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 2: KampusVC Context
    {
      id: 2,
      category: 'Venture Studio Thesis & KampusVC Context',
      title: 'Target Context: Applied AI Ventures & Fast-Growing Studios',
      subtitle: 'Why venture studios like KampusVC face targeted digital risk attacks',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                About Kampus.VC Ecosystem
              </span>
              <span className="text-xs text-slate-500 font-mono">https://kampus.vc</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              KampusVC is an Applied AI Venture Studio that identifies promising opportunities, develops them into company theses, and co-builds those companies with ambitious university founders and experienced operators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase font-mono">Attack Vector 1</span>
              <h4 className="text-sm font-semibold text-slate-200">Fake AI Grants & Fellowships</h4>
              <p className="text-xs text-slate-400">
                Threat actors register fake profiles (e.g. <code className="text-slate-300">kampus_vc_support</code>) promising non-existent "AI model grants" or crypto seed funding to harvest founder wallets and pitch IP.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase font-mono">Attack Vector 2</span>
              <h4 className="text-sm font-semibold text-slate-200">Executive & Partner Pretexting</h4>
              <p className="text-xs text-slate-400">
                Spoofed LinkedIn recruiter pages claiming to be Kampus VC partners hiring remote AI researchers to exfiltrate applicant passports and corporate credentials.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase font-mono">Attack Vector 3</span>
              <h4 className="text-sm font-semibold text-slate-200">Trojanized Founder Mobile Apps</h4>
              <p className="text-xs text-slate-400">
                Repackaged Android APKs masquerading as the "Kampus Founder Portal" on third-party mirrors, embedding overlay malware that intercepts banking and authentication tokens.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 3: Social Media Monitoring
    {
      id: 3,
      category: 'Core Scope: 30% Evaluation Weight',
      title: 'Social Media Monitoring Engine',
      subtitle: 'Detecting impersonators, scam accounts & spoofed pages without flagging official assets',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-emerald-400" />
                Detection Capabilities
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Multi-Platform Ingestion:</strong> Continuous listening across X (Twitter), LinkedIn, Telegram, and Meta Graph API.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Intent & Bio Classification:</strong> NLP filters detecting scam urgency ("DM for grant", "account locked", wallet drops).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Visual Logo Spoofing:</strong> Perceptual image hashing identifying unauthorized logo replicas on avatars.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Verified Badge Spoofing:</strong> Detection of emoji hacks (e.g. 🔹, ✔️) inserted into display names to mimic platform verification.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-emerald-900/50 space-y-3">
              <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Judges' Key Test: Official Account Exclusion
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The evaluation criteria explicitly mandate: <em>"Official accounts should not be flagged"</em>.
              </p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>
                  <strong>How Vanguard guarantees zero false-positives on official accounts:</strong>
                </p>
                <div className="font-mono text-[11px] text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800">
                  if (candidate.canonicalHandle === brand.officialSocial.handle)<br />
                  &nbsp;&nbsp;return markAsOfficialExcluded(riskScore = 0);
                </div>
                <p className="text-slate-400 text-[11px]">
                  All legitimate channels (e.g. <code className="text-slate-200">@kampus_vc</code>) are automatically excluded by the Whitelist Exclusion Gatekeeper.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 4: App Store Monitoring
    {
      id: 4,
      category: 'Core Scope: 30% Evaluation Weight',
      title: 'App Store Monitoring & Publisher Verification',
      subtitle: 'Catching rogue mobile applications across Google Play, App Store & Sideload Mirrors',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-400" />
                Mobile Threat Vectors
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">!</span>
                  <span><strong>Publisher Mismatch Detection:</strong> Flags applications claiming brand identity whose developer entity does not match registered corporate legal credentials.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">!</span>
                  <span><strong>Bundle ID Typosquats:</strong> Identifies subtle package variations (e.g. <code className="text-slate-300">com.karnpus.connect</code> imitating <code className="text-emerald-400">vc.kampus.connect</code>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">!</span>
                  <span><strong>Invasive Permissions Scanner:</strong> Audits Android manifest flags for dangerous spyware permissions (SMS reading, screen overlay attacks, accessibility abuse).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">!</span>
                  <span><strong>Third-Party APK Aggregators:</strong> Monitors unvetted sideload repositories (APKPure, Aptoide) for cracked/modded packages.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-emerald-900/50 space-y-3">
              <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Official Application Whitelisting
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Official apps (such as the <em>Kampus Founder Portal</em> on Google Play) are indexed in the Brand Profile.
              </p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bundle ID:</span>
                  <span className="font-mono text-emerald-400">vc.kampus.connect</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Publisher:</span>
                  <span className="text-slate-200">Kampus VC Global Inc.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold">Whitelisted (Score: 0)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 5: Bonus Look-alike Feature
    {
      id: 5,
      category: 'Bonus Credit: 5–10 Points',
      title: 'Bonus Innovation: Look-alike Detection & Anti-Overflagging',
      subtitle: 'Deep algorithmic engine for character swaps, homoglyphs, visual pairs & affixes',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-cyan-400 font-semibold block">1. Transposition / Swaps</span>
              <p className="text-xs text-slate-300 mt-1">
                Damerau-Levenshtein metric captures adjacent character swaps (<code className="text-slate-200">kmapus</code>) targeting fast typers.
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-cyan-400 font-semibold block">2. Unicode Homoglyphs</span>
              <p className="text-xs text-slate-300 mt-1">
                Decodes Cyrillic & Greek look-alikes (<code className="text-slate-200">kаmpus</code> with Cyrillic а U+0430) rendered identically on displays.
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-cyan-400 font-semibold block">3. Visual Letter Pairs</span>
              <p className="text-xs text-slate-300 mt-1">
                Identifies typographic deception such as <code className="text-slate-200">rn</code> visually mimicking <code className="text-slate-200">m</code> (<code className="text-slate-200">karnpus</code>).
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono uppercase text-cyan-400 font-semibold block">4. Deceptive Affixes</span>
              <p className="text-xs text-slate-300 mt-1">
                Catches high-risk authority suffixes (<code className="text-slate-200">_support</code>, <code className="text-slate-200">-grants</code>, <code className="text-slate-200">_official</code>).
              </p>
            </div>
          </div>

          <div className="bg-blue-950/20 border border-blue-800/40 p-4 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-300 font-bold">
              <Shield className="h-4 w-4" />
              <span>Anti-Overflagging Discipline (Avoids False Positives on Normal Words)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              The brief emphasizes: <em>"The detection should avoid over-flagging legitimate or normal names."</em>
              Vanguard incorporates an English Lexicon Guard. Words like <strong>"campus"</strong>, <strong>"camp"</strong>, <strong>"apex"</strong>, and <strong>"scale"</strong> are cross-referenced with a comprehensive common dictionary. Unless an asset also reproduces copyrighted logos, deceptive domains, or urgent scam lures, casual linguistic overlap is suppressed to maintain high analyst trust.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 6: Summary & Live Demo Tour
    {
      id: 6,
      category: 'Deliverables & Live Evaluation',
      title: 'Remediation Workflow & Live Prototype Tour',
      subtitle: 'From detection to Gemini-powered takedown notice generation',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-purple-400 font-semibold block">AI Threat Forensics</span>
              <p className="text-xs text-slate-300">
                Deep analysis powered by Gemini 3.8 Flash breaking down social engineering tactics, victim vulnerability, and psychological urgency.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-purple-400 font-semibold block">1-Click Legal Takedown</span>
              <p className="text-xs text-slate-300">
                Pre-formatted DMCA & Trademark 15 U.S.C. § 1125 cease-and-desist notices tailored for Twitter/X, Meta, Google Play, and Apple App Store abuse desks.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-purple-400 font-semibold block">Incident Lifecycle</span>
              <p className="text-xs text-slate-300">
                Full status tracking: New → Under Investigation → Takedown Requested → Removed → Whitelisted with JSON and CSV exports.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-100">Ready to explore the live working prototype?</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch directly to the live operational views to test detections and run look-alike simulations:
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onGoToTab('social')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
              >
                Social Feed
              </button>
              <button
                onClick={() => onGoToTab('apps')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
              >
                App Feed
              </button>
              <button
                onClick={() => onGoToTab('lookalike')}
                className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-slate-950 text-xs font-semibold rounded-lg"
              >
                Look-alike Lab
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Slide Navigation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Presentation className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                Executive Presentation Deck
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400 font-mono">
                Slide {currentSlideIndex + 1} of {slides.length}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100">
              {currentSlide.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
            disabled={currentSlideIndex === 0}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-xs font-mono text-slate-400 px-2">
            {currentSlideIndex + 1} / {slides.length}
          </span>

          <button
            onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next Slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 min-h-[460px] flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
              {currentSlide.category}
            </span>
            <h1 className="text-2xl font-bold text-slate-100 mt-1">{currentSlide.title}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{currentSlide.subtitle}</p>
          </div>

          <div>{currentSlide.content}</div>
        </div>

        {/* Slide Footer with Dots */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between mt-8">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? 'w-7 bg-emerald-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Vanguard DRP · KampusVC Challenge Deliverable
          </div>
        </div>
      </div>
    </div>
  );
};
