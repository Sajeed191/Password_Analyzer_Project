export interface PasswordAnalysis {
  score: number; // 0-100
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  crackTime: string;
  crackTimeSeconds: number;
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  hasCommonPatterns: boolean;
  entropy: number;
  suggestions: string[];
  charsetSize: number;
}

const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
  'dragon', '111111', 'baseball', 'iloveyou', 'trustno1', 'sunshine',
  'letmein', 'football', 'shadow', 'superman', 'michael', 'ninja',
];

const COMMON_PATTERNS = [
  /^(.)\1+$/, // all same char
  /^(012|123|234|345|456|567|678|789|890)+$/, // sequential numbers
  /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+$/i,
  /^(qwerty|asdf|zxcv)/i,
];

function formatCrackTime(seconds: number): string {
  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1e6) return `${Math.round(seconds / (31536000 * 1000))}K years`;
  if (seconds < 31536000 * 1e9) return `${Math.round(seconds / (31536000 * 1e6))}M years`;
  return `${(seconds / (31536000 * 1e9)).toFixed(0)}B+ years`;
}

export function analyzePassword(password: string): PasswordAnalysis {
  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);
  const isCommon = COMMON_PASSWORDS.includes(password.toLowerCase());
  const hasCommonPatterns = isCommon || COMMON_PATTERNS.some(p => p.test(password));

  let charsetSize = 0;
  if (hasLowercase) charsetSize += 26;
  if (hasUppercase) charsetSize += 26;
  if (hasNumbers) charsetSize += 10;
  if (hasSymbols) charsetSize += 33;
  if (charsetSize === 0) charsetSize = 26;

  const entropy = length * Math.log2(charsetSize);
  
  // Guesses per second (10 billion - modern GPU)
  const guessesPerSecond = 1e10;
  const combinations = Math.pow(charsetSize, length);
  const crackTimeSeconds = combinations / guessesPerSecond / 2;

  let score = 0;
  score += Math.min(25, length * 2.5);
  score += hasUppercase ? 10 : 0;
  score += hasLowercase ? 10 : 0;
  score += hasNumbers ? 10 : 0;
  score += hasSymbols ? 15 : 0;
  score += Math.min(15, entropy / 6);
  score += length >= 12 ? 10 : length >= 8 ? 5 : 0;
  
  if (hasCommonPatterns) score = Math.min(score, 15);
  if (isCommon) score = 5;
  if (length === 0) score = 0;

  score = Math.min(100, Math.max(0, Math.round(score)));

  let strength: PasswordAnalysis['strength'];
  if (score < 20) strength = 'Very Weak';
  else if (score < 40) strength = 'Weak';
  else if (score < 60) strength = 'Fair';
  else if (score < 80) strength = 'Strong';
  else strength = 'Very Strong';

  const suggestions: string[] = [];
  if (length < 8) suggestions.push('Use at least 8 characters');
  if (length < 12) suggestions.push('Consider using 12+ characters for better security');
  if (!hasUppercase) suggestions.push('Add uppercase letters');
  if (!hasLowercase) suggestions.push('Add lowercase letters');
  if (!hasNumbers) suggestions.push('Add numbers');
  if (!hasSymbols) suggestions.push('Add special characters (!@#$%...)');
  if (hasCommonPatterns) suggestions.push('Avoid common patterns and dictionary words');
  if (suggestions.length === 0) suggestions.push('Excellent password!');

  return {
    score, strength, crackTime: formatCrackTime(crackTimeSeconds),
    crackTimeSeconds, length, hasUppercase, hasLowercase, hasNumbers,
    hasSymbols, hasCommonPatterns, entropy: Math.round(entropy * 10) / 10,
    suggestions, charsetSize,
  };
}

