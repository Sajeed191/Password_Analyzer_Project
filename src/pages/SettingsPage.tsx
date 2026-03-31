import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sun, Moon, Cpu, Info, Shield, Code, Heart, ExternalLink, Github } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light' as const, label: 'Light Mode', icon: Sun, desc: 'Clean, bright interface', gradient: 'linear-gradient(135deg, hsl(40 100% 95%), hsl(200 80% 92%))' },
    { id: 'dark' as const, label: 'Dark Mode', icon: Moon, desc: 'Neon cyberpunk aesthetic', gradient: 'var(--gradient-neon)' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center animate-pulse-neon shrink-0" style={{ background: 'var(--gradient-neon)' }}>
          <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-wider text-foreground uppercase truncate">
              System <span className="text-gradient">Settings</span>
            </h1>
            <Cpu className="w-4 h-4 text-neon-cyan animate-glow-pulse shrink-0" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-body tracking-wide">Customize your experience</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Theme selection */}
        <div className="glass-card neon-border">
          <div className="section-heading"><span>Appearance</span></div>
          <div className="grid grid-cols-2 gap-3">
            {themes.map(t => (
              <motion.button
                key={t.id}
                onClick={() => setTheme(t.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  theme === t.id ? 'border-primary' : 'border-border hover:border-primary/30'
                }`}
                style={theme === t.id ? { boxShadow: 'var(--shadow-neon)' } : {}}
              >
                {theme === t.id && (
                  <motion.div className="absolute inset-0 opacity-10" style={{ background: t.gradient }} layoutId="themeActive" />
                )}
                <div className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all ${
                  theme === t.id ? '' : 'bg-secondary'
                }`} style={theme === t.id ? { background: 'var(--gradient-neon)', boxShadow: 'var(--shadow-neon)' } : {}}>
                  <t.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${theme === t.id ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <div className="relative z-10 text-center">
                  <p className="font-display font-semibold text-sm tracking-wider uppercase text-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">{t.desc}</p>
                </div>
                {theme === t.id && (
                  <motion.div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-green" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="glass-card">
          <div className="section-heading"><span>System Info</span></div>
          <div className="space-y-3 text-sm font-body">
            {[
              { label: 'Version', value: '2.0.0', icon: Code },
              { label: 'Engine', value: 'Real-time GPU benchmark simulation', icon: Cpu },
              { label: 'Platform', value: 'CyberGuard Security Suite', icon: Shield },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-secondary/30 transition-colors">
                <item.icon className="w-4 h-4 text-neon-cyan mt-0.5 shrink-0" />
                <div>
                  <span className="text-muted-foreground">{item.label}: </span>
                  <span className="text-foreground font-medium">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credits */}
        <div className="glass-card neon-border">
          <div className="section-heading"><span>Credits</span></div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { name: 'Niranjan Rajesh', role: 'Lead Developer', initials: 'NR' },
              { name: 'Joel T Samuel', role: 'Security Architect', initials: 'JS' },
              { name: 'Mohammed Sajeed M', role: 'UI/UX Engineer', initials: 'SM' },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                className="text-center p-3 rounded-xl bg-secondary/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: 'var(--gradient-neon)' }}>
                  <span className="font-display font-bold text-xs text-primary-foreground">{member.initials}</span>
                </div>
                <p className="font-body font-semibold text-foreground text-xs">{member.name}</p>
                <p className="text-[10px] text-muted-foreground font-display tracking-wider uppercase mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground font-body flex items-center justify-center gap-1.5">
              Built with <Heart className="w-3 h-3 text-neon-pink" /> by Dept. of Computer Science & Engineering
            </p>
          </div>
        </div>

        {/* Keyboard shortcuts */}
        <div className="glass-card">
          <div className="section-heading"><span>Quick Tips</span></div>
          <div className="space-y-2 text-sm font-body">
            {[
              'Press Enter in the analyzer to quickly analyze a password',
              'Use the Compare tab to see which of two passwords is stronger',
              'Export your analysis data as CSV from the Reports page',
              'Toggle between light and dark mode for different aesthetics',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-foreground/70">
                <span className="text-neon-cyan mt-0.5 shrink-0">▸</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
