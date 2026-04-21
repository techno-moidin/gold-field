// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Region, GoldPurity } from '../types/gold-field';

interface AppState {
  selectedRegion: Region;
  selectedPurity: GoldPurity;
  isDarkMode: boolean;
  
  setRegion: (region: Region) => void;
  setPurity: (purity: GoldPurity) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      selectedRegion: Region.UAE,
      selectedPurity: GoldPurity.GOLD_24K,
      isDarkMode: true,

      setRegion: (region) => set({ selectedRegion: region }),
      setPurity: (purity) => set({ selectedPurity: purity }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'gold-field-storage',
    }
  )
);