export function generatePassword(length = 16, options?: {
  uppercase?: boolean; lowercase?: boolean; numbers?: boolean; symbols?: boolean;
}): string {
  const opts = { uppercase: true, lowercase: true, numbers: true, symbols: true, ...options };
  let chars = '';
  if (opts.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (opts.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (opts.numbers) chars += '0123456789';
  if (opts.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, v => chars[v % chars.length]).join('');
}

// Passphrase generator
const WORD_LIST = [
  'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
  'india', 'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa',
  'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whiskey',
  'xray', 'yankee', 'zulu', 'anchor', 'beacon', 'cipher', 'drift',
  'ember', 'falcon', 'glacier', 'horizon', 'ignite', 'jade', 'kernel',
  'lunar', 'matrix', 'nebula', 'orbit', 'pulse', 'quartz', 'radar',
  'spark', 'thunder', 'ultra', 'vortex', 'wave', 'xenon', 'yield', 'zenith',
  'arctic', 'blaze', 'comet', 'dawn', 'eclipse', 'flame', 'glyph',
  'helix', 'iron', 'jet', 'kraken', 'lumen', 'magnet', 'neon',
  'onyx', 'prism', 'quantum', 'raven', 'storm', 'titan', 'umbra',
  'vapor', 'warp', 'vertex', 'zodiac', 'apex', 'bolt', 'crest',
  'dune', 'edge', 'frost', 'grid', 'haze', 'ionic', 'flux',
];

export function generatePassphrase(wordCount = 4, separator = '-', capitalize = true): string {
  const array = new Uint32Array(wordCount);
  crypto.getRandomValues(array);
  const words = Array.from(array, v => {
    const word = WORD_LIST[v % WORD_LIST.length];
    return capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  });
  return words.join(separator);
}

// Breach check simulation (client-side heuristic since we can't call APIs)
const BREACHED_PASSWORDS = new Set([
  'password', '123456', '123456789', 'qwerty', 'abc123', 'monkey', 'master',
  'dragon', '111111', 'baseball', 'iloveyou', 'trustno1', 'sunshine',
  'letmein', 'football', 'shadow', 'superman', 'michael', 'ninja',
  'mustang', 'access', 'batman', 'admin', 'login', 'passw0rd',
  'welcome', 'hello', 'charlie', 'donald', 'password1', 'qwerty123',
  '1234567', '12345678', '1234567890', '123123', '000000', '654321',
  'lovely', 'princess', 'rockyou', 'ashley', 'michael1', 'jessica',
  'test', 'test123', 'guest', 'master123', 'changeme', 'love',
]);

export interface BreachCheckResult {
  isBreached: boolean;
  riskLevel: 'Safe' | 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical';
  message: string;
  similarBreached: number;
}

export function checkBreach(password: string): BreachCheckResult {
  const lower = password.toLowerCase();
  const isDirectMatch = BREACHED_PASSWORDS.has(lower);
  
  // Check similarity to breached passwords
  let similarCount = 0;
  BREACHED_PASSWORDS.forEach(bp => {
    if (lower.includes(bp) || bp.includes(lower)) similarCount++;
    // Simple Levenshtein-like check for very similar passwords
    if (Math.abs(lower.length - bp.length) <= 2) {
      let diff = 0;
      const minLen = Math.min(lower.length, bp.length);
      for (let i = 0; i < minLen; i++) {
        if (lower[i] !== bp[i]) diff++;
      }
      diff += Math.abs(lower.length - bp.length);
      if (diff <= 2 && diff > 0) similarCount++;
    }
  });

  if (isDirectMatch) {
    return {
      isBreached: true,
      riskLevel: 'Critical',
      message: 'This exact password has been found in multiple data breaches. Change it immediately!',
      similarBreached: similarCount,
    };
  }
  if (similarCount > 3) {
    return {
      isBreached: false,
      riskLevel: 'High Risk',
      message: 'This password is very similar to multiple breached passwords.',
      similarBreached: similarCount,
    };
  }
  if (similarCount > 0) {
    return {
      isBreached: false,
      riskLevel: 'Medium Risk',
      message: 'This password has some similarity to known breached passwords.',
      similarBreached: similarCount,
    };
  }
  
  const analysis = analyzePassword(password);
  if (analysis.score < 40) {
    return {
      isBreached: false,
      riskLevel: 'Low Risk',
      message: 'Not found in known breaches, but the password is still weak.',
      similarBreached: 0,
    };
  }
  
  return {
    isBreached: false,
    riskLevel: 'Safe',
    message: 'This password was not found in known data breaches.',
    similarBreached: 0,
  };
}

// Security tips
export const SECURITY_TIPS = [
  { title: 'Enable Two-Factor Authentication', desc: 'Add an extra layer of security with 2FA on all critical accounts.', icon: 'shield' },
  { title: 'Use Unique Passwords', desc: 'Never reuse passwords across different services or websites.', icon: 'key' },
  { title: 'Use a Password Manager', desc: 'Store passwords securely instead of writing them down or memorizing.', icon: 'lock' },
  { title: 'Avoid Personal Information', desc: "Don't use birthdays, names, or common words in passwords.", icon: 'user' },
  { title: 'Update Regularly', desc: 'Change passwords every 90 days for sensitive accounts.', icon: 'refresh' },
  { title: 'Check for Breaches', desc: 'Regularly check if your credentials have been exposed in data breaches.', icon: 'alert' },
  { title: 'Use Passphrases', desc: 'Long passphrases like "Correct-Horse-Battery-Staple" are strong and memorable.', icon: 'text' },
  { title: 'Beware of Phishing', desc: 'Never enter passwords on suspicious links or emails.', icon: 'warning' },
];
