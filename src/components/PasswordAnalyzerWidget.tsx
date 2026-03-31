import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, Zap, Copy, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Clock, Hash, Lock, Fingerprint, TrendingUp } from 'lucide-react';
import { analyzePassword, generatePassword, type PasswordAnalysis } from '@/lib/passwordAnalyzer';
import { addToHistory } from '@/lib/historyStore';

const strengthColors: Record<string, string> = {
  'Very Weak': 'bg-destructive', 'Weak': 'bg-neon-orange', 'Fair': 'bg-yellow-500', 'Strong': 'bg-neon-cyan', 'Very Strong': 'bg-neon-green',
};
const strengthGlow: Record<string, string> = {
  'Very Weak': 'shadow-[0_0_15px_hsl(0_85%_55%/0.4)]', 'Weak': 'shadow-[0_0_15px_hsl(25_100%_55%/0.4)]', 'Fair': 'shadow-[0_0_15px_hsl(50_100%_50%/0.4)]', 'Strong': 'shadow-[0_0_15px_hsl(185_100%_50%/0.4)]', 'Very Strong': 'shadow-[0_0_15px_hsl(150_100%_50%/0.4)]',
};
const strengthTextColors: Record<string, string> = {
  'Very Weak': 'text-destructive', 'Weak': 'text-neon-orange', 'Fair': 'text-yellow-500', 'Strong': 'text-neon-cyan', 'Very Strong': 'text-neon-green',
};
const strengthStrokeColors: Record<string, string> = {
  'Very Weak': 'hsl(0 85% 55%)', 'Weak': 'hsl(25 100% 55%)', 'Fair': 'hsl(50 100% 50%)', 'Strong': 'hsl(185 100% 50%)', 'Very Strong': 'hsl(150 100% 50%)',
};

// Circular progress gauge
function ScoreGauge({ score, strength }: { score: number; strength: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const strokeColor = strengthStrokeColors[strength] || 'hsl(185 100% 50%)';

  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="8" opacity="0.3" />
        <motion.circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${strokeColor})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-3xl sm:text-4xl font-display font-bold ${strengthTextColors[strength]}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-display text-muted-foreground tracking-wider uppercase mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

export default function PasswordAnalyzerWidget() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [copied, setCopied] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState<PasswordAnalysis | null>(null);

  // Real-time analysis as user types
  useEffect(() => {
    if (password.length > 0) {
      setLiveAnalysis(analyzePassword(password));
    } else {
      setLiveAnalysis(null);
    }
  }, [password]);

  const handleAnalyze = useCallback(() => {
    if (!password) return;
    const result = analyzePassword(password);
    setAnalysis(result);
    addToHistory({ password, score: result.score, strength: result.strength, crackTime: result.crackTime, entropy: result.entropy, type: 'analyzed' });
  }, [password]);

  const handleGenerate = useCallback(() => {
    const newPw = generatePassword(18);
    setPassword(newPw);
    const result = analyzePassword(newPw);
    setAnalysis(result);
    addToHistory({ password: newPw, score: result.score, strength: result.strength, crackTime: result.crackTime, entropy: result.entropy, type: 'generated' });
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Password Input */}
      <div className="glass-card neon-border">
        <div className="section-heading"><span>Password Input</span></div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setAnalysis(null); }}
              onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
              placeholder="Enter password to analyze..."
              className="input-cyber pl-10 pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <button onClick={() => setShowPassword(!showPassword)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                {copied ? <CheckCircle2 className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Live strength indicator */}
        <AnimatePresence>
          {liveAnalysis && !analysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-display text-muted-foreground tracking-wider uppercase">Live Strength</span>
                </div>
                <span className={`text-xs font-display font-bold tracking-wider ${strengthTextColors[liveAnalysis.strength]}`}>
                  {liveAnalysis.strength}
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary/80 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${strengthColors[liveAnalysis.strength]}`}
                  animate={{ width: `${liveAnalysis.score}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button onClick={handleAnalyze} className="neon-btn flex-1 text-xs sm:text-sm py-2.5" disabled={!password}>
            <Shield className="w-4 h-4" />
            Analyze
          </button>
          <button onClick={handleGenerate} className="neon-btn-outline flex-1 text-xs sm:text-sm py-2.5">
            <RefreshCw className="w-4 h-4" />
            Generate
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Score Gauge + Strength Badge */}
            <div className="glass-card">
              <ScoreGauge score={analysis.score} strength={analysis.strength} />
              <div className="flex justify-center mt-4">
                <motion.div
                  className={`px-5 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-wider ${strengthColors[analysis.strength]} text-primary-foreground ${strengthGlow[analysis.strength]}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
                >
                  {analysis.strength}
                </motion.div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Clock, label: 'Crack Time', value: analysis.crackTime, color: 'text-neon-orange' },
                { icon: Zap, label: 'Entropy', value: `${analysis.entropy} bits`, color: 'text-neon-purple' },
                { icon: Hash, label: 'Length', value: `${analysis.length} chars`, color: 'text-neon-cyan' },
                { icon: Lock, label: 'Charset', value: `${analysis.charsetSize} chars`, color: 'text-neon-green' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="stat-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                >
                  <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />
                  <p className="text-[10px] font-display text-muted-foreground tracking-wider uppercase">{stat.label}</p>
                  <p className="font-body font-bold text-sm text-foreground mt-1">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Character Checks */}
            <div className="glass-card">
              <div className="section-heading"><span>Character Analysis</span></div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Uppercase (A-Z)', check: analysis.hasUppercase },
                  { label: 'Lowercase (a-z)', check: analysis.hasLowercase },
                  { label: 'Numbers (0-9)', check: analysis.hasNumbers },
                  { label: 'Symbols (!@#)', check: analysis.hasSymbols },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-sm font-body">
                    {item.check
                      ? <CheckCircle2 className="w-4 h-4 text-neon-green shrink-0" style={{ filter: 'drop-shadow(0 0 4px hsl(150 100% 50%/0.4))' }} />
                      : <XCircle className="w-4 h-4 text-destructive shrink-0" />}
                    <span className="text-foreground/80">{item.label}</span>
                  </div>
                ))}
              </div>
              {analysis.hasCommonPatterns && (
                <motion.div
                  className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-body"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Common pattern detected — avoid dictionary words!
                </motion.div>
              )}
            </div>

            {/* Suggestions */}
            <div className="glass-card">
              <div className="section-heading"><span>Recommendations</span></div>
              <ul className="space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2 text-sm font-body text-foreground/80"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.05 }}
                  >
                    <span className="text-neon-cyan mt-0.5" style={{ filter: 'drop-shadow(0 0 4px hsl(185 100% 50%/0.4))' }}>▸</span>
                    {s}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
