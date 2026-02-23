export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api/v1',
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
    level: 'debug', // 'debug' | 'info' | 'warn' | 'error'
    enableConsole: true,
  },
};
