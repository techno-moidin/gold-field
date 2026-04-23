import axios, { type AxiosInstance } from 'axios';
import { useStore } from '../store/useStore';
import type { 
  LiveRateResponse, 
  SignalResponse, 
  UaeMarketSummary,
  Region,
  GoldPurity,
  AlertFrequency
} from '../types/gold-field';

// Use Vite proxy path in dev to bypass CORS and tunnel anti-phishing page.
// In production, set VITE_API_URL to the full backend URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add interceptors to handle maintenance mode
    this.client.interceptors.response.use(
      (response) => {
        // If we get a successful response, ensure maintenance mode is OFF
        useStore.getState().setMaintenanceMode(false);
        return response;
      },
      (error) => {
        // Trigger maintenance mode on connection errors or 5xx server errors
        if (!error.response || error.response.status >= 500) {
          useStore.getState().setMaintenanceMode(true);
        }
        return Promise.reject(error);
      }
    );
  }

  // Gold Rates
  async getLiveRates(region?: Region, purity?: GoldPurity): Promise<LiveRateResponse[]> {
    const params: any = {};
    if (region) params.region = region;
    if (purity) params.purity = purity;
    
    const response = await this.client.get('/gold-rates/live', { params });
    const data = response.data;
    
    // Normalize data: backend returns an object for single results, but we expect an array
    if (data && !Array.isArray(data)) {
      return [data];
    }
    return data || [];
  }

  // Signals
  async getTodaySignal(): Promise<SignalResponse> {
    const response = await this.client.get('/signals/today');
    return response.data;
  }

  // UAE Market
  async getMarketSummary(): Promise<UaeMarketSummary> {
    const response = await this.client.get('/uaemarts/summary');
    return response.data;
  }

  // Telegram Alerts
  async subscribe(data: {
    telegramUsername: string;
    region: Region;
    purity: GoldPurity;
    frequency: AlertFrequency;
  }): Promise<void> {
    await this.client.post('/alerts/subscribe', data);
  }
}

export const api = new ApiClient();
export default api;
