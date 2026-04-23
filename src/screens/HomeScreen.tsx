// src/screens/HomeScreen.tsx
import { useLiveRates } from '../hooks/useGoldRates';
import { PriceCard } from '../components/PriceCard';
import { GoldPurity } from '../types/gold-field';
import { useStore } from '../store/useStore';
import { RefreshCcw, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function HomeScreen() {
  const { data: rates, isLoading, isError } = useLiveRates();
  const { selectedPurity, setPurity } = useStore();

  const purities = [GoldPurity.GOLD_24K, GoldPurity.GOLD_22K, GoldPurity.GOLD_18K];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-500">
        <div className="relative">
           <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center animate-pulse">
              <RefreshCcw className="text-amber-500 animate-spin" size={32} />
           </div>
           <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,1)]" />
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Synchronizing Global Rates...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400 font-bold uppercase tracking-widest text-xs">Failed to connect to the exchange.</p>
        <p className="text-slate-500 text-[10px]">Check that the backend is running and the tunnel is accessible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Hero Stats Row */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-2">Global Rates</h1>
            <p className="text-on-surface-variant font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              Live Market Data • Updates every 60s
            </p>
          </div>
          
          {/* Purity Filter */}
          <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl w-fit">
            {purities.map((p) => (
              <button
                key={p}
                onClick={() => setPurity(p)}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 outline-none",
                  selectedPurity === p 
                    ? "bg-primary text-on-primary shadow-lg" 
                    : "text-on-surface-variant hover:text-on-surface font-semibold"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid of Region Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rates && rates.length > 0 ? (
          rates.map((rate) => (
            <PriceCard key={`${rate.region}-${rate.purity}`} rate={rate} />
          ))
        ) : (
          <div className="col-span-full p-12 text-center bg-surface-container-low rounded-3xl border border-white/5">
            <p className="text-on-surface-variant font-bold italic">No rates found for selected purity.</p>
          </div>
        )}
      </div>

      {/* Secondary Content: Market News / Chart Insight */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* News Hero Card */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-8 border border-slate-800/20 relative overflow-hidden min-h-[300px] flex flex-col justify-center group cursor-pointer">
          <img 
            alt="Gold analysis" 
            className="absolute inset-0 object-cover opacity-20 w-full h-full transition-transform duration-1000 group-hover:scale-105" 
            src="/assets/market_insight.png" 
          />
          <div className="relative z-10">
            <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Market Insight</span>
            <h2 className="text-3xl font-bold mb-4 max-w-lg leading-tight text-on-surface">Fed interest rate decisions driving gold to new historical highs.</h2>
            <button className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest">
              Read analysis <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
            </button>
          </div>
        </div>

        {/* Recent Alerts List */}
        <div className="bg-surface-container-low rounded-2xl p-6 border border-slate-800/20">
          <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-6">Recent Alerts</h4>
          <div className="space-y-4">
            {[
              { title: "Price Spike: 24K UAE", time: "2 mins ago", active: true },
              { title: "Market Closing: India", time: "1 hour ago", active: false },
              { title: "New Signal: Sell 18K UK", time: "4 hours ago", active: false }
            ].map((alert, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer",
                  alert.active ? "bg-surface-container" : "opacity-70 grayscale hover:grayscale-0 hover:opacity-100 hover:bg-surface-container"
                )}
              >
                <div className={cn("w-2 h-2 rounded-full shrink-0", alert.active ? "bg-primary" : "bg-slate-600")} />
                <div>
                  <p className="text-xs font-bold text-on-surface">{alert.title}</p>
                  <p className="text-[10px] text-on-surface-variant">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pb-24 md:pb-10"></div>
    </div>
  );
}


