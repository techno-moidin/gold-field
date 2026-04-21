// src/screens/SignalScreen.tsx
import { useTodaySignal } from '../hooks/useGoldRates';
import { SignalBadge } from '../components/SignalBadge';
import { PriceChart } from '../components/PriceChart';
import { AlertCircle, TrendingUp, TrendingDown, Activity, Calendar, ShieldCheck, History } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SignalScreen() {
  const { data: signal, isLoading } = useTodaySignal();

  // Mock data for the chart - in a real app this would come from useSignalHistory or similar
  const chartData = [
    { time: '09:00', price: 2450 }, { time: '10:00', price: 2465 }, { time: '11:00', price: 2458 },
    { time: '12:00', price: 2470 }, { time: '13:00', price: 2485 }, { time: '14:00', price: 2480 },
    { time: '15:00', price: 2495 }, { time: '16:00', price: 2510 },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
           <Activity className="text-gold-400 animate-pulse" size={48} />
           <div className="absolute inset-0 bg-gold-400/20 blur-xl animate-pulse" />
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Analyzing Alpha Trends...</p>
      </div>
    );
  }

  if (!signal) return <div className="p-10 text-center text-red-400">Intelligence stream unavailable</div>;

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
      
      {/* Intelligence Hero Banner */}
      <div className="relative h-64 md:h-80 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl group">
         <img 
            src="/assets/intelligence_hero.png" 
            alt="Market Intelligence" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
         
         <div className="relative h-full flex flex-col justify-end p-10 space-y-3">
            <div className="flex items-center gap-2">
               <Activity size={16} className="text-gold-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-400 italic">Alpha Chain v4.0</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tighter italic">Market <span className="text-gold-400">Intelligence</span></h1>
            <p className="text-slate-300 font-medium text-sm max-w-xl opacity-80">
               Advanced pattern recognition and liquidity analysis for global gold commodities.
            </p>
         </div>
         
         <div className="absolute top-8 right-8 flex items-center gap-3 px-4 py-2 rounded-full glass border border-white/10">
            <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(223,175,55,1)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-100">Live Node Connected</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Primary Signal View */}
         <div className="lg:col-span-2 space-y-8">
            <div className="tonal-surface-low rounded-[32px] p-10 border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               
               <div className="flex justify-between items-start mb-12">
                  <div>
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Alpha Verdict</h3>
                     <p className="text-xs font-bold text-slate-100 flex items-center gap-2">
                        <Calendar size={14} className="text-gold-400" /> {signal.date}
                     </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-white/5">
                     <ShieldCheck size={14} className="text-emerald-500" />
                     <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Verified Logic</span>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row items-center gap-12">
                  <SignalBadge type={signal.signal} confidence={signal.confidence} size="lg" />
                  
                  <div className="flex-1 space-y-8 w-full">
                     <div className="grid grid-cols-2 gap-4">
                        <MetricItem 
                           label="7D Momentum" 
                           value={`${signal.metrics.trend7d}%`} 
                           isPositive={signal.metrics.trend7d >= 0} 
                        />
                        <MetricItem 
                           label="30D Momentum" 
                           value={`${signal.metrics.trend30d}%`} 
                           isPositive={signal.metrics.trend30d >= 0} 
                        />
                     </div>
                     <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 relative">
                        <div className="absolute -top-3 left-6 px-3 py-1 rounded-lg bg-slate-800 text-[9px] font-black text-gold-400 uppercase tracking-widest border border-white/5">
                           Core Reasoning
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed italic italic">
                           "{signal.reasoning}"
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Price Movement Context */}
            <div className="tonal-surface rounded-[24px] p-8 border border-white/5">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                     <Activity size={16} className="text-gold-400" /> Signal Context (24H)
                  </h3>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Global Spot Pricing</div>
               </div>
               <PriceChart data={chartData} height={200} color="#dfaf37" />
            </div>
         </div>

         {/* Side Analysis Column */}
         <div className="space-y-8">
            {/* Risk Control */}
            <div className="tonal-surface rounded-[24px] p-8 border border-white/5 border-l-4 border-l-red-500/40">
               <div className="flex items-center gap-2 mb-4">
                  <AlertCircle size={18} className="text-red-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-100">Risk Profile</h3>
               </div>
               <p className="text-xs text-slate-400 leading-loose">
                  {signal.disclaimer}
               </p>
            </div>

            {/* Signal History Timeline */}
            <div className="tonal-surface rounded-[24px] p-8 border border-white/5">
               <div className="flex items-center gap-2 mb-8">
                  <History size={18} className="text-gold-400" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-100">Historical Chain</h3>
               </div>
               
               <div className="space-y-6 relative ml-2">
                  <div className="absolute left-1 top-2 bottom-2 w-[1px] bg-white/5" />
                  
                  <HistoryItem date="Apr 20" signal="BUY" confidence="HIGH" />
                  <HistoryItem date="Apr 19" signal="WAIT" confidence="MEDIUM" />
                  <HistoryItem date="Apr 18" signal="WAIT" confidence="LOW" />
                  <HistoryItem date="Apr 17" signal="AVOID" confidence="HIGH" />
               </div>
            </div>

            {/* Affiliate CTA */}
            <div className="tonal-surface-low rounded-[24px] p-8 border border-gold-400/10 bg-gold-400/5 group cursor-pointer overflow-hidden relative">
               <div className="relative z-10">
                  <h3 className="text-sm font-black text-slate-100 mb-2">Institutional Entry</h3>
                  <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">Execute trades with our premium liquidity partners.</p>
                  <button className="text-[10px] font-black uppercase text-gold-400 tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                     View Partners <TrendingUp size={14} />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function MetricItem({ label, value, isPositive }: { label: string, value: string, isPositive: boolean }) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/30 border border-white/5">
       <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 block mb-1">{label}</span>
       <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-slate-100 tabular-nums">{value}</span>
          {isPositive ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-500" />}
       </div>
    </div>
  );
}

function HistoryItem({ date, signal, confidence }: { date: string, signal: string, confidence: string }) {
  const color = signal === 'BUY' ? 'bg-emerald-500' : signal === 'AVOID' ? 'bg-red-500' : 'bg-gold-400';
  
  return (
    <div className="relative pl-8 flex items-center justify-between group">
       <div className={cn("absolute left-0 w-2 h-2 rounded-full ring-4 ring-slate-900 z-10 transition-transform group-hover:scale-125", color)} />
       <div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{date}</p>
          <p className="text-[11px] font-bold text-slate-300">{signal} Signal</p>
       </div>
       <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest border border-white/5 px-2 py-0.5 rounded">
          {confidence}
       </div>
    </div>
  );
}
