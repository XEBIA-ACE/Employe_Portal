export const environment = {
  production: false,
  apiUrl: 'https://staging-api.employee-portal.com/api/v1',
  appName: 'Employee Portal (Staging)',
  version: '1.0.0',
  logLevel: 'warn',
  tokenKey: 'ep_access_token',
  refreshTokenKey: 'ep_refresh_token',
  sessionTimeout: 3600000,
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50]
  }
};
