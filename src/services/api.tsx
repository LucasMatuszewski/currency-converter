import { Currencies } from '../types';

export const API_URL = 'https://api.exchangeratesapi.io';

export const API = {
  getLatest: async (baseCurrency?: Currencies) => {
    try {
      const response = await fetch(
        `${API_URL}/latest${baseCurrency ? `?base=${baseCurrency}` : ''}`
      );
      if (response.status >= 400) {
        console.error(response.status);
        return;
      }
      return await response.json();
    } catch (e) {
      console.error(e);
      return e;
    }
  },
  getHistory: async (
    startAt: string,
    endAt: string,
    baseCurrency?: Currencies
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/history?start_at=${startAt}&end_at=${endAt}${
          baseCurrency ? `&base=${baseCurrency}` : ''
        }`
      );
      if (response.status >= 400) {
        console.error(response.status);
        return;
      }
      return await response.json();
    } catch (e) {
      console.error(e);
      return e;
    }
  },
};
