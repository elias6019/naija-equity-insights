export const BRAND_NAME = 'NGX-Pulse';
export const CONTACT_EMAIL = 'analytics@ngxpulse.com';

export const NGX_MACRO = {
  ASI: 241762.01,
  ASI_CHANGE: 1.42,
  MPR: 26.50,
  INFLATION: 15.93,
  NIBOR: 18.75,
  FX_RATE: 1540,
  MARKET_CAP: 56.8, // trillion NGN
  DATE: 'July 2026',
};

export const SECTORS = [
  { id: 'banking', name: 'Banking', icon: 'Bank', tickers: 12, color: '#10b981' },
  { id: 'oil-gas', name: 'Oil & Gas', icon: 'GasPump', tickers: 8, color: '#f59e0b' },
  { id: 'consumer', name: 'Consumer Goods', icon: 'Buildings', tickers: 15, color: '#8b5cf6' },
  { id: 'industrial', name: 'Industrial', icon: 'Factory', tickers: 10, color: '#3b82f6' },
  { id: 'telecom', name: 'Telecom & IT', icon: 'DeviceMobile', tickers: 6, color: '#06b6d4' },
] as const;

export const STOCK_TICKERS = [
  { symbol: 'GTCO', name: 'Guaranty Trust Holding Co.', price: 52.40, change: 2.15, sector: 'banking', volume: '12.4M', marketCap: '1.54T', pe: 6.8, yield: 7.2 },
  { symbol: 'ZENITH', name: 'Zenith Bank Plc', price: 44.80, change: 1.85, sector: 'banking', volume: '9.8M', marketCap: '1.41T', pe: 5.2, yield: 8.1 },
  { symbol: 'ACCESS', name: 'Access Holdings Plc', price: 22.10, change: -0.45, sector: 'banking', volume: '15.2M', marketCap: '785B', pe: 4.1, yield: 9.5 },
  { symbol: 'UBA', name: 'United Bank for Africa', price: 28.75, change: 3.20, sector: 'banking', volume: '18.6M', marketCap: '983B', pe: 4.8, yield: 8.8 },
  { symbol: 'SEPLAT', name: 'Seplat Energy Plc', price: 2180.00, change: 1.65, sector: 'oil-gas', volume: '2.1M', marketCap: '1.28T', pe: 9.4, yield: 5.1 },
  { symbol: 'TOTAL', name: 'TotalEnergies Marketing Nigeria', price: 485.00, change: -0.80, sector: 'oil-gas', volume: '0.8M', marketCap: '410B', pe: 11.2, yield: 6.3 },
  { symbol: 'CONOIL', name: 'Conoil Plc', price: 168.50, change: 2.50, sector: 'oil-gas', volume: '1.2M', marketCap: '118B', pe: 7.6, yield: 4.8 },
  { symbol: 'NESTLE', name: 'Nestle Nigeria Plc', price: 950.00, change: -1.20, sector: 'consumer', volume: '0.5M', marketCap: '752B', pe: 22.5, yield: 3.2 },
  { symbol: 'FLOUR', name: 'Flour Mills Nigeria', price: 42.60, change: 1.10, sector: 'consumer', volume: '3.4M', marketCap: '175B', pe: 8.3, yield: 6.8 },
  { symbol: 'NB', name: 'Nigerian Breweries', price: 32.20, change: -0.65, sector: 'consumer', volume: '5.1M', marketCap: '256B', pe: 14.7, yield: 4.5 },
  { symbol: 'DANGOTE', name: 'Dangote Cement', price: 485.00, change: 0.85, sector: 'industrial', volume: '2.7M', marketCap: '8.26T', pe: 12.1, yield: 5.5 },
  { symbol: 'BUA', name: 'BUA Cement', price: 112.50, change: -1.50, sector: 'industrial', volume: '1.9M', marketCap: '3.81T', pe: 15.3, yield: 4.2 },
  { symbol: 'MTN', name: 'MTN Nigeria', price: 210.00, change: -2.30, sector: 'telecom', volume: '4.2M', marketCap: '4.27T', pe: 11.8, yield: 7.5 },
  { symbol: 'AIRTEL', name: 'Airtel Africa (Nigeria)', price: 2200.00, change: 1.40, sector: 'telecom', volume: '0.9M', marketCap: '8.27T', pe: 14.3, yield: 3.8 },
  { symbol: 'WAPCO', name: 'Lafarge Africa', price: 38.75, change: 0.55, sector: 'industrial', volume: '2.3M', marketCap: '624B', pe: 9.7, yield: 5.9 },
];

export const MACRO_FORECAST = {
  Q3_2026: { mpr: 26.00, inflation: 14.80, asi: 252000 },
  Q4_2026: { mpr: 25.50, inflation: 13.50, asi: 265000 },
  Q1_2027: { mpr: 24.00, inflation: 12.10, asi: 280000 },
};

// Generate realistic mock historical prices via random walk
export function generateHistoricalPrices(
  basePrice: number,
  volatility: number = 0.015,
  days: number = 252
): { date: string; price: number }[] {
  const data: { date: string; price: number }[] = [];
  let price = basePrice * (1 + (Math.random() - 0.5) * 0.2); // start ±10%
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const drift = 0.0004; // slight upward bias
    const shock = (Math.random() - 0.5) * 2 * volatility;
    price = price * (1 + drift + shock);
    data.push({
      date: d.toISOString().slice(0, 10),
      price: Math.max(price, 0.01),
    });
  }
  return data;
}

// Pre-computed historical data snapshot for each ticker (sampled to 60 points for charting)
export function getStockHistory(symbol: string): { date: string; price: number }[] {
  const ticker = STOCK_TICKERS.find((t) => t.symbol === symbol);
  if (!ticker) return [];
  const full = generateHistoricalPrices(ticker.price, 0.018, 252);
  // Sample down to ~60 points for clean rendering
  const step = Math.max(1, Math.floor(full.length / 60));
  return full.filter((_, i) => i % step === 0).slice(0, 60);
}

export const SECTOR_YIELDS = [
  { sector: 'Banking', yield: 8.4, color: '#10b981' },
  { sector: 'Oil & Gas', yield: 5.4, color: '#f59e0b' },
  { sector: 'Consumer', yield: 4.8, color: '#8b5cf6' },
  { sector: 'Industrial', yield: 5.2, color: '#3b82f6' },
  { sector: 'Telecom', yield: 5.7, color: '#06b6d4' },
] as const;

export const PERIOD_OPTIONS = [
  { label: '1M', days: 21 },
  { label: '3M', days: 63 },
  { label: '6M', days: 126 },
  { label: 'YTD', days: 0 }, // special: current year
  { label: '1Y', days: 252 },
] as const;

export const MARQUEE_TICKERS = [
  { symbol: 'GTCO', price: 52.40, change: 2.15 },
  { symbol: 'ZENITH', price: 44.80, change: 1.85 },
  { symbol: 'ACCESS', price: 22.10, change: -0.45 },
  { symbol: 'UBA', price: 28.75, change: 3.20 },
  { symbol: 'SEPLAT', price: 2180.00, change: 1.65 },
  { symbol: 'DANGOTE', price: 485.00, change: 0.85 },
  { symbol: 'MTN', price: 210.00, change: -2.30 },
  { symbol: 'AIRTEL', price: 2200.00, change: 1.40 },
  { symbol: 'NESTLE', price: 950.00, change: -1.20 },
  { symbol: 'NB', price: 32.20, change: -0.65 },
];