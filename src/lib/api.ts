// src/lib/api.ts
import axios from 'axios';
import type { 
  LiveRateResponse, 
  SignalResponse, 
  MarketSummaryResponse 
} from '../types/gold-field';
import { 
  Region, 
  Currency, 
  GoldPurity, 
  SignalType, 
  SignalConfidence
} from '../types/gold-field';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Mock Service for demonstration
const MOCK_DELAY = 800;

export const mockApi = {
  getLiveRates: async (): Promise<LiveRateResponse[]> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return [
      {
        region: Region.UAE,
        currency: Currency.AED,
        purity: GoldPurity.GOLD_24K,
        pricePerGram: 325.50,
        pricePerOunce: 10125.00,
        bid: 324.0,
        ask: 327.0,
        change24h: 2.5,
        changePercent24h: 0.77,
        high24h: 328.0,
        low24h: 322.0,
        timestamp: new Date().toISOString(),
        cached: false
      },
      {
        region: Region.USA,
        currency: Currency.USD,
        purity: GoldPurity.GOLD_24K,
        pricePerGram: 88.50,
        pricePerOunce: 2752.00,
        bid: 88.0,
        ask: 89.0,
        change24h: -1.2,
        changePercent24h: -1.37,
        high24h: 89.0,
        low24h: 87.0,
        timestamp: new Date().toISOString(),
        cached: false
      },
      {
        region: Region.UK,
        currency: Currency.GBP,
        purity: GoldPurity.GOLD_24K,
        pricePerGram: 69.20,
        pricePerOunce: 2154.00,
        bid: 69.0,
        ask: 69.5,
        change24h: 0.45,
        changePercent24h: 0.65,
        high24h: 69.8,
        low24h: 68.9,
        timestamp: new Date().toISOString(),
        cached: false
      },
      {
        region: Region.INDIA,
        currency: Currency.INR,
        purity: GoldPurity.GOLD_24K,
        pricePerGram: 7450.00,
        pricePerOunce: 231700.00,
        bid: 7440.0,
        ask: 7460.0,
        change24h: 15.0,
        changePercent24h: 0.20,
        high24h: 7480.0,
        low24h: 7420.0,
        timestamp: new Date().toISOString(),
        cached: false
      },
      {
        region: Region.SAUDI,
        currency: Currency.SAR,
        purity: GoldPurity.GOLD_24K,
        pricePerGram: 332.10,
        pricePerOunce: 10328.00,
        bid: 331.0,
        ask: 333.5,
        change24h: 0.8,
        changePercent24h: 0.24,
        high24h: 334.0,
        low24h: 330.0,
        timestamp: new Date().toISOString(),
        cached: false
      },
      {
        region: Region.EU,
        currency: Currency.EUR,
        purity: GoldPurity.GOLD_24K,
        pricePerGram: 82.30,
        pricePerOunce: 2559.00,
        bid: 82.0,
        ask: 82.6,
        change24h: -0.15,
        changePercent24h: -0.18,
        high24h: 82.5,
        low24h: 82.1,
        timestamp: new Date().toISOString(),
        cached: false
      }
    ];
  },

  getTodaySignal: async (): Promise<SignalResponse> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return {
      date: new Date().toISOString().split('T')[0],
      signal: SignalType.BUY,
      confidence: SignalConfidence.HIGH,
      reasoning: "Gold prices have stabilised after a recent dip. Technical indicators show strong support at current levels, especially in the UAE market. Global economic uncertainty remains a primary driver for upside potential.",
      metrics: {
        price24k: 325.5,
        change24h: 2.5,
        changePercent24h: 0.77,
        trend7d: -1.2,
        trend30d: -3.5,
        localPremium: 4.2
      },
      disclaimer: "This signal is for informational purposes only. Gold investments involve risk. Please consult with a financial advisor.",
      lastUpdated: new Date().toISOString()
    };
  },

  getMarketSummary: async (): Promise<MarketSummaryResponse> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return {
      premium: {
        current: 4.50,
        average7d: 4.20,
        average30d: 4.00,
        trend: 'stable',
        recommendation: "Premium is within normal range, making it a fair time for retail purchases."
      },
      bestTime: {
        bestDay: "Friday",
        bestTime: "10 AM - 12 PM",
        reason: "Early morning tends to Have better liquidity and price stability before the weekend retail surge in Dubai Souks.",
        averagePriceDiff: 2.50
      },
      lastUpdated: new Date().toISOString()
    };
  }
};
