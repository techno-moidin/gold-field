// src/screens/MaintenanceScreen.tsx
import { motion } from 'framer-motion';

export function MaintenanceScreen() {
  return (
    <div className="bg-[#0b1326] text-[#dae2fd] font-sans selection:bg-[#f2ca50] selection:text-[#3c2f00] min-h-screen flex flex-col overflow-x-hidden relative">
      {/* TopAppBar */}
      <header className="bg-[#0b1326]/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50 border-b border-white/5">
        <div className="text-xl font-black tracking-widest text-[#f2ca50] italic uppercase">GILDED VAULT</div>
        <div className="flex items-center gap-6">
          <button className="text-[#d0c5af] opacity-70 hover:text-[#f2ca50] transition-colors duration-200">
            <span className="material-symbols-outlined">lock</span>
          </button>
          <button className="text-[#d0c5af] opacity-70 hover:text-[#f2ca50] transition-colors duration-200">
            <span className="material-symbols-outlined">support_agent</span>
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center relative px-6 py-24 mt-16 overflow-hidden">
        {/* Ambient Background Texture */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#f2ca50]/10 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#2d3449]/30 blur-[100px]"></div>
        </div>

        {/* Central Vault Graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 mb-12"
        >
          <div className="absolute inset-0 rounded-full bg-[#f2ca50]/10 blur-2xl transition-all duration-700 scale-125"></div>
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <svg className="w-full h-full text-[#f2ca50]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-20" cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
              
              <motion.g 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '100px 100px' }}
              >
                <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="8" strokeDasharray="1 19" strokeLinecap="round" />
              </motion.g>

              <circle cx="100" cy="100" r="55" fill="#131b2e" stroke="#f2ca50" strokeWidth="1.5" />
              
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '100px 100px' }}
              >
                <path d="M100 60V45M140 100h15M100 140v15M60 100H45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </motion.g>

              <circle cx="100" cy="100" r="12" fill="#f2ca50" />
            </svg>
            <div className="absolute w-4 h-4 rounded-full bg-[#f2ca50] shadow-[0_0_20px_#f2ca50] animate-pulse"></div>
          </div>
        </motion.div>

        {/* Typography Content */}
        <div className="z-10 text-center max-w-2xl px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-[#dae2fd] mb-6">
            Upgrading the <span className="text-[#f2ca50] italic">Vault</span>
          </h1>
          <p className="text-[#d0c5af] text-lg md:text-xl font-light leading-relaxed mb-12">
            We're currently performing scheduled maintenance to enhance your experience. We'll be back online shortly.
          </p>

          {/* Progress Indicator Section */}
          <div className="mb-12 space-y-4 max-w-sm mx-auto">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d0c5af] font-bold">System Integrity Syncing</span>
              <span className="font-mono text-[#f2ca50] font-black">87%</span>
            </div>
            <div className="w-full h-1.5 bg-[#171f33] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "87%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-[#f2ca50] rounded-full shadow-[0_0_10px_rgba(242,202,80,0.5)]"
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></div>
              <span className="text-[10px] text-[#d0c5af] uppercase tracking-widest font-bold">Optimization Active</span>
            </div>
          </div>

          <div className="bg-[#171f33] p-1 rounded-xl shadow-2xl inline-block w-full max-w-md mx-auto border border-white/5">
            <div className="flex flex-col md:flex-row gap-2 p-2">
              <input 
                className="w-full bg-[#222a3d] border-none rounded-lg px-4 py-3 text-[#dae2fd] placeholder-[#d0c5af]/40 outline-none text-sm" 
                placeholder="Email or Telegram handle" 
                type="text"
              />
              <button 
                className="bg-[#f2ca50] text-[#3c2f00] font-bold px-8 py-3 rounded-lg transition-all hover:brightness-110 active:scale-95 text-sm uppercase tracking-widest whitespace-nowrap"
              >
                Alert Me
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 mt-16">
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#f2ca50] text-[#3c2f00] font-black px-12 py-4 rounded-xl transition-all hover:brightness-110 active:scale-95 text-xs uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(242,202,80,0.2)]"
            >
              Force Synchronize
            </button>
            <p className="text-[10px] text-[#d0c5af] opacity-50 uppercase tracking-widest font-bold">
              Background Auto-Sync Active (5s)
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1326] flex flex-col md:flex-row justify-between items-center w-full px-8 py-6 gap-4 mt-auto border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="text-sm font-black text-[#f2ca50] italic uppercase">GILDED VAULT</div>
          <p className="text-[10px] uppercase tracking-widest text-[#d0c5af] opacity-50 font-bold">© 2024 Secure Trading System</p>
        </div>
        <div className="flex gap-4">
           {['Security', 'Privacy', 'Status'].map(s => (
             <span key={s} className="text-[10px] uppercase tracking-widest text-[#d0c5af] opacity-50 cursor-pointer">{s}</span>
           ))}
        </div>
      </footer>
    </div>
  );
}
