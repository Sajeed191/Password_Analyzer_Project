import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, Search, Fingerprint } from 'lucide-react';
import { checkBreach, type BreachCheckResult } from '@/lib/passwordAnalyzer';

const riskColors: Record<string, string> = {
  'Safe': 'text-neon-green border-neon-green/30 bg-neon-green/5',
  'Low Risk': 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5',
  'Medium Risk': 'text-neon-orange border-neon-orange/30 bg-neon-orange/5',
  'High Risk': 'text-destructive border-destructive/30 bg-destructive/5',
  'Critical': 'text-destructive border-destructive/30 bg-destructive/10',
};

const riskIcons: Record<string, typeof ShieldCheck> = {
  'Safe': ShieldCheck,
  'Low Risk': ShieldCheck,
  'Medium Risk': AlertTriangle,
  'High Risk': ShieldAlert,
  'Critical': ShieldAlert,
};

export default function BreachChecker() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<BreachCheckResult | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleCheck = () => {
    if (!password) return;
    setResult(checkBreach(password));
  };

  return (
    <div className="space-y-5">
      <div className="glass-card neon-border">
        <div className="section-heading"><span>Breach Detection</span></div>
        <p className="text-sm text-muted-foreground font-body mb-4">
          Check if your password has been found in known data breaches.
        </p>
        <div className="relative">
          <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => { setPassword(e.target.value); setResult(null); }}
            placeholder="Enter password to check..."
            className="input-cyber pl-10 pr-10"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs font-mono"
          >
            {showPassword ? 'HIDE' : 'SHOW'}
          </button>
        </div>
        <button
          onClick={handleCheck}
          disabled={!password}
          className="neon-btn w-full mt-4 text-sm py-2.5"
        >
          <Search className="w-4 h-4" />
          Check for Breaches
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card border-2 ${riskColors[result.riskLevel]}`}
        >
          <div className="flex items-start gap-3">
            {(() => {
              const Icon = riskIcons[result.riskLevel];
              return <Icon className="w-8 h-8 shrink-0 mt-0.5" style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />;
            })()}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold text-lg tracking-wider uppercase">{result.riskLevel}</span>
                {result.isBreached && (
                  <span className="px-2 py-0.5 rounded-md bg-destructive/20 text-destructive text-xs font-display tracking-wider uppercase">Breached</span>
                )}
              </div>
              <p className="text-sm font-body mt-1 opacity-80">{result.message}</p>
              {result.similarBreached > 0 && (
                <p className="text-xs font-mono mt-2 opacity-60">
                  {result.similarBreached} similar password{result.similarBreached > 1 ? 's' : ''} found in breach databases
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
