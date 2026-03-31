import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Trash2, Clock, Shield, Zap, Search, Cpu, Filter, SortDesc, SortAsc, Calendar } from 'lucide-react';
import { getHistory, clearHistory, type HistoryEntry } from '@/lib/historyStore';

const strengthColor = (s: string) => ({
  'Very Weak': 'text-destructive', 'Weak': 'text-neon-orange',
  'Fair': 'text-yellow-500', 'Strong': 'text-neon-cyan', 'Very Strong': 'text-neon-green',
}[s] || 'text-muted-foreground');

const strengthBg = (s: string) => ({
  'Very Weak': 'bg-destructive/15', 'Weak': 'bg-neon-orange/15',
  'Fair': 'bg-yellow-500/15', 'Strong': 'bg-neon-cyan/15', 'Very Strong': 'bg-neon-green/15',
}[s] || 'bg-secondary');

const filters = ['All', 'analyzed', 'generated'] as const;
const strengths = ['All', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'] as const;

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>(getHistory);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [strengthFilter, setStrengthFilter] = useState<string>('All');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let result = entries.filter(e =>
      (e.maskedPassword.toLowerCase().includes(search.toLowerCase()) ||
      e.strength.toLowerCase().includes(search.toLowerCase())) &&
      (typeFilter === 'All' || e.type === typeFilter) &&
      (strengthFilter === 'All' || e.strength === strengthFilter)
    );
    if (sortAsc) result = [...result].reverse();
    return result;
  }, [entries, search, typeFilter, strengthFilter, sortAsc]);

  const handleClear = () => { clearHistory(); setEntries([]); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center animate-pulse-neon shrink-0" style={{ background: 'var(--gradient-neon)' }}>
            <HistoryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-wider text-foreground uppercase truncate">
                Analysis <span className="text-gradient">History</span>
              </h1>
              <Cpu className="w-4 h-4 text-neon-green animate-glow-pulse shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-body tracking-wide">{entries.length} entries recorded</p>
          </div>
        </div>
        {entries.length > 0 && (
          <button onClick={handleClear} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-display font-semibold uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all">
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Clear All
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="glass-card neon-border text-center py-16">
          <HistoryIcon className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground font-body text-lg">No history yet</p>
          <p className="text-muted-foreground/60 font-body text-sm mt-1">Start analyzing passwords to build your history</p>
        </div>
      ) : (
        <>
          {/* Search + filters */}
          <div className="space-y-3 mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search history..." className="input-cyber pl-10" />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />

              {/* Type filter chips */}
              <div className="flex gap-1">
                {filters.map(f => (
                  <button key={f} onClick={() => setTypeFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-display font-semibold tracking-wider uppercase transition-all ${
                      typeFilter === f ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary/50 text-muted-foreground border border-transparent hover:border-border'
                    }`}
                  >{f === 'All' ? 'All Types' : f}</button>
                ))}
              </div>

              <div className="w-px h-5 bg-border hidden sm:block" />

              {/* Strength filter */}
              <div className="flex gap-1 overflow-x-auto scrollbar-none">
                {strengths.map(s => (
                  <button key={s} onClick={() => setStrengthFilter(s)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-display font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                      strengthFilter === s ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary/50 text-muted-foreground border border-transparent hover:border-border'
                    }`}
                  >{s}</button>
                ))}
              </div>

              <button onClick={() => setSortAsc(!sortAsc)} className="ml-auto p-1.5 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground" title={sortAsc ? 'Oldest first' : 'Newest first'}>
                {sortAsc ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Results count */}
          <p className="text-[10px] font-mono text-muted-foreground mb-3 tracking-wider">
            Showing {filtered.length} of {entries.length} entries
          </p>

          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  className="glass-card-hover flex items-center gap-3 sm:gap-4 py-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: Math.min(i * 0.02, 0.4), duration: 0.3 }}
                  layout
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${entry.type === 'generated' ? 'bg-neon-purple/20' : 'bg-primary/20'}`}>
                    {entry.type === 'generated'
                      ? <Zap className="w-4 h-4 text-neon-purple" style={{ filter: 'drop-shadow(0 0 4px hsl(270 100% 65%/0.5))' }} />
                      : <Shield className="w-4 h-4 text-primary" style={{ filter: 'drop-shadow(0 0 4px hsl(185 100% 50%/0.5))' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm text-foreground truncate">{entry.maskedPassword}</p>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                      <span className={`text-xs font-display font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md ${strengthBg(entry.strength)} ${strengthColor(entry.strength)}`}>
                        {entry.strength}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">Score: {entry.score}</span>
                      <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">Entropy: {entry.entropy}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground font-body">{entry.crackTime}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 mt-1 font-mono justify-end">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-10">
                <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground font-body text-sm">No matching entries found</p>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
