import { LookalikeAnalysis } from '../types/drp';

// Common homoglyphs map (Cyrillic, Greek, look-alike unicode to ASCII)
export const HOMOGLYPH_MAP: Record<string, string> = {
  '\u0430': 'a', // Cyrillic small letter a
  '\u0410': 'A', // Cyrillic capital letter A
  '\u0435': 'e', // Cyrillic small letter e
  '\u0415': 'E', // Cyrillic capital letter E
  '\u043E': 'o', // Cyrillic small letter o
  '\u041E': 'O', // Cyrillic capital letter O
  '\u0440': 'p', // Cyrillic small letter er (p)
  '\u0420': 'P', // Cyrillic capital letter Er (P)
  '\u0441': 'c', // Cyrillic small letter es (c)
  '\u0421': 'C', // Cyrillic capital letter Es (C)
  '\u0443': 'y', // Cyrillic small letter u (looks like y)
  '\u0445': 'x', // Cyrillic small letter ha (x)
  '\u0456': 'i', // Cyrillic small letter byelorussian-ukrainian i
  '\u03B1': 'a', // Greek small letter alpha
  '\u03BF': 'o', // Greek small letter omicron
  '\u03BD': 'v', // Greek small letter nu
  '\u0251': 'a', // Latin small letter alpha
  '1': 'l',      // Digit 1 for l or i
  '0': 'o',      // Digit 0 for o
  '@': 'a',      // At sign for a
  '$': 's',      // Dollar sign for s
};

// Common deceptive affixes used by threat actors
export const DECEPTIVE_AFFIXES = [
  'official', 'support', 'help', 'helpdesk', 'care', 'service',
  'portal', 'connect', 'login', 'secure', 'verify', 'team',
  'global', 'app', 'online', 'invest', 'funding', 'airdrop',
  'claim', 'rewards', 'bonus', 'community', 'hq', 'desk', 'corp'
];

// Common dictionary words to avoid over-flagging (false-positive prevention)
export const COMMON_DICTIONARY_WORDS = new Set([
  'campus', 'camp', 'champ', 'campground', 'camping', 'compass',
  'apex', 'scale', 'cloud', 'venture', 'studio', 'network',
  'capital', 'digital', 'global', 'systems', 'solutions', 'labs'
]);

/**
 * Standard Levenshtein Distance
 */
export function levenshteinDistance(a: string, b: string): number {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  const m = s1.length;
  const n = s2.length;
  const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // deletion
        d[i][j - 1] + 1,      // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return d[m][n];
}

/**
 * Damerau-Levenshtein Distance (includes character transpositions/swaps)
 */
export function damerauLevenshteinDistance(a: string, b: string): number {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  const m = s1.length;
  const n = s2.length;
  const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
      if (
        i > 1 &&
        j > 1 &&
        s1[i - 1] === s2[j - 2] &&
        s1[i - 2] === s2[j - 1]
      ) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1); // transposition / character swap
      }
    }
  }
  return d[m][n];
}

/**
 * Jaro-Winkler Similarity Metric (0.0 to 1.0)
 */
export function jaroWinkler(s1: string, s2: string): number {
  const str1 = s1.toLowerCase();
  const str2 = s2.toLowerCase();
  if (str1 === str2) return 1.0;

  const len1 = str1.length;
  const len2 = str2.length;
  if (len1 === 0 || len2 === 0) return 0.0;

  const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
  const s1Matches = new Array(len1).fill(false);
  const s2Matches = new Array(len2).fill(false);

  let matches = 0;
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, len2);
    for (let j = start; j < end; j++) {
      if (s2Matches[j] || str1[i] !== str2[j]) continue;
      s1Matches[i] = true;
      s2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  let transpositions = 0;
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) k++;
    if (str1[i] !== str2[k]) transpositions++;
    k++;
  }

  const jaro =
    (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;

  // Winkler prefix scale
  let prefix = 0;
  for (let i = 0; i < Math.min(4, Math.min(len1, len2)); i++) {
    if (str1[i] === str2[i]) prefix++;
    else break;
  }

  return Math.min(1.0, jaro + prefix * 0.1 * (1 - jaro));
}

/**
 * Detect Homoglyphs and Confusable Unicode characters
 */
export function extractHomoglyphs(candidate: string): {
  normalized: string;
  confusableChars: Array<{ original: string; replaced: string; unicodeHex: string }>;
} {
  const confusableChars: Array<{ original: string; replaced: string; unicodeHex: string }> = [];
  let normalized = '';

  for (const char of candidate) {
    if (HOMOGLYPH_MAP[char]) {
      const hex = 'U+' + char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
      confusableChars.push({
        original: char,
        replaced: HOMOGLYPH_MAP[char],
        unicodeHex: hex,
      });
      normalized += HOMOGLYPH_MAP[char];
    } else {
      normalized += char;
    }
  }

  return { normalized, confusableChars };
}

/**
 * Check Visual Pair substitutions like 'rn' -> 'm', 'cl' -> 'd', 'vv' -> 'w'
 */
export function normalizeVisualPairs(str: string): string {
  return str
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w')
    .replace(/cl/g, 'd')
    .replace(/l0/g, 'lo');
}

