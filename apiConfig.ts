export const API_CONFIG = {
  // For client-side fetches (must use NEXT_PUBLIC_)
  clientBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001',

  // For server-side route handlers
  serverBaseUrl: process.env.BACKEND_ORIGIN ?? 'http://localhost:4000',
} as const;