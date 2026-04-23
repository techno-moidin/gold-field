// src/components/SignalBadge.tsx
import { SignalType, SignalConfidence } from '../types/gold-field';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SignalBadgeProps {
  type: SignalType;
  confidence: SignalConfidence;
  size?: 'sm' | 'lg';
}

export function SignalBadge({ type, confidence, size = 'sm' }: SignalBadgeProps) {
  const getStyles = () => {
    switch (type) {
      case SignalType.BUY: 
        return 'bg-green-500 text-slate-900 shadow-[0_0_20px_rgba(34,197,94,0.3)]';
      case SignalType.WAIT: 
        return 'bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.3)]';
      case SignalType.AVOID: 
        return 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]';
      default: 
        return 'bg-slate-700 text-slate-100';
    }
  };

  const isLg = size === 'lg';

  return (
    <div className={cn(
      "flex flex-col items-center justify-center font-black uppercase tracking-tight transition-all duration-500",
      isLg ? "px-12 py-8 rounded-2xl" : "px-5 py-3 rounded-xl",
      getStyles()
    )}>
      <span className={cn(
        "leading-none",
        isLg ? "text-6xl" : "text-2xl"
      )}>
        {type}
      </span>
      <div className={cn(
        "flex items-center gap-1 opacity-80 font-bold tracking-[0.2em]",
        isLg ? "text-xs mt-3" : "text-[8px] mt-1"
      )}>
        <span className="w-1 h-1 rounded-full bg-current opacity-50 shrink-0" />
        {confidence}
        <span className="w-1 h-1 rounded-full bg-current opacity-50 shrink-0" />
      </div>
    </div>
  );
}
