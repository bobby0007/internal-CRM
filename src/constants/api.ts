export const API_BASE_URL = 'https://metaverse-pp.otpless.app';

export const API_ENDPOINTS = {
  MERCHANT: {
    GET_DETAILS: '/dashboard/v3/crm/get-merchant-details',
    UPDATE_DETAILS: '/dashboard/v3/crm/update-merchant-details',
    UPDATE_INTERNATIONAL: '/dashboard/v3/crm/update-international-merchant-details'
  },
  RATE_LIMIT: {
    GET_INFO: '/dashboard/v3/crm/get-rate-limit-info',
    UPDATE: '/dashboard/v3/crm/update-rate-limit-info'
  },
  CONFIG: {
    GET_INFO: '/dashboard/v3/crm/get-merchant-config-info',
    UPDATE: '/dashboard/v3/crm/update-merchant-config-info'
  },
  AUTH: {
    LOGIN: '/auth/login',
  }
} as const;