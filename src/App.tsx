import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeScreen } from './screens/HomeScreen';
import { SignalScreen } from './screens/SignalScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { UAEMarketScreen } from './screens/UAEMarketScreen';
import { MaintenanceScreen } from './screens/MaintenanceScreen';
import { useStore } from './store/useStore';
import { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { api } from './lib/api';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Global QueryClient
const rootQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Minimize retries to trigger maintenance mode faster
      staleTime: 30000,
    },
  },
});

type ScreenId = 'home' | 'signal' | 'alerts' | 'uae';

function AppContent() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const { isMaintenanceMode, setMaintenanceMode } = useStore();

  // Background health check when in maintenance mode
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isMaintenanceMode) {
      // Periodic check every 5 seconds
      interval = setInterval(async () => {
        try {
          await api.getLiveRates();
          // If successful, reset maintenance mode
          setMaintenanceMode(false);
        } catch (e) {
          // Still down
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMaintenanceMode, setMaintenanceMode]);

  if (isMaintenanceMode) {
    return <MaintenanceScreen />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <HomeScreen />;
      case 'signal': return <SignalScreen />;
      case 'alerts': return <AlertsScreen />;
      case 'uae': return <UAEMarketScreen />;
      default: return <HomeScreen />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Markets', icon: 'dashboard' },
    { id: 'alerts', label: 'Details', icon: 'analytics' },
    { id: 'signal', label: 'Signals', icon: 'query_stats' },
    { id: 'uae', label: 'UAE Vault', icon: 'account_balance' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-['Inter'] antialiased selection:bg-primary/30 selection:text-primary transition-colors duration-500">
      {/* TopNavBar */}
      <header className="bg-slate-950/80 backdrop-blur-xl tracking-tight top-0 sticky z-50 shadow-2xl shadow-black/40 flex justify-between items-center w-full px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-black italic tracking-tighter text-amber-400 uppercase">Gold Field</span>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="w-full relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full bg-slate-900 border-none rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:ring-1 focus:ring-amber-400/50 transition-all outline-none" 
              placeholder="Search markets..." 
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="text-slate-400 hover:text-amber-200 transition-colors duration-200 active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-slate-400 hover:text-amber-200 transition-colors duration-200 active:scale-95">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 p-0.5">
            <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <img 
                alt="User profile" 
                className="object-cover h-full w-full" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8tCByn9TgiCLz25uRPPPconVrTDUV-IyvKabJ6IGTK6nH2eguz9_2bMGvtD74GPzKc0PtElmpqyhTjrcZX7VMfppJc_3VLNcG5S7DBUbZJVIx5Tt10Ys2CAnt5-g8So_0YSNLAda3O9RSQeLIlLadkfQo_x91Qy7qfcYTQIjzgXqNZDi2t8dNt163T8zpS1huXMtQYAP6ij2RRafD2BiQTYcWUXadWWxuJVQTVphiWonZ_-D0jfyVp8vARfCq-Lc0dNS56as0JRBC"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* SideNavBar */}
        <aside className="bg-slate-950 h-screen w-64 hidden md:flex flex-col fixed left-0 top-0 pt-20 border-r border-slate-800/20 text-sm uppercase tracking-widest z-40">
          <div className="px-6 py-8 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            </div>
            <div>
              <h2 className="text-amber-500 font-bold tracking-normal leading-tight normal-case">Gold Field</h2>
              <p className="text-[10px] text-slate-500 tracking-wider">Premium Terminal</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id as ScreenId)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 outline-none",
                  activeScreen === item.id 
                    ? "text-amber-400 border-r-4 border-amber-500 bg-slate-900/50" 
                    : "text-slate-500 hover:text-slate-200 hover:bg-slate-900"
                )}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="px-4 py-6 mt-auto space-y-2">
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/10 mb-6">
              <p className="text-[10px] text-amber-400 font-bold mb-2 uppercase tracking-widest text-center">PRO ACCESS</p>
              <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all uppercase tracking-widest">
                Trade Now
              </button>
            </div>
            
            <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-200 transition-all outline-none">
              <span className="material-symbols-outlined text-sm">help</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Support</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-200 transition-all outline-none">
              <span className="material-symbols-outlined text-sm">settings</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-6 md:p-10 min-h-screen">
          {renderScreen()}
        </main>
      </div>

      {/* Bottom Nav - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-slate-950/90 backdrop-blur-lg rounded-t-xl border-t border-amber-900/20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id as ScreenId)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-300 px-3 py-1 scale-90",
              activeScreen === item.id ? "text-amber-400 bg-amber-400/10 rounded-xl" : "text-slate-500"
            )}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[8px] font-bold uppercase tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={rootQueryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}


