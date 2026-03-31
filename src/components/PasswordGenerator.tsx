import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, CheckCircle2, Sliders, Hash, Type, AtSign } from 'lucide-react';
import { generatePassword, generatePassphrase, analyzePassword } from '@/lib/passwordAnalyzer';
import { addToHistory } from '@/lib/historyStore';

type Mode = 'password' | 'passphrase';

export default function PasswordGenerator() {
  const [mode, setMode] = useState<Mode>('password');
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [strength, setStrength] = useState('');

  // Password options
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);

  // Passphrase options
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(true);

  const handleGenerate = useCallback(() => {
    let pw: string;
    if (mode === 'password') {
      pw = generatePassword(length, { uppercase, lowercase, numbers, symbols });
    } else {
      pw = generatePassphrase(wordCount, separator, capitalize);
    }
    setGenerated(pw);
    const analysis = analyzePassword(pw);
    setScore(analysis.score);
    setStrength(analysis.strength);
    addToHistory({ password: pw, score: analysis.score, strength: analysis.strength, crackTime: analysis.crackTime, entropy: analysis.entropy, type: 'generated' });
  }, [mode, length, uppercase, lowercase, numbers, symbols, wordCount, separator, capitalize]);

  const handleCopy = async () => {
    if (!generated) return;
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strengthColor = (s: string) => ({
    'Very Weak': 'text-destructive', 'Weak': 'text-neon-orange', 'Fair': 'text-yellow-500', 'Strong': 'text-neon-cyan', 'Very Strong': 'text-neon-green',
  }[s] || 'text-muted-foreground');

  return (
    <div className="space-y-5">
      {/* Mode Toggle */}
      <div className="glass-card neon-border">
        <div className="section-heading"><span>Generator Mode</span></div>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: 'password' as Mode, label: 'Password', icon: Hash, desc: 'Random characters' },
            { id: 'passphrase' as Mode, label: 'Passphrase', icon: Type, desc: 'Memorable words' },
          ]).map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                mode === m.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
              }`}
              style={mode === m.id ? { boxShadow: 'var(--shadow-neon)' } : {}}
            >
              <m.icon className={`w-5 h-5 shrink-0 ${mode === m.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-display text-xs tracking-wider uppercase text-foreground">{m.label}</p>
                <p className="text-[10px] text-muted-foreground font-body">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="glass-card">
        <div className="section-heading"><span>Options</span></div>
        {mode === 'password' ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-body mb-2">
                <span className="text-muted-foreground">Length</span>
                <span className="font-mono text-primary font-bold">{length}</span>
              </div>
              <input
                type="range"
                min={6}
                max={64}
                value={length}
                onChange={e => setLength(Number(e.target.value))}
                className="w-full accent-primary h-2 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                <span>6</span><span>64</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { label: 'Uppercase (A-Z)', checked: uppercase, set: setUppercase },
                { label: 'Lowercase (a-z)', checked: lowercase, set: setLowercase },
                { label: 'Numbers (0-9)', checked: numbers, set: setNumbers },
                { label: 'Symbols (!@#)', checked: symbols, set: setSymbols },
              ]).map(opt => (
                <label key={opt.label} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={opt.checked}
                    onChange={e => opt.set(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span className="text-sm font-body text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-body mb-2">
                <span className="text-muted-foreground">Word Count</span>
                <span className="font-mono text-primary font-bold">{wordCount}</span>
              </div>
              <input
                type="range"
                min={3}
                max={8}
                value={wordCount}
                onChange={e => setWordCount(Number(e.target.value))}
                className="w-full accent-primary h-2 rounded-full cursor-pointer"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground font-body mb-1 block">Separator</label>
                <div className="flex gap-1">
                  {['-', '.', '_', ' '].map(s => (
                    <button
                      key={s}
                      onClick={() => setSeparator(s)}
                      className={`flex-1 py-2 rounded-lg text-center font-mono text-sm border transition-all ${
                        separator === s ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      {s === ' ' ? '␣' : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <input type="checkbox" checked={capitalize} onChange={e => setCapitalize(e.target.checked)} className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm font-body text-foreground">Capitalize Words</span>
            </label>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button onClick={handleGenerate} className="neon-btn w-full text-sm py-3">
        <RefreshCw className="w-4 h-4" />
        Generate {mode === 'password' ? 'Password' : 'Passphrase'}
      </button>

      {/* Output */}
      {generated && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card neon-border"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="section-heading mb-0"><span>Generated</span></div>
            {score !== null && (
              <span className={`font-display text-xs tracking-wider font-bold ${strengthColor(strength)}`}>
                {strength} ({score}/100)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-secondary/80 rounded-xl px-4 py-3 font-mono text-sm text-foreground break-all select-all">
              {generated}
            </code>
            <button onClick={handleCopy} className="neon-btn-outline px-3 py-3 shrink-0">
              {copied ? <CheckCircle2 className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
