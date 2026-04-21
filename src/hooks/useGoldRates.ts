// src/hooks/useGoldRates.ts
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '../lib/api';

export function useLiveRates() {
  return useQuery({
    queryKey: ['liveRates'],
    queryFn: () => mockApi.getLiveRates(),
    refetchInterval: 60000, // Refresh every minute for the demo
  });
}

export function useTodaySignal() {
  return useQuery({
    queryKey: ['todaySignal'],
    queryFn: () => mockApi.getTodaySignal(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useMarketSummary() {
  return useQuery({
    queryKey: ['marketSummary'],
    queryFn: () => mockApi.getMarketSummary(),
  });
}
