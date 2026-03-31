import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Shield, ArrowRight, Code, Users, Sparkles, Terminal, Cpu, Lock, Globe, Fingerprint, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const teamMembers = [
  { name: 'Niranjan Rajesh', initials: 'NR', role: 'Lead Developer' },
  { name: 'Joel T Samuel', initials: 'JS', role: 'Security Architect' },
  { name: 'Mohammed Sajeed M', initials: 'SM', role: 'UI/UX Engineer' },
];

const stats = [
  { label: 'Algorithms', value: '12+', icon: Cpu },
  { label: 'Threat Models', value: '50+', icon: Shield },
  { label: 'GPU Benchmarks', value: 'Real-time', icon: Fingerprint },
];

function useTypingEffect(texts: string[], speed = 60, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    if (!deleting && charIdx < current.length) {
      const t = setTimeout(() => { setDisplay(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, speed);
      return () => clearTimeout(t);
    }
    if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx > 0) {
      const t = setTimeout(() => { setDisplay(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, speed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx(i => (i + 1) % texts.length);
    }
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return display;
}

// Matrix rain effect
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|;:<>?αβγδεζηθ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'hsla(185, 100%, 50%, 0.15)';
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => { clearInterval(interval); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />;
}

// 3D tilt card
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();
  const typedText = useTypingEffect([
    'Password Analyzer',
    'Breach Detector',
    'Crypto Generator',
    'Security Suite',
  ]);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => navigate('/dashboard'), 1800);
  };

  return (
    <AnimatePresence mode="wait">
      {!isExiting ? (
        <motion.div
          key="portfolio"
          className="page-container relative overflow-hidden"
          style={{ background: 'var(--gradient-hero)' }}
          exit={{ opacity: 0 }}
        >
          <MatrixRain />
          <div className="absolute inset-0 cyber-grid opacity-30" />
          <div className="scanline" />

          {/* Animated geometric decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-[8%] right-[8%] w-40 h-40 border border-neon-cyan/10 rounded-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute top-[20%] right-[15%] w-20 h-20 border border-neon-purple/15 rounded-xl"
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute bottom-[12%] left-[5%] w-28 h-28 border border-neon-pink/10 rounded-3xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            />

            {/* Floating particles */}
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 1,
                  height: Math.random() * 4 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: i % 3 === 0 ? 'hsl(185 100% 50% / 0.5)' : i % 3 === 1 ? 'hsl(270 100% 65% / 0.4)' : 'hsl(330 100% 65% / 0.3)',
                }}
                animate={{ y: [0, -(Math.random() * 60 + 20), 0], opacity: [0.1, 0.8, 0.1], scale: [1, 1.8, 1] }}
                transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 3 }}
              />
            ))}

            {/* Large glow orbs */}
            <motion.div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-[120px]" style={{ background: 'hsl(185 100% 50% / 0.06)' }} animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 6, repeat: Infinity }} />
            <motion.div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px]" style={{ background: 'hsl(270 100% 65% / 0.05)' }} animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 7, repeat: Infinity, delay: 1.5 }} />
            <motion.div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" style={{ background: 'hsl(330 100% 65% / 0.04)' }} animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 8, repeat: Infinity, delay: 3 }} />
          </div>

          {/* Main content - full viewport centered */}
          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
            <motion.div
              className="flex flex-col items-center gap-6 sm:gap-8 max-w-4xl text-center w-full"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Animated Logo with glow ring */}
              <motion.div
                className="relative"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl blur-xl" style={{ background: 'var(--gradient-neon)', opacity: 0.3 }} />
                <TiltCard className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center neon-border glass-card p-0 animate-pulse-neon cursor-default">
                  <Shield className="w-12 h-12 sm:w-14 sm:h-14 text-primary" style={{ filter: 'drop-shadow(0 0 12px hsl(185 100% 50% / 0.6))' }} />
                </TiltCard>
              </motion.div>

              {/* Version badge */}
              <motion.div
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/20 bg-neon-cyan/5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                <Terminal className="w-3 h-3 text-neon-cyan/70" />
                <span className="text-[10px] sm:text-xs font-mono text-neon-cyan/70 tracking-widest uppercase">Security System v2.0 — Online</span>
                <Globe className="w-3 h-3 text-neon-cyan/70" />
              </motion.div>

              {/* Title with typing effect */}
              <div>
                <motion.h1
                  className="text-5xl sm:text-6xl md:text-8xl neon-text mb-4 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 1 }}
                >
                  CyberGuard
                </motion.h1>
                <motion.div
                  className="h-8 sm:h-10 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="text-lg sm:text-xl md:text-2xl font-body font-light tracking-wide text-foreground/50">
                    {typedText}
                    <span className="inline-block w-0.5 h-5 sm:h-6 bg-neon-cyan ml-1 animate-pulse" />
                  </span>
                </motion.div>
              </div>

              {/* Stats row */}
              <motion.div
                className="flex gap-6 sm:gap-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    <stat.icon className="w-5 h-5 text-neon-cyan/50 mx-auto mb-1" />
                    <p className="text-lg sm:text-xl font-display font-bold text-gradient">{stat.value}</p>
                    <p className="text-[10px] font-display text-foreground/30 tracking-wider uppercase">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Description card with 3D tilt */}
              <TiltCard className="w-full max-w-2xl">
                <motion.div
                  className="glass-card neon-border text-left"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-4 h-4 text-primary" />
                    <span className="text-xs font-display tracking-wider text-primary uppercase">System Overview</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                  </div>
                  <p className="text-foreground/70 text-sm sm:text-base leading-relaxed font-body">
                    CyberGuard is a professional-grade password security suite that analyzes password strength
                    using real-world GPU benchmark simulations, estimates crack times against modern attack vectors,
                    generates cryptographically secure passwords, detects data breach exposure,
                    and provides actionable security insights with interactive visual reporting.
                  </p>
                </motion.div>
              </TiltCard>

              {/* Team */}
              <motion.div
                className="w-full max-w-2xl"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.7 }}
              >
                <div className="flex items-center gap-2 justify-center mb-5">
                  <Users className="w-4 h-4 text-neon-purple" />
                  <span className="text-xs font-display font-semibold text-foreground/40 uppercase tracking-[0.2em]">Development Team</span>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {teamMembers.map((member, i) => (
                    <TiltCard key={member.name} className="cursor-default">
                      <motion.div
                        className="glass-card-hover text-center py-4 sm:py-5 px-2 sm:px-3"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 + i * 0.12, duration: 0.5 }}
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 relative" style={{ background: 'var(--gradient-neon)' }}>
                          <span className="font-display font-bold text-sm sm:text-base text-primary-foreground">{member.initials}</span>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-neon-green border-2 border-background" />
                        </div>
                        <p className="font-body font-semibold text-foreground/90 text-xs sm:text-sm leading-tight">{member.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground font-display tracking-wider uppercase mt-1">{member.role}</p>
                      </motion.div>
                    </TiltCard>
                  ))}
                </div>
                <motion.div className="mt-5 flex items-center justify-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                  <Sparkles className="w-3 h-3 text-neon-purple/50" />
                  <p className="text-[10px] sm:text-xs text-foreground/30 font-display tracking-wider uppercase">Dept. of Computer Science & Engineering</p>
                  <Sparkles className="w-3 h-3 text-neon-cyan/50" />
                </motion.div>
              </motion.div>

              {/* Enter Button */}
              <motion.button
                onClick={handleEnter}
                className="neon-btn text-base sm:text-lg px-10 sm:px-14 py-4 sm:py-5 mt-2 group relative overflow-hidden"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.6 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Initialize System
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>

              {/* Scroll hint */}
              <motion.div
                className="mt-4"
                animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="w-5 h-5 text-foreground/20" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        /* Exit transition - holographic wipe */
        <motion.div
          key="transition"
          className="page-container flex items-center justify-center relative overflow-hidden"
          style={{ background: 'var(--gradient-hero)' }}
        >
          {/* Scan lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-px"
              style={{ top: `${(i + 1) * 8.33}%`, background: 'var(--gradient-neon)' }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: 'easeInOut' }}
            />
          ))}
          {/* Hex grid expansion */}
          <motion.div
            className="absolute rounded-full"
            style={{ background: 'var(--gradient-neon)' }}
            initial={{ width: 0, height: 0, opacity: 0.9 }}
            animate={{ width: '400vmax', height: '400vmax', opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Glitch effect overlays */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'hsl(185 100% 50% / 0.1)' }}
            animate={{ opacity: [0, 0.3, 0, 0.2, 0] }}
            transition={{ duration: 0.3, repeat: 3 }}
          />
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3, rotate: 90 }}
            transition={{ duration: 0.8 }}
          >
            <Shield className="w-20 h-20 text-primary-foreground" />
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
              <span className="font-display text-sm text-primary-foreground/80 tracking-[0.3em] uppercase">Initializing</span>
              <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
