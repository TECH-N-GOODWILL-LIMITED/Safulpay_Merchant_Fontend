const config = {
  // ─── WHEN BACKEND IS READY ───────────────────────
  // Set USE_MOCK to false in each src/api/*.api.ts file
  // Point VITE_API_BASE_URL in .env to your server
  // ────────────────────────────────────────────────
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://app.safulpay.com/api',
  APP_NAME: 'SafulPay Merchant Dashboard',
  CURRENCY: 'SLE',
  COUNTRY_CODE: '+232',
} as const

export default config
