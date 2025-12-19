/**
 * Mobile app configuration
 * Handles API base URL, environment variables, and runtime overrides
 */

/**
 * Get the API base URL for Gemini and other backend calls
 *
 * Priority order:
 * 1. global.API_BASE_URL (set at runtime if needed)
 * 2. Environment variable EXPO_PUBLIC_API_BASE_URL (set in .env)
 * 3. Default fallback
 *
 * Development:
 * - For local testing: Set EXPO_PUBLIC_API_BASE_URL in .env.local or .env
 * - Example: EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:3000
 * - Or at runtime: (global as any).API_BASE_URL = "http://192.168.1.100:3000"
 *
 * Production:
 * - Set EXPO_PUBLIC_API_BASE_URL to your production API domain
 * - Example: EXPO_PUBLIC_API_BASE_URL=https://api.yourdomain.com
 */
export function getApiBaseUrl(): string {
  // Check runtime override first
  if ((global as any).API_BASE_URL) {
    return (global as any).API_BASE_URL
  }

  // Check environment variable (must start with EXPO_PUBLIC_ to be accessible in Expo)
  if (typeof process !== "undefined" && process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL
  }

  // Default fallback for local development
  // Note: Adjust IP based on your development machine
  const defaultLocal = "http://localhost:3000"
  return defaultLocal
}

/**
 * Get the API URL for Gemini analysis endpoint
 */
export function getGeminiAnalyzeUrl(): string {
  return `${getApiBaseUrl()}/api/gemini-analyze`
}

export const apiConfig = {
  getApiBaseUrl,
  getGeminiAnalyzeUrl,
}
