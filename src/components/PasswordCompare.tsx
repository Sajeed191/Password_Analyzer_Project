import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, Shield, Fingerprint, Trophy, ArrowRight } from 'lucide-react';
import { analyzePassword, type PasswordAnalysis } from '@/lib/passwordAnalyzer';

const strengthTextColors: Record<string, string> = {
  'Very Weak': 'text-destructive', 'Weak': 'text-neon-orange', 'Fair': 'text-yellow-500', 'Strong': 'text-neon-cyan', 'Very Strong': 'text-neon-green',
};
const strengthBgColors: Record<string, string> = {
  'Very Weak': 'bg-destructive', 'Weak': 'bg-neon-orange', 'Fair': 'bg-yellow-500', 'Strong': 'bg-neon-cyan', 'Very Strong': 'bg-neon-green',
};

export default function PasswordCompare() {
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [result, setResult] = useState<{ a1: PasswordAnalysis; a2: PasswordAnalysis } | null>(null);

  const handleCompare = () => {
    if (!pw1 || !pw2) return;
    setResult({ a1: analyzePassword(pw1), a2: analyzePassword(pw2) });
  };

  const winner = result ? (result.a1.score > result.a2.score ? 1 : result.a1.score < result.a2.score ? 2 : 0) : null;

  return (
    <div className="space-y-5">
      <div className="glass-card neon-border">
        <div className="section-heading"><span>Password Comparison</span></div>
        <p className="text-sm text-muted-foreground font-body mb-4">
          Compare two passwords side-by-side to determine which is more secure.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="relative">
            <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="password" value={pw1} onChange={e => { setPw1(e.target.value); setResult(null); }} placeholder="Password A" className="input-cyber pl-10" />
          </div>
          <div className="relative">
            <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-purple/60" />
            <input type="password" value={pw2} onChange={e => { setPw2(e.target.value); setResult(null); }} placeholder="Password B" className="input-cyber pl-10" />
          </div>
        </div>
        <button onClick={handleCompare} disabled={!pw1 || !pw2} className="neon-btn w-full mt-4 text-sm py-2.5">
          <GitCompare className="w-4 h-4" />
          Compare Passwords
        </button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Winner banner */}
          {winner !== 0 && (
            <motion.div
              className="glass-card neon-border text-center py-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Trophy className="w-8 h-8 text-neon-cyan mx-auto mb-2" style={{ filter: 'drop-shadow(0 0 8px hsl(185 100% 50%/0.5))' }} />
              <p className="font-display font-bold text-sm tracking-wider uppercase text-foreground">
                Password {winner === 1 ? 'A' : 'B'} is stronger
              </p>
              <p className="text-xs text-muted-foreground font-body mt-1">
                by {Math.abs(result.a1.score - result.a2.score)} points
              </p>
            </motion.div>
          )}

          {/* Side by side comparison */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Password A', analysis: result.a1, isWinner: winner === 1 },
              { label: 'Password B', analysis: result.a2, isWinner: winner === 2 },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                className={`glass-card relative overflow-hidden ${item.isWinner ? 'ring-2 ring-neon-cyan/30' : ''}`}
                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {item.isWinner && <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'var(--gradient-neon)' }} />}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-xs tracking-wider uppercase text-foreground font-semibold">{item.label}</span>
                  {item.isWinner && <Trophy className="w-4 h-4 text-neon-cyan" />}
                </div>

                {/* Score */}
                <div className="text-center mb-3">
                  <p className={`text-3xl font-display font-bold ${strengthTextColors[item.analysis.strength]}`} style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}>
                    {item.analysis.score}
                  </p>
                  <div className={`inline-block px-3 py-1 rounded-lg text-[10px] font-display font-bold uppercase tracking-wider ${strengthBgColors[item.analysis.strength]} text-primary-foreground mt-1`}>
                    {item.analysis.strength}
                  </div>
                </div>

                {/* Strength bar */}
                <div className="h-2 rounded-full bg-secondary/80 overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-full ${strengthBgColors[item.analysis.strength]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.analysis.score}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                {/* Stats */}
                <div className="space-y-2 text-xs font-body">
                  {[
                    { label: 'Crack Time', value: item.analysis.crackTime },
                    { label: 'Entropy', value: `${item.analysis.entropy} bits` },
                    { label: 'Charset', value: `${item.analysis.charsetSize} chars` },
                    { label: 'Length', value: `${item.analysis.length} chars` },
                  ].map(stat => (
                    <div key={stat.label} className="flex justify-between">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="text-foreground font-medium">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
