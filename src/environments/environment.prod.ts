export const environment = {
  production: true,
  apiBaseUrl: '/api/v1',
  apiTimeout: 30000,
  appName: 'Employee Portal',
  version: '1.0.0',
  features: {
    darkMode: true,
    notifications: true,
    reports: true,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  logging: {
    level: 'error', // Only log errors in production
    enableConsole: false,
  },
};
