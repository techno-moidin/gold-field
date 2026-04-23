// src/hooks/useGoldRates.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useStore } from '../store/useStore';

export function useLiveRates() {
  const { selectedPurity } = useStore();
  
  const query = useQuery({
    queryKey: ['liveRates'],
    queryFn: () => api.getLiveRates(), // Fetch ALL rates (all regions, all purities)
    refetchInterval: 60000,
    placeholderData: (previousData) => previousData,
  });

  // Filter client-side by selected purity so we keep all regions visible
  const filtered = Array.isArray(query.data)
    ? query.data.filter((r) => r.purity === selectedPurity)
    : [];

  return { ...query, data: filtered };
}

export function useTodaySignal() {
  return useQuery({
    queryKey: ['todaySignal'],
    queryFn: () => api.getTodaySignal(),
    refetchInterval: 3600000, // 1 hour
  });
}

export function useMarketSummary() {
  return useQuery({
    queryKey: ['marketSummary'],
    queryFn: () => api.getMarketSummary(),
    refetchInterval: 300000, // 5 minutes
  });
}
