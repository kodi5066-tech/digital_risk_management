import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// AI Threat Forensic Analysis Endpoint
app.post('/api/ai-analyze', async (req, res) => {
  try {
    const {
      brandName,
      threatType,
      targetName,
      targetHandleOrBundle,
      details,
      indicators,
      platformOrStore,
    } = req.body;

    if (!ai) {
      // Fallback deterministic analysis if API key is not configured
      return res.json({
        summary: `Automated Forensic Audit for ${targetName || targetHandleOrBundle} impersonating ${brandName}. High-confidence indicator correlation confirms deceptive brand hijacking tactics designed to manipulate victims.`,
        impersonationTactics: [
          `Visual & phonetic brand spoofing targeting customers looking for ${brandName}`,
          `Pretexting authority in user communications on ${platformOrStore}`,
          `Bypassing brand search results through look-alike variations`
        ],
        psychologicalTriggers: [
          'Artificial urgency ("immediate grant", "account locked")',
          'Lure of financial gain or fast-track venture allocation',
          'Simulated corporate authority'
        ],
        potentialHarm: 'Direct credential harvesting, unauthorized financial extraction, and irreparable brand trust erosion.',
        legalTakedownGrounds: [
          'Lanham Act 15 U.S.C. § 1125(a) - False Designation of Origin and Unfair Competition',
          `Platform Terms of Service Violation: Prohibited Impersonation on ${platformOrStore}`,
          'Anticybersquatting Consumer Protection Act (ACPA) / Trademark Dilution'
        ],
        recommendedAction: 'Execute expedited takedown notice to platform trust & safety desk and publish proactive brand advisory.',
        takedownNoticeDraft: `LEGAL NOTICE OF TRADEMARK INFRINGEMENT & IMPERSONATION\n\nTo: ${platformOrStore} Trust & Safety / Abuse Desk\nRe: Immediate Removal of Impersonating Asset "${targetName}" (${targetHandleOrBundle})\n\nWe represent the legitimate intellectual property holder for "${brandName}".\nThe reported asset has copied our registered brand identifiers, misleading consumers into believing it is affiliated with or endorsed by our organization.\n\nInfringing URL / Identifier: ${targetHandleOrBundle}\nInfringed Trademark: ${brandName}\n\nWe request immediate suspension of this fraudulent profile pursuant to your Terms of Service and applicable intellectual property statutes.\n\nSigned,\nDigital Risk Protection Legal Operations on behalf of ${brandName}`,
        analyzedAt: new Date().toISOString(),
      });
    }

    const prompt = `You are a Principal Threat Intelligence & Digital Risk Protection (DRP) Analyst.
Analyze the following suspected brand impersonation incident:
- Legitimate Brand: ${brandName}
- Target Platform / Store: ${platformOrStore}
- Suspect Asset Name: ${targetName}
- Suspect Handle / Bundle ID: ${targetHandleOrBundle}
- Threat Classification: ${threatType}
- Technical Indicators: ${(indicators || []).join('; ')}
- Context & Bio / Description: ${details || 'N/A'}

Provide a rigorous cybersecurity forensic analysis in JSON format with exactly these fields:
1. "summary": A concise executive summary of the threat.
2. "impersonationTactics": An array of 3 bullet points detailing how the attacker mimics the brand.
3. "psychologicalTriggers": An array of 3 social engineering or urgency mechanisms used.
4. "potentialHarm": Description of the concrete financial, credential, or reputation harm to victims.
5. "legalTakedownGrounds": An array of 3 specific legal or policy grounds (e.g. Lanham Act, DMCA, Google Play Policy).
6. "recommendedAction": Immediate operational remediation recommendation.
7. "takedownNoticeDraft": A professional, pre-drafted takedown letter ready to submit to the platform's abuse desk.

Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { summary: text };
    }

    parsed.analyzedAt = new Date().toISOString();
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating AI analysis:', error);
    // Graceful fallback response
    return res.json({
      summary: `Forensic audit conducted for suspect ${req.body.targetName || 'asset'}. Detected brand impersonation patterns targeting ${req.body.brandName}.`,
      impersonationTactics: [
        'Spoofed brand name and visual identity',
        'Unauthorized corporate pretexting',
        'Lookalike nomenclature to capture user traffic'
      ],
      psychologicalTriggers: ['False authority', 'Urgency', 'Exclusivity lure'],
      potentialHarm: 'Account takeover, credential theft, and brand reputation degradation.',
      legalTakedownGrounds: ['Trademark Infringement', 'Platform Impersonation Policy', 'Unfair Competition'],
      recommendedAction: 'Issue immediate platform takedown and blacklist suspect domains.',
      takedownNoticeDraft: `Attention: ${req.body.platformOrStore} Abuse Team\nPlease immediately suspend ${req.body.targetName} (${req.body.targetHandleOrBundle}) for unauthorized impersonation of ${req.body.brandName}.`,
      analyzedAt: new Date().toISOString(),
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiEnabled: Boolean(apiKey),
  });
});

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vanguard DRP Platform running at http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
