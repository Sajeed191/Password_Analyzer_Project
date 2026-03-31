import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, BarChart3, History, Settings, Shield, Zap, Heart } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'History', path: '/history', icon: History },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="page-container bg-background relative flex flex-col">
      {/* Subtle cyber grid */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-50" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border backdrop-blur-2xl" style={{ background: 'hsl(var(--glass-bg))' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_20px_-5px_hsl(var(--neon-cyan)/0.5)]" style={{ background: 'var(--gradient-neon)' }}>
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-sm tracking-wider text-foreground uppercase">CyberGuard</span>
            <Zap className="w-3 h-3 text-neon-cyan animate-glow-pulse" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body font-semibold tracking-wide transition-all duration-300 ${
                    active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'var(--gradient-neon)', boxShadow: 'var(--shadow-neon)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-secondary/50 transition-colors text-foreground"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" onClick={() => setMenuOpen(false)} />
            <motion.nav
              className="absolute top-16 right-3 left-3 glass-card neon-border p-2"
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              {navItems.map((item, i) => {
                const active = location.pathname === item.path;
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-semibold tracking-wide transition-all ${
                      active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                    style={active ? { background: 'var(--gradient-neon)', boxShadow: 'var(--shadow-neon)' } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </motion.button>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6 mt-auto" style={{ background: 'hsl(var(--glass-bg))' }}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-display text-xs tracking-wider text-muted-foreground uppercase">CyberGuard v2.0</span>
          </div>
          <p className="text-[10px] text-muted-foreground/60 font-body flex items-center gap-1">
            Built with <Heart className="w-2.5 h-2.5 text-neon-pink" /> by CSE Department
          </p>
          <p className="text-[10px] text-muted-foreground/40 font-mono">© {new Date().getFullYear()} All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
