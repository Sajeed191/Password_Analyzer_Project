import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Cpu, Download, TrendingUp, ShieldCheck, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { getHistory } from '@/lib/historyStore';

const COLORS = ['hsl(0,85%,55%)', 'hsl(25,100%,55%)', 'hsl(50,100%,50%)', 'hsl(185,100%,50%)', 'hsl(150,100%,50%)'];

const gradeInfo: Record<string, { label: string; color: string; icon: typeof Award }> = {
  'A+': { label: 'Excellent', color: 'text-neon-green', icon: Award },
  'A': { label: 'Very Good', color: 'text-neon-green', icon: ShieldCheck },
  'B': { label: 'Good', color: 'text-neon-cyan', icon: ShieldCheck },
  'C': { label: 'Fair', color: 'text-yellow-500', icon: TrendingUp },
  'D': { label: 'Poor', color: 'text-neon-orange', icon: TrendingUp },
  'F': { label: 'Critical', color: 'text-destructive', icon: TrendingUp },
};

function getGrade(avg: number) {
  if (avg >= 90) return 'A+';
  if (avg >= 75) return 'A';
  if (avg >= 60) return 'B';
  if (avg >= 45) return 'C';
  if (avg >= 25) return 'D';
  return 'F';
}

export default function ReportsPage() {
  const history = getHistory();

  const strengthDist = useMemo(() => {
    const counts: Record<string, number> = { 'Very Weak': 0, 'Weak': 0, 'Fair': 0, 'Strong': 0, 'Very Strong': 0 };
    history.forEach(h => { counts[h.strength] = (counts[h.strength] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [history]);

  const scoreOverTime = useMemo(() =>
    history.slice(0, 20).reverse().map((h, i) => ({ entry: i + 1, score: h.score, entropy: h.entropy })),
  [history]);

  const typeDist = useMemo(() => [
    { name: 'Analyzed', value: history.filter(h => h.type === 'analyzed').length },
    { name: 'Generated', value: history.filter(h => h.type === 'generated').length },
  ], [history]);

  // Radar chart data
  const radarData = useMemo(() => {
    if (!history.length) return [];
    const latest = history.slice(0, 10);
    const avgScore = latest.reduce((a, b) => a + b.score, 0) / latest.length;
    const avgEntropy = latest.reduce((a, b) => a + b.entropy, 0) / latest.length;
    const avgLen = latest.reduce((a, b) => a + b.maskedPassword.length, 0) / latest.length;
    const strongPct = (latest.filter(h => h.score >= 60).length / latest.length) * 100;
    const diversity = new Set(latest.map(h => h.strength)).size * 20;
    return [
      { metric: 'Score', value: avgScore },
      { metric: 'Entropy', value: Math.min(100, avgEntropy * 1.5) },
      { metric: 'Length', value: Math.min(100, avgLen * 5) },
      { metric: 'Strong %', value: strongPct },
      { metric: 'Diversity', value: diversity },
    ];
  }, [history]);

  const avgScore = history.length ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length) : 0;
  const grade = getGrade(avgScore);
  const GradeInfo = gradeInfo[grade] || gradeInfo['F'];

  // Export summary as CSV
  const handleExport = () => {
    const header = 'Password (masked),Strength,Score,Entropy,Crack Time,Type,Date\n';
    const rows = history.map(h =>
      `"${h.maskedPassword}","${h.strength}",${h.score},${h.entropy},"${h.crackTime}","${h.type}","${new Date(h.timestamp).toLocaleString()}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'cyberguard-report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center animate-pulse-neon shrink-0" style={{ background: 'var(--gradient-neon)' }}>
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-wider text-foreground uppercase truncate">
                Security <span className="text-gradient">Reports</span>
              </h1>
              <Cpu className="w-4 h-4 text-neon-purple animate-glow-pulse shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-body tracking-wide">Visual analytics from password analyses</p>
          </div>
        </div>
        {history.length > 0 && (
          <button onClick={handleExport} className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-display font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Export CSV
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card neon-border text-center py-16">
          <BarChart3 className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground font-body text-lg">No data yet</p>
          <p className="text-muted-foreground/60 font-body text-sm mt-1">Analyze some passwords to generate reports</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Security Grade + Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Grade badge */}
            <motion.div
              className="stat-card col-span-2 md:col-span-1 flex flex-col items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <p className={`text-4xl font-display font-bold ${GradeInfo.color}`} style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}>{grade}</p>
              <p className="text-[10px] font-display text-muted-foreground mt-1 tracking-wider uppercase">{GradeInfo.label}</p>
            </motion.div>

            {[
              { label: 'Total Analyses', value: history.length },
              { label: 'Avg Score', value: avgScore },
              { label: 'Generated', value: history.filter(h => h.type === 'generated').length },
              { label: 'Strong+', value: history.filter(h => h.score >= 60).length },
            ].map((s, i) => (
              <motion.div key={s.label} className="stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                <p className="text-2xl font-display font-bold text-gradient">{s.value}</p>
                <p className="text-[10px] font-display text-muted-foreground mt-1 tracking-wider uppercase">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card">
              <div className="section-heading"><span>Strength Distribution</span></div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={strengthDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, color: 'hsl(var(--foreground))' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {strengthDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar chart */}
            <div className="glass-card">
              <div className="section-heading"><span>Security Radar</span></div>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <PolarRadiusAxis tick={false} domain={[0, 100]} axisLine={false} />
                  <Radar dataKey="value" stroke="hsl(185,100%,50%)" fill="hsl(185,100%,50%)" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card">
              <div className="section-heading"><span>Analysis Type</span></div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={typeDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" strokeWidth={0} label={({ name, value }) => `${name}: ${value}`}>
                    <Cell fill="hsl(185,100%,50%)" />
                    <Cell fill="hsl(270,100%,65%)" />
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, color: 'hsl(var(--foreground))' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {scoreOverTime.length > 1 && (
              <div className="glass-card">
                <div className="section-heading"><span>Score Trend (Last 20)</span></div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={scoreOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="entry" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, color: 'hsl(var(--foreground))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="hsl(185,100%,50%)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(185,100%,50%)' }} />
                    <Line type="monotone" dataKey="entropy" stroke="hsl(270,100%,65%)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(270,100%,65%)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
