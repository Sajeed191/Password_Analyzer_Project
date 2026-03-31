import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, Wand2, ShieldAlert, BookOpen, GitCompare, Activity } from 'lucide-react';
import PasswordAnalyzerWidget from '@/components/PasswordAnalyzerWidget';
import PasswordGenerator from '@/components/PasswordGenerator';
import BreachChecker from '@/components/BreachChecker';
import SecurityTips from '@/components/SecurityTips';
import PasswordCompare from '@/components/PasswordCompare';

const tabs = [
  { id: 'analyze', label: 'Analyzer', icon: Shield },
  { id: 'generate', label: 'Generator', icon: Wand2 },
  { id: 'breach', label: 'Breach Check', icon: ShieldAlert },
  { id: 'compare', label: 'Compare', icon: GitCompare },
  { id: 'tips', label: 'Tips', icon: BookOpen },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('analyze');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center animate-pulse-neon shrink-0" style={{ background: 'var(--gradient-neon)' }}>
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-wider text-foreground uppercase truncate">
              Security <span className="text-gradient">Suite</span>
            </h1>
            <Cpu className="w-4 h-4 text-neon-cyan animate-glow-pulse shrink-0" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-body tracking-wide">Comprehensive password security toolkit</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20 shrink-0">
          <Activity className="w-3 h-3 text-neon-green animate-pulse" />
          <span className="text-[10px] font-mono text-neon-green tracking-wider uppercase hidden sm:inline">System Active</span>
        </div>
      </div>

      {/* Tool Tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-none -mx-4 px-4">
        <div className="flex gap-1.5 min-w-max">
          {tabs.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-display font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                  active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="dashTab"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'var(--gradient-neon)', boxShadow: 'var(--shadow-neon)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline sm:inline">{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-2xl">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {activeTab === 'analyze' && <PasswordAnalyzerWidget />}
          {activeTab === 'generate' && <PasswordGenerator />}
          {activeTab === 'breach' && <BreachChecker />}
          {activeTab === 'compare' && <PasswordCompare />}
          {activeTab === 'tips' && <SecurityTips />}
        </motion.div>
      </div>
    </motion.div>
  );
}
