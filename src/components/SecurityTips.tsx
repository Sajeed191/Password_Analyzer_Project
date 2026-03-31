import { motion } from 'framer-motion';
import { Shield, Key, Lock, User, RefreshCw, AlertTriangle, Type, AlertCircle } from 'lucide-react';
import { SECURITY_TIPS } from '@/lib/passwordAnalyzer';

const iconMap: Record<string, typeof Shield> = {
  shield: Shield, key: Key, lock: Lock, user: User,
  refresh: RefreshCw, alert: AlertCircle, text: Type, warning: AlertTriangle,
};

export default function SecurityTips() {
  return (
    <div className="space-y-5">
      <div className="glass-card neon-border">
        <div className="section-heading"><span>Security Best Practices</span></div>
        <p className="text-sm text-muted-foreground font-body mb-1">
          Follow these expert recommendations to protect your digital identity.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SECURITY_TIPS.map((tip, i) => {
          const Icon = iconMap[tip.icon] || Shield;
          return (
            <motion.div
              key={tip.title}
              className="glass-card-hover"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--gradient-neon)' }}>
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xs tracking-wider uppercase text-foreground font-bold mb-1">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
