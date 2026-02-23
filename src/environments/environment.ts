export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  appName: 'Employee Portal',
  version: '1.0.0',
  logLevel: 'debug',
  tokenKey: 'ep_access_token',
  refreshTokenKey: 'ep_refresh_token',
  sessionTimeout: 3600000, // 1 hour in ms
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50]
  }
};
