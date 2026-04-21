// src/types/gold-field.ts

export const Region = {
  UAE: 'UAE',
  USA: 'USA',
  INDIA: 'INDIA',
  SAUDI: 'SAUDI',
  UK: 'UK',
  EU: 'EU',
} as const;
export type Region = typeof Region[keyof typeof Region];

export const GoldPurity = {
  GOLD_24K: '24K',
  GOLD_22K: '22K',
  GOLD_18K: '18K',
} as const;
export type GoldPurity = typeof GoldPurity[keyof typeof GoldPurity];

export const Currency = {
  AED: 'AED',
  USD: 'USD',
  INR: 'INR',
  SAR: 'SAR',
  GBP: 'GBP',
  EUR: 'EUR',
} as const;
export type Currency = typeof Currency[keyof typeof Currency];

export const SignalType = {
  BUY: 'BUY',
  WAIT: 'WAIT',
  AVOID: 'AVOID',
} as const;
export type SignalType = typeof SignalType[keyof typeof SignalType];

export const SignalConfidence = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;
export type SignalConfidence = typeof SignalConfidence[keyof typeof SignalConfidence];

export const AlertFrequency = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  INSTANT: 'INSTANT',
} as const;
export type AlertFrequency = typeof AlertFrequency[keyof typeof AlertFrequency];

export interface LiveRateResponse {
  region: Region;
  currency: Currency;
  purity: GoldPurity;
  pricePerGram: number;
  pricePerOunce: number;
  bid: number;
  ask: number;
  change24h: number | null;
  changePercent24h: number | null;
  high24h: number | null;
  low24h: number | null;
  timestamp: string; // ISO String
  cached: boolean;
}

export interface SignalMetrics {
  price24k: number;
  change24h: number;
  changePercent24h: number;
  trend7d: number;
  trend30d: number;
  localPremium: number;
}

export interface SignalResponse {
  date: string;
  signal: SignalType;
  confidence: SignalConfidence;
  reasoning: string;
  metrics: SignalMetrics;
  disclaimer: string;
  lastUpdated: string;
}

export interface UaePremium {
  current: number;
  average7d: number;
  average30d: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendation: string;
}

export interface BestTimeToBuy {
  bestDay: string;
  bestTime: string;
  reason: string;
  averagePriceDiff: number;
}

export interface MarketSummaryResponse {
  premium: UaePremium;
  bestTime: BestTimeToBuy;
  lastUpdated: string;
}
