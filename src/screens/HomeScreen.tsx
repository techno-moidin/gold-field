// src/screens/HomeScreen.tsx
import { useLiveRates, useTodaySignal, useMarketSummary } from '../hooks/useGoldRates';
import { PriceCard } from '../components/PriceCard';
import { SignalBadge } from '../components/SignalBadge';
import { GoldPurity } from '../types/gold-field';
import { useStore } from '../store/useStore';
import { RefreshCcw, Bell, TrendingUp, Zap, ArrowUpRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function HomeScreen() {
  const { data: rates, isLoading, isRefetching, refetch } = useLiveRates();
  const { data: signal } = useTodaySignal();
  const { data: summary } = useMarketSummary();
  const { selectedPurity, setPurity } = useStore();

  const purities = [GoldPurity.GOLD_24K, GoldPurity.GOLD_22K, GoldPurity.GOLD_18K];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
           <div className="w-16 h-16 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center animate-pulse">
              <RefreshCcw className="text-gold-400 animate-spin" size={32} />
           </div>
           <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full shadow-[0_0_10px_rgba(223,175,55,1)]" />
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Synchronizing Global Rates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <div className="flex items-center gap-2 mb-3">
               <span className="w-8 h-[2px] bg-gold-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-400 italic">Market Overview</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tighter italic leading-none">
               The Gilded Vault
            </h2>
         </div>
         
         {/* Purity Switcher */}
         <div className="flex p-1.5 tonal-surface-low rounded-2xl border border-white/5 shadow-inner">
           {purities.map((p) => (
             <button
               key={p}
               onClick={() => setPurity(p)}
               className={cn(
                 "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                 selectedPurity === p 
                   ? "bg-gold-400 text-slate-900 shadow-[0_0_20px_rgba(223,175,55,0.3)]" 
                   : "text-slate-500 hover:text-slate-300"
               )}
             >
               {p}
             </button>
           ))}
         </div>
      </header>

      {/* Premium Hero Banner */}
      <div className="relative h-64 md:h-80 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl group">
         <img 
            src="/assets/gold_bullion_hero.png" 
            alt="Gold Bullion" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
         
         <div className="relative h-full flex flex-col justify-center px-12 space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
               <Zap size={16} className="text-gold-400 fill-gold-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-400">Live Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tighter italic leading-tight">
               Precision Trading <br /> 
               <span className="text-gold-400">Starts Here.</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
               Real-time arbitrage tracking across global markets with 98% signal accuracy. Secure your position in the vault.
            </p>
         </div>
         
         {/* Decorative status indicator */}
         <div className="absolute top-8 right-8 flex items-center gap-3 px-4 py-2 rounded-full glass border border-white/10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-200">Global Feed Active</span>
         </div>
      </div>

      {/* Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         
         {/* Featured Signal Card */}
         <div className="lg:col-span-1">
            <div className="tonal-surface rounded-3xl p-8 h-full border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Today's Signal</h3>
                  <RefreshCcw 
                    size={14} 
                    className={cn("text-slate-600 cursor-pointer hover:text-gold-400 transition-colors", isRefetching && "animate-spin")}
                    onClick={() => refetch()}
                  />
               </div>

               {signal && (
                 <div className="flex flex-col items-center">
                    <SignalBadge type={signal.signal} confidence={signal.confidence} size="lg" />
                    <div className="mt-8 space-y-4 w-full">
                       <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                          <p className="text-[11px] text-slate-400 leading-relaxed italic text-center">
                            "{signal.reasoning.substring(0, 110)}..."
                          </p>
                       </div>
                       <button className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-gold-400 text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                          Full Analysis <ArrowUpRight size={14} />
                       </button>
                    </div>
                 </div>
               )}
            </div>
         </div>

         {/* Price Matrix */}
         <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {rates?.map((rate) => (
                 <PriceCard key={`${rate.region}-${rate.purity}`} rate={rate} />
               ))}
            </div>
         </div>
      </div>

      {/* Secondary Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className="tonal-surface-low rounded-2xl p-6 border border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
               <TrendingUp size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">UAE Premium</p>
               <p className="text-xl font-black text-slate-100 tabular-nums">{summary?.premium.current}% <span className="text-[10px] text-emerald-500 font-bold ml-1">Optimal</span></p>
            </div>
         </div>

         <div className="tonal-surface-low rounded-2xl p-6 border border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center">
               <Zap size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Market Volatility</p>
               <p className="text-xl font-black text-slate-100 uppercase tracking-tight">Moderate</p>
            </div>
         </div>

         <div className="md:col-span-2 lg:col-span-1 tonal-surface-low rounded-2xl p-6 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-gold-400/5 transition-colors">
            <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Bell size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Telegram Alerts</p>
                  <p className="text-sm font-bold text-slate-200">2.4k Subscribers Active</p>
               </div>
            </div>
            <ArrowUpRight size={20} className="text-slate-600 group-hover:text-gold-400 transition-colors" />
         </div>
      </div>

    </div>
  );
}
