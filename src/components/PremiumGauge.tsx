// src/components/PremiumGauge.tsx
import { motion } from 'framer-motion';

interface PremiumGaugeProps {
  value: number; // current premium %
  min?: number;
  max?: number;
  optimalMin?: number;
  optimalMax?: number;
}

export function PremiumGauge({ 
  value, 
  min = 0, 
  max = 10, 
  optimalMin = 3, 
  optimalMax = 5 
}: PremiumGaugeProps) {
  // Calculate position as percentage (0-100)
  const position = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  
  // Determine if current value is optimal
  const isOptimal = value >= optimalMin && value <= optimalMax;

  return (
    <div className="py-8">
      <div className="relative w-full h-12 flex items-center">
        {/* Track Line */}
        <div className="absolute w-full h-[1px] bg-white/10 rounded-full" />
        
        {/* Optimal Range Highlight */}
        <div 
          className="absolute h-[4px] bg-green-500/10 border-x border-green-500/20"
          style={{ 
            left: `${((optimalMin - min) / (max - min)) * 100}%`,
            width: `${((optimalMax - optimalMin) / (max - min)) * 100}%`
          }}
        />
        
        {/* Marker (The "Ball") */}
        <motion.div 
          initial={{ left: '0%' }}
          animate={{ left: `${position}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 10 }}
          className="absolute -translate-x-1/2 z-10"
        >
          <div className="relative">
             {/* Glow */}
             <div className="absolute inset-0 w-6 h-6 -translate-x-1 -translate-y-1 bg-amber-500/30 rounded-full blur-md animate-pulse" />
             {/* Core */}
             <div className="relative w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-900 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
             
             {/* Current Value Tooltip-like Badge */}
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 border border-white/10 px-3 py-1 rounded-lg shadow-2xl">
                <span className="text-[10px] font-black text-on-surface whitespace-nowrap tabular-nums">{value.toFixed(1)}%</span>
             </div>
          </div>
        </motion.div>

        {/* Legend / Scale */}
        <div className="absolute top-10 left-0 w-full flex justify-between px-1">
           <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Low</span>
              <span className="text-[8px] text-slate-500 tabular-nums">{min}%</span>
           </div>
           
           <div className="flex flex-col items-center">
              <span className={isOptimal ? "text-green-400" : "text-on-surface-variant" + " text-[9px] font-black uppercase tracking-widest"}>
                Optimal
              </span>
              <span className="text-[8px] text-slate-500 tabular-nums">{optimalMin}% - {optimalMax}%</span>
           </div>

           <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">High</span>
              <span className="text-[8px] text-slate-500 tabular-nums">{max}%</span>
           </div>
        </div>
      </div>
    </div>
  );
}
