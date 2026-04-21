// src/screens/AlertsScreen.tsx
import { useState } from 'react';
import { Region, GoldPurity, AlertFrequency } from '../types/gold-field';
import { Bell, Send, CheckCircle2, ShieldCheck, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function AlertsScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [telegramId, setTelegramId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center animate-in zoom-in-95 duration-700">
        <div className="tonal-surface-low rounded-[40px] border border-white/5 p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative inline-flex p-6 rounded-3xl bg-emerald-500/10 text-emerald-400 mb-10">
             <CheckCircle2 size={64} strokeWidth={1.5} />
             <div className="absolute inset-0 bg-emerald-500/20 blur-2xl animate-pulse -z-10" />
          </div>
          
          <h2 className="text-4xl font-black text-slate-100 italic tracking-tight mb-4">Channel Secured</h2>
          <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto leading-relaxed">
            Your intelligence stream is active. You will now receive daily gold price signals directly to your Telegram vault.
          </p>
          
          <button 
            onClick={() => setIsSuccess(false)}
            className="px-10 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-gold-400 text-xs font-black uppercase tracking-[0.2em] border border-white/5 transition-all"
          >
            Manage Intelligence
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-16 py-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      <header className="text-center">
         <div className="inline-flex p-4 rounded-2xl bg-gold-400/10 text-gold-400 mb-8 relative">
            <Bell size={40} strokeWidth={1.5} />
            <div className="absolute top-3 right-3 w-3 h-3 bg-gold-400 rounded-full border-4 border-background" />
         </div>
         <h1 className="text-5xl font-black text-slate-100 tracking-tighter italic mb-4">Signal Subscription</h1>
         <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-[10px]">Real-time Telegram integration for professional traders</p>
      </header>

      <div className="tonal-surface rounded-[48px] p-12 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <form onSubmit={handleSubmit} className="space-y-12 relative">
          
          {/* Telegram Entry */}
          <div className="space-y-4">
             <div className="flex justify-between items-end px-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Telegram Identity</label>
                <span className="text-[9px] font-bold text-gold-400/60 uppercase">Required</span>
             </div>
             <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gold-400 font-black text-lg group-focus-within:scale-110 transition-transform italic">@</div>
                <input 
                   type="text" 
                   required
                   value={telegramId}
                   onChange={(e) => setTelegramId(e.target.value)}
                   placeholder="eg. goldtrader_dxb"
                   className="w-full bg-slate-900 border border-white/5 rounded-2xl py-6 pl-14 pr-6 text-slate-100 font-bold placeholder:text-slate-700 focus:outline-none focus:border-gold-400/30 focus:bg-slate-900/80 transition-all shadow-inner"
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <InputGroup 
                label="Strategic Region" 
                options={Object.values(Region)}
                icon={<ChevronDown size={14} />}
             />
             <InputGroup 
                label="Target Purity" 
                options={Object.values(GoldPurity)}
                icon={<ChevronDown size={14} />}
             />
          </div>

          {/* Frequency Control */}
          <div className="space-y-6">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 text-center block">Transmission Frequency</label>
             <div className="grid grid-cols-3 gap-4">
                {Object.values(AlertFrequency).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    className={cn(
                      "py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                      freq === AlertFrequency.DAILY 
                        ? "bg-gold-400 text-slate-900 shadow-[0_0_25px_rgba(223,175,55,0.3)] border-transparent" 
                        : "bg-slate-900/50 border-white/5 text-slate-500 hover:border-gold-400/20"
                    )}
                  >
                    {freq}
                  </button>
                ))}
             </div>
          </div>

          {/* Compliance & Security */}
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-900/30 border border-white/5 border-l-4 border-l-gold-400/40">
             <ShieldCheck size={24} className="text-gold-400 shrink-0" />
             <div className="space-y-1">
                <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Protocol Secured</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                   Your Telegram ID is encrypted and used exclusively for signal transmission. We do not store personal trading records.
                </p>
             </div>
          </div>

          {/* Editorial CTA */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full relative group disabled:opacity-50"
          >
             {/* The "Metallic Sheen" Gradient Button */}
             <div className="absolute inset-0 bg-gold-400 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
             <div className="relative flex items-center justify-center gap-3 bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 py-6 rounded-2xl font-black text-slate-900 uppercase tracking-[0.3em] text-xs shadow-2xl transition-transform active:scale-[0.98]">
                {isSubmitting ? (
                   <div className="w-5 h-5 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin" />
                ) : (
                   <>
                     <Send size={18} strokeWidth={2.5} />
                     Access the Intelligence
                   </>
                )}
             </div>
          </button>
        </form>
      </div>

      <footer className="text-center opacity-30">
         <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">Secure Vault Transmission v4.0</p>
      </footer>
    </div>
  );
}

function InputGroup({ label, options, icon }: { label: string, options: string[], icon: React.ReactNode }) {
  return (
    <div className="space-y-4">
       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{label}</label>
       <div className="relative group">
          <select className="w-full bg-slate-900 border border-white/5 rounded-2xl py-6 px-6 text-slate-100 font-bold appearance-none focus:outline-none focus:border-gold-400/30 transition-all cursor-pointer shadow-inner">
             {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-gold-400 transition-colors pointer-events-none">
             {icon}
          </div>
       </div>
    </div>
  );
}
