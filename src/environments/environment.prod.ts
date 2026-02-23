/**
 * Production environment configuration.
 * API URLs and feature flags for the production build.
 * Secrets (JWT keys, API credentials) must come from the server — not this file.
 */
export const environment = {
  production: true,
  appName: 'Employee Portal',
  appVersion: '1.0.0',
  apiBaseUrl: '/api/v1',   // Relative URL — served by the same host via nginx reverse proxy
  apiTimeout: 30000,
  enableAnalytics: true,
  logLevel: 'error',
};
