export const environment = {
  production: true,
  apiUrl: '/api/v1',
  appName: 'Employee Portal',
  version: '1.0.0',
  logLevel: 'error',
  tokenKey: 'ep_access_token',
  refreshTokenKey: 'ep_refresh_token',
  sessionTimeout: 3600000, // 1 hour in ms
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50]
  }
};