/**
 * Remove spacing, dots, hyphens, underscores for pure alphanumeric comparison
 */
export function cleanAlphanumeric(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Comprehensive Look-alike Analysis
 */
export function analyzeLookalike(
  candidateName: string,
  targetBrand: string,
  aliases: string[] = []
): LookalikeAnalysis {
  const cleanTarget = cleanAlphanumeric(targetBrand);
  const cleanCandidate = cleanAlphanumeric(candidateName);

  // Exact match to brand or alias?
  const targets = [targetBrand, ...aliases].map((t) => cleanAlphanumeric(t));
  if (targets.includes(cleanCandidate)) {
    return {
      isLookalike: false,
      technique: 'none',
      distance: 0,
      jaroWinklerScore: 1.0,
      confusableChars: [],
      explanation: 'Exact match with legitimate registered brand name/alias (Candidate is identical).',
      isFalsePositiveSuppressed: false,
    };
  }

  // Check 1: Homoglyph attack
  const homoglyphResult = extractHomoglyphs(candidateName);
  if (homoglyphResult.confusableChars.length > 0) {
    const homoglyphClean = cleanAlphanumeric(homoglyphResult.normalized);
    for (const t of targets) {
      if (homoglyphClean === t || homoglyphClean.includes(t)) {
        return {
          isLookalike: true,
          technique: 'homoglyph',
          distance: damerauLevenshteinDistance(homoglyphClean, t),
          jaroWinklerScore: jaroWinkler(homoglyphClean, t),
          confusableChars: homoglyphResult.confusableChars,
          explanation: `Detected ${homoglyphResult.confusableChars.length} confusable Unicode/Cyrillic character(s): ${homoglyphResult.confusableChars
            .map((c) => `'${c.original}' (${c.unicodeHex} replaced with '${c.replaced}')`)
            .join(', ')}.`,
        };
      }
    }
  }

  // Check 2: Visual pair spoofing ('rn' for 'm')
  const visualCandidate = normalizeVisualPairs(candidateName.toLowerCase());
  for (const t of targets) {
    if (cleanAlphanumeric(visualCandidate) === t && cleanCandidate !== t) {
      return {
        isLookalike: true,
        technique: 'visual_pair',
        distance: 1,
        jaroWinklerScore: 0.96,
        confusableChars: [],
        explanation: `Visual letter combination attack detected: candidate uses pairs like 'rn' to visually spoof '${t}'.`,
      };
    }
  }

  // Check 3: Added Words / Affixes (e.g. 'kampus-support', 'kampus_official')
  const lowerCandidate = candidateName.toLowerCase();
  for (const t of targets) {
    if (lowerCandidate.includes(t)) {
      const remaining = lowerCandidate.replace(new RegExp(t, 'g'), '');
      const cleanRemaining = cleanAlphanumeric(remaining);
      const matchedAffix = DECEPTIVE_AFFIXES.find((affix) => cleanRemaining.includes(affix));

      if (matchedAffix) {
        return {
          isLookalike: true,
          technique: 'added_word',
          distance: remaining.length,
          jaroWinklerScore: jaroWinkler(lowerCandidate, t),
          confusableChars: [],
          explanation: `Deceptive keyword affix '${matchedAffix}' appended to official brand '${t}' to simulate authority.`,
        };
      } else if (cleanRemaining.length >= 2 && cleanRemaining.length <= 12) {
        return {
          isLookalike: true,
          technique: 'added_word',
          distance: remaining.length,
          jaroWinklerScore: jaroWinkler(lowerCandidate, t),
          confusableChars: [],
          explanation: `Brand stem '${t}' combined with supplemental string '${cleanRemaining}' to mimic official sub-branch.`,
        };
      }
    }
  }

  // Check 4: Spacing & Delimiter Changes
  const candidateWithoutSeparators = candidateName.replace(/[-_.\s+]/g, '').toLowerCase();
  const targetWithoutSeparators = targetBrand.replace(/[-_.\s+]/g, '').toLowerCase();
  if (
    candidateWithoutSeparators === targetWithoutSeparators &&
    candidateName.toLowerCase() !== targetBrand.toLowerCase()
  ) {
    return {
      isLookalike: true,
      technique: 'spacing_change',
      distance: 1,
      jaroWinklerScore: 0.98,
      confusableChars: [],
      explanation: `Spacing or delimiter manipulation: altered whitespace/punctuation to bypass exact-string search filters.`,
    };
  }

  // Check 5: Character Swaps & Typosquatting (Damerau-Levenshtein edit distance)
  let bestDistance = 999;
  let bestJaro = 0;
  let bestTarget = targetBrand;

  for (const t of targets) {
    const dist = damerauLevenshteinDistance(cleanCandidate, t);
    const jw = jaroWinkler(cleanCandidate, t);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestJaro = jw;
      bestTarget = t;
    }
  }

  // Anti-Overflagging (False Positive Mitigation):
  // Check if candidate is an ordinary dictionary word
  const isOrdinaryDictionaryWord = COMMON_DICTIONARY_WORDS.has(cleanCandidate);

  // If candidate is a normal dictionary word with distance >= 2, DO NOT over-flag!
  if (isOrdinaryDictionaryWord && bestDistance >= 2) {
    return {
      isLookalike: false,
      technique: 'none',
      distance: bestDistance,
      jaroWinklerScore: bestJaro,
      confusableChars: [],
      explanation: `False positive avoided: '${candidateName}' is a recognized general dictionary term, not an intentional brand typo.`,
      isFalsePositiveSuppressed: true,
      mitigationApplied: 'Common English lexicon filter suppressed accidental look-alike flag.',
    };
  }

  // Character swap / Typosquatting threshold:
  // For short brand names (<=6 chars), distance 1 or 2 is suspicious if Jaro > 0.84
  if (bestDistance <= 2 && bestJaro >= 0.82 && cleanCandidate.length >= 3) {
    return {
      isLookalike: true,
      technique: 'character_swap',
      distance: bestDistance,
      jaroWinklerScore: bestJaro,
      confusableChars: [],
      explanation: `Character swap / transposition attack detected (Levenshtein distance: ${bestDistance}, Jaro-Winkler: ${(bestJaro * 100).toFixed(1)}%). Likely typosquatting attempt against '${bestTarget}'.`,
    };
  }

  return {
    isLookalike: false,
    technique: 'none',
    distance: bestDistance,
    jaroWinklerScore: bestJaro,
    confusableChars: [],
    explanation: 'Candidate does not exhibit significant look-alike or typosquatting patterns.',
    isFalsePositiveSuppressed: false,
  };
}

