// src/screens/UAEMarketScreen.tsx
import { useMarketSummary } from '../hooks/useGoldRates';
import { PremiumGauge } from '../components/PremiumGauge';
import { Info, Gauge, Calendar, Zap, DollarSign, Tag } from 'lucide-react';

export function UAEMarketScreen() {
  const { data: summary, isLoading } = useMarketSummary();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Loading UAE Market Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Cinematic Market Hero */}
      <div className="relative h-64 md:h-72 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl group">
         <img 
            src="/assets/uae_market_hero.png" 
            alt="Dubai Market" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
         
         <div className="relative h-full flex flex-col justify-end p-10 space-y-2">
            <div className="flex items-center gap-2">
               <span className="w-10 h-[1px] bg-gold-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-400 italic">GCC Optimization</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-50 tracking-tighter italic">UAE <span className="text-gold-400">Market Insight</span></h1>
            <p className="text-slate-300 font-medium text-sm max-w-lg opacity-80">
               Real-time premium tracking for the Dubai Gold Souk and UAE-wide retail exchanges.
            </p>
         </div>
         
         {/* Live Indicator */}
         <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10">
            <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(223,175,55,1)]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-100 italic">Vault Priority Feed</span>
         </div>
      </div>

      {/* Analytics Card */}
      <div className="tonal-surface-low rounded-[40px] p-10 border border-white/5 relative overflow-hidden">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div>
              <div className="flex items-center gap-2 mb-6">
                 <div className="p-2 rounded-lg bg-gold-400/10 text-gold-400">
                    <Gauge size={20} />
                 </div>
                 <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Premium vs International Spot</h2>
              </div>
              
              {summary && <PremiumGauge value={summary.premium.current} />}
              
              <div className="mt-8 p-4 rounded-xl bg-gold-400/5 border border-gold-400/10">
                 <p className="text-sm text-gold-200/80 leading-relaxed italic">
                    "{summary?.premium.recommendation}"
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard 
                 icon={<Zap size={18} />} 
                 label="7-Day Average" 
                 value={`${summary?.premium.average7d}%`} 
                 subValue="Premium Trend" 
              />
              <StatCard 
                 icon={<Calendar size={18} />} 
                 label="30-Day Average" 
                 value={`${summary?.premium.average30d}%`} 
                 subValue="Monthly Mean" 
              />
              <StatCard 
                 icon={<DollarSign size={18} />} 
                 label="Spot Delta" 
                 value={`+${((summary?.premium.current ?? 0) * 2.5).toFixed(1)} AED`} 
                 subValue="Per Gram Offset" 
              />
              <StatCard 
                 icon={<Tag size={18} />} 
                 label="VAT Rate" 
                 value="5%" 
                 subValue="UAE Gold Tax" 
              />
           </div>
        </div>
      </div>

      {/* Best Time to Buy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 tonal-surface rounded-3xl p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Calendar size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-100">Best Time to Buy</h3>
                  <p className="text-sm text-slate-500">Optimized for cost-saving transactions</p>
               </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/50 border border-white-5 min-w-[160px]">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Optimal Day</span>
                  <span className="text-2xl font-black text-emerald-400 uppercase">{summary?.bestTime.bestDay}</span>
                  <span className="text-xs font-bold text-slate-400 mt-1">{summary?.bestTime.bestTime}</span>
               </div>
               <div className="flex-1">
                  <p className="text-slate-300 leading-relaxed text-sm italic py-2 md:py-0 border-l-2 border-emerald-500/20 pl-6">
                     {summary?.bestTime.reason}
                  </p>
               </div>
            </div>
         </div>

         <div className="tonal-surface rounded-3xl p-8 border border-white/5 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 mb-6">
                <Info size={32} />
             </div>
             <h3 className="text-lg font-bold text-slate-100 mb-3">Professional Insight</h3>
             <p className="text-sm text-slate-500 leading-relaxed">
                The UAE gold market typically has lower premiums during midweek trading hours.
             </p>
             <button className="mt-8 px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black text-gold-400 border border-white/5 transition-colors uppercase tracking-[0.2em]">
                View Full Guide
             </button>
         </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue }: { icon: any, label: string, value: string, subValue: string }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/30 border border-white/5">
       <div className="text-slate-500 mb-3">{icon}</div>
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
       <p className="text-2xl font-black text-slate-100 tabular-nums">{value}</p>
       <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">{subValue}</p>
    </div>
  );
}
