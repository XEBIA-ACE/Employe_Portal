/**
 * Development environment configuration.
 * These values are replaced with environment.prod.ts values for production builds.
 * Never commit secrets here — use the backend or CI/CD secrets for sensitive data.
 */
export const environment = {
  production: false,
  appName: 'Employee Portal',
  appVersion: '1.0.0',
  apiBaseUrl: 'http://localhost:3000/api/v1',
  apiTimeout: 30000,
  enableAnalytics: false,
  logLevel: 'debug',
};