/**
 * Synthetic Look-alike Generator for the "Look-alike Lab"
 */
export function generateSyntheticLookalikes(brandName: string): Array<{
  variant: string;
  technique: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
}> {
  const clean = brandName.trim();
  const lower = clean.toLowerCase();
  const list: Array<{
    variant: string;
    technique: string;
    description: string;
    severity: 'critical' | 'high' | 'medium';
  }> = [];

  // 1. Homoglyphs
  if (lower.includes('a')) {
    list.push({
      variant: lower.replace('a', '\u0430'), // Cyrillic а
      technique: 'Cyrillic Homoglyph (а)',
      description: 'Replaces ASCII "a" with Cyrillic "а" (U+0430). Rendered identically on most devices.',
      severity: 'critical',
    });
  }
  if (lower.includes('o')) {
    list.push({
      variant: lower.replace('o', '\u043E'), // Cyrillic о
      technique: 'Cyrillic Homoglyph (о)',
      description: 'Replaces ASCII "o" with Cyrillic "о" (U+043E) for stealth spoofing.',
      severity: 'critical',
    });
  }
  if (lower.includes('e')) {
    list.push({
      variant: lower.replace('e', '\u0435'), // Cyrillic е
      technique: 'Cyrillic Homoglyph (е)',
      description: 'Replaces ASCII "e" with Cyrillic "е" (U+0435) to evade string-match rules.',
      severity: 'critical',
    });
  }

  // 2. Visual Pair
  if (lower.includes('m')) {
    list.push({
      variant: lower.replace('m', 'rn'),
      technique: 'Visual Pair ("rn" for "m")',
      description: 'Substitutes "m" with "rn", appearing virtually indistinguishable in sans-serif typography.',
      severity: 'critical',
    });
  }
  if (lower.includes('w')) {
    list.push({
      variant: lower.replace('w', 'vv'),
      technique: 'Visual Pair ("vv" for "w")',
      description: 'Substitutes "w" with double "vv".',
      severity: 'high',
    });
  }

  // 3. Character Swaps / Transposition
  if (clean.length >= 4) {
    const chars = clean.split('');
    const temp = chars[1];
    chars[1] = chars[2];
    chars[2] = temp;
    list.push({
      variant: chars.join(''),
      technique: 'Adjacent Transposition',
      description: `Swapped 2nd and 3rd letters ("${clean}" -> "${chars.join('')}"). Classic typosquat targeting fast typers.`,
      severity: 'high',
    });
  }

  // 4. Missing / Added Character
  list.push({
    variant: `${lower}s`,
    technique: 'Pluralization / Suffix Insertion',
    description: 'Added trailing "s" to impersonate brand division or fan community.',
    severity: 'medium',
  });

  // 5. Affix Spoofing
  list.push({
    variant: `${lower}_official`,
    technique: 'Authority Affix (_official)',
    description: 'Common social media impersonation pattern targeting customer support seekers.',
    severity: 'critical',
  });
  list.push({
    variant: `${lower}-support`,
    technique: 'Support Impersonation (-support)',
    description: 'High-risk fake helpdesk account used to intercept credential resets and funds.',
    severity: 'critical',
  });
  list.push({
    variant: `get${lower}`,
    technique: 'Action Prefix (get-)',
    description: 'Common mobile app clone naming scheme (e.g. getkampus).',
    severity: 'high',
  });

  // 6. Delimiter / Spacing Variations
  list.push({
    variant: lower.split('').join('.'),
    technique: 'Dot Delimiter Separation',
    description: 'Inserted periods between characters to break standard substring filters.',
    severity: 'medium',
  });

  return list;
}
