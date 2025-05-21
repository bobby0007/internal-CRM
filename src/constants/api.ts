export const API_BASE_URL = 'https://metaverse.otpless.app';

export const API_ENDPOINTS = {
  MERCHANT: {
    GET_DETAILS: '/dashboard/v3/crm/get-merchant-details',
    UPDATE_DETAILS: '/dashboard/v3/crm/update-merchant-details',
    UPDATE_INTERNATIONAL: '/dashboard/v3/crm/update-international-merchant-details'
  },
  RATE_LIMIT: {
    GET_INFO: '/dashboard/v3/crm/get-rate-limit-details',
    UPDATE: '/dashboard/v3/crm/update-rate-limit-details'
  },
  CONFIG: {
    GET_INFO: '/dashboard/v3/crm/get-merchant-config-info',
    UPDATE: '/dashboard/v3/crm/update-merchant-config-info'
  },
  AUTH: {
    LOGIN: '/auth/login',
  },
  TEMPLATE: {
    GET_CATALOG: '/dashboard/v3/crm/get-merchant-template-catalog-info',
    UPDATE: '/dashboard/v3/crm/update-merchant-template-catalog-info'
  }
} as const;