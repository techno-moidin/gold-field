// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomeScreen } from './screens/HomeScreen';
import { SignalScreen } from './screens/SignalScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { UAEMarketScreen } from './screens/UAEMarketScreen';
import { useState } from 'react';
import { Home, LineChart, Bell, PieChart, Settings, Search, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchInterval: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

type ScreenId = 'home' | 'signal' | 'alerts' | 'uae';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');

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
    { id: 'home', label: 'Rates', icon: Home },
    { id: 'signal', label: 'Analysis', icon: LineChart },
    { id: 'uae', label: 'UAE Market', icon: PieChart },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background flex flex-col md:flex-row">
        
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex flex-col w-24 h-screen fixed left-0 top-0 tonal-surface border-r border-white/5 z-50 py-8 items-center justify-between">
           <div className="flex flex-col items-center gap-12 w-full">
              {/* Logo */}
              <div className="w-12 h-12 rounded-2xl bg-gold-400 shadow-[0_0_20px_rgba(223,175,55,0.4)] flex items-center justify-center font-black text-slate-900 text-xl italic">
                G
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col gap-8 w-full items-center">
                 {navItems.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => setActiveScreen(item.id as ScreenId)}
                     className={cn(
                       "relative p-3 rounded-2xl transition-all duration-300 group",
                       activeScreen === item.id ? "text-gold-400 bg-gold-400/10" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                     )}
                   >
                     <item.icon size={24} strokeWidth={activeScreen === item.id ? 2.5 : 2} />
                     {activeScreen === item.id && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold-400 rounded-l-full shadow-[0_0_10px_rgba(223,175,55,0.5)]" />
                     )}
                     
                     {/* Tooltip */}
                     <span className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-slate-800 text-[10px] font-black uppercase text-gold-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/5 shadow-2xl">
                        {item.label}
                     </span>
                   </button>
                 ))}
              </nav>
           </div>

           <div className="flex flex-col gap-6 items-center">
              <button className="text-slate-500 hover:text-slate-300 transition-colors"><Settings size={20} /></button>
              <div className="w-10 h-10 rounded-full border border-white/10 p-0.5 bg-slate-800">
                 <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                    <User size={18} />
                 </div>
              </div>
           </div>
        </aside>

        {/* Header - Mobile */}
        <header className="md:hidden flex justify-between items-center p-6 border-b border-white/5 tonal-surface-low z-40 sticky top-0 backdrop-blur-md">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gold-400 flex items-center justify-center font-black text-slate-900 text-sm">G</div>
              <h1 className="text-lg font-black text-slate-100 tracking-tight italic">Gold Field</h1>
           </div>
           <div className="flex gap-4">
              <button className="text-slate-500- p-1"><Search size={20} /></button>
              <button className="text-slate-500 p-1"><User size={20} /></button>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-24 pb-32 md:pb-12 min-h-screen overflow-x-hidden">
           <div className="max-w-7xl mx-auto px-6 pt-10 md:pt-12">
              {renderScreen()}
           </div>
        </main>

        {/* Bottom Nav - Mobile */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50">
           <div className="glass rounded-3xl h-20 px-4 flex items-center justify-around border border-white/10 shadow-2xl">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id as ScreenId)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 transition-all duration-300 relative",
                    activeScreen === item.id ? "text-gold-400 -translate-y-1" : "text-slate-500"
                  )}
                >
                  <item.icon size={22} strokeWidth={activeScreen === item.id ? 2.5 : 2} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                  {activeScreen === item.id && (
                    <div className="absolute -bottom-3 w-1.5 h-1.5 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(223,175,55,1)]" />
                  )}
                </button>
              ))}
           </div>
        </nav>

      </div>
    </QueryClientProvider>
  );
}
