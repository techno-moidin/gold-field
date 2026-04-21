// src/components/PriceCard.tsx
import type { LiveRateResponse } from '../types/gold-field';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PriceCardProps {
  rate: LiveRateResponse;
  onClick?: () => void;
}

export function PriceCard({ rate, onClick }: PriceCardProps) {
  const isPositive = (rate.changePercent24h ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div 
        onClick={onClick}
        className={cn(
          "relative h-full p-6 rounded-[12px] transition-all duration-300 cursor-pointer group",
          "tonal-surface-low border border-white/5 hover:border-gold-400/20 hover:tonal-surface",
          "flex flex-col justify-between"
        )}
      >
        {/* Region & Change Badge */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-xl shadow-inner">
               {getRegionIcon(rate.region)}
             </div>
             <div>
               <h3 className="text-sm font-bold text-slate-100 tracking-tight">{rate.region}</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Market</p>
             </div>
          </div>
          
          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tabular-nums transition-all group-hover:scale-105",
            isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? '+' : ''}{rate.changePercent24h?.toFixed(2)}%
          </div>
        </div>

        {/* Primary Price Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-gold-400 uppercase">{rate.currency}</span>
            <span className="text-4xl lg:text-5xl font-black text-slate-50 tracking-tighter tabular-nums leading-none">
              {rate.pricePerGram.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 ml-1">
             Price Per Gram / 24K
          </p>
        </div>

        {/* Footer Stats */}
        <div className="flex justify-between items-center pt-5 border-t border-white/5">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">24H High</span>
              <span className="text-xs font-bold text-slate-300 tabular-nums">{rate.high24h?.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">24H Low</span>
              <span className="text-xs font-bold text-slate-300 tabular-nums">{rate.low24h?.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="p-2 rounded-full bg-slate-800 text-gold-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <ChevronRight size={16} strokeWidth={3} />
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gold-400/5 rounded-bl-3xl -translate-y-8 translate-x-8 transition-transform group-hover:translate-x-4 group-hover:-translate-y-4" />
      </div>
    </motion.div>
  );
}

function getRegionIcon(region: string) {
  switch (region.toLowerCase()) {
    case 'india': return '🇮🇳';
    case 'uae': return '🇦🇪';
    case 'usa': return '🇺🇸';
    case 'saudi arabia': return '🇸🇦';
    case 'uk': return '🇬🇧';
    case 'eu': return '🇪🇺';
    default: return '📍';
  }
}
