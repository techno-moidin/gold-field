// src/components/PriceCard.tsx
import type { LiveRateResponse } from '../types/gold-field';
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
          "group relative h-full bg-surface-container-low rounded-2xl p-6 hover:bg-surface-container transition-all duration-300 cursor-pointer overflow-hidden",
          rate.region.toLowerCase() === 'uae' && "border border-amber-500/20"
        )}
      >
        {/* Top Segment: Region & Icon */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <span className="label-sm text-on-surface-variant block mb-1 uppercase tracking-widest text-[10px] font-bold">Region</span>
            <h3 className="text-xl font-bold text-on-surface">{rate.region}</h3>
          </div>
          <span className="material-symbols-outlined text-amber-500/20 group-hover:text-amber-500/40 transition-colors text-4xl">
            {getMaterialIcon(rate.region)}
          </span>
        </div>

        {/* Bottom Segment: Price & Change */}
        <div className="flex items-end justify-between">
          <div>
            <span className="label-sm text-on-surface-variant block mb-1 uppercase tracking-widest text-[10px] font-bold">Price per Gram</span>
            <div className="text-3xl font-black text-primary tracking-tight font-mono">
              {getCurrencySymbol(rate.currency)}{rate.pricePerGram.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all",
            isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            <span className="material-symbols-outlined text-xs">
              {isPositive ? 'trending_up' : 'trending_down'}
            </span>
            {isPositive ? '+' : ''}{rate.changePercent24h?.toFixed(2)}%
          </div>
        </div>

        {/* UAE Specific Tag */}
        {rate.region.toLowerCase() === 'uae' && (
          <div className="absolute top-0 right-0 p-2">
            <span className="bg-amber-500 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter">Hot</span>
          </div>
        )}

        {/* Decorative Hover Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
}

function getMaterialIcon(region: string) {
  switch (region.toLowerCase()) {
    case 'india': return 'temple_hindu';
    case 'uae': return 'account_balance';
    case 'usa': return 'public';
    case 'saudi arabia': return 'mosque';
    case 'uk': return 'potted_plant'; 
    case 'eu': return 'euro_symbol';
    default: return 'public';
  }
}

function getCurrencySymbol(currency: string) {
  switch (currency.toUpperCase()) {
    case 'USD': return '$';
    case 'INR': return '₹';
    case 'AED': return 'AED ';
    case 'SAR': return 'SAR ';
    case 'GBP': return '£';
    case 'EUR': return '€';
    default: return currency + ' ';
  }
}


