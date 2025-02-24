import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { RateLimit, RestrictionType, MerchantConfig } from '../types';

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message?: string;
}

interface MerchantDetailsResponse {
  orgName: string;
  status: string;
  internationalEnabled: boolean;
}

class ApiService {
  private static readonly TOKEN = '598da28e72644f3b82b080fb7b32f8b7';

  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'token': this.TOKEN,
    };
  }

  private static async fetchApi<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return response.json();
  }

  static async getMerchantDetails(mid: string): Promise<ApiResponse<MerchantDetailsResponse>> {
    return this.fetchApi<MerchantDetailsResponse>(API_ENDPOINTS.MERCHANT.GET_DETAILS, {
      method: 'POST',
      body: JSON.stringify({ mid }),
    });
  }

  static async updateMerchantStatus(mid: string, status: string): Promise<ApiResponse<any>> {
    return this.fetchApi(API_ENDPOINTS.MERCHANT.UPDATE_DETAILS, {
      method: 'POST',
      body: JSON.stringify({ mid, status }),
    });
  }

  static async updateInternationalStatus(mid: string, enabled: boolean): Promise<ApiResponse<any>> {
    return this.fetchApi(API_ENDPOINTS.MERCHANT.UPDATE_INTERNATIONAL, {
      method: 'POST',
      body: JSON.stringify({ 
        mid, 
        status: enabled ? 'ACTIVE' : 'INACTIVE'
      }),
    });
  }

  static async getRateLimitInfo(aid: string): Promise<ApiResponse<RateLimit[]>> {
    return this.fetchApi<RateLimit[]>(API_ENDPOINTS.RATE_LIMIT.GET_INFO, {
      method: 'POST',
      body: JSON.stringify({ aid }),
    });
  }

  static async updateRateLimit(aid: string, restrictionType: RestrictionType, limit: number): Promise<ApiResponse<any>> {
    return this.fetchApi(API_ENDPOINTS.RATE_LIMIT.UPDATE, {
      method: 'POST',
      body: JSON.stringify({ 
        aid,
        restrictionType,
        limit
      }),
    });
  }

  static async getMerchantConfigInfo(aid: string): Promise<ApiResponse<MerchantConfig[]>> {
    return this.fetchApi<MerchantConfig[]>(API_ENDPOINTS.CONFIG.GET_INFO, {
      method: 'POST',
      body: JSON.stringify({ aid }),
    });
  }

  static async updateMerchantConfig(aid: string, type: string, value: string | boolean, status: string = 'ACTIVE'): Promise<ApiResponse<any>> {
    return this.fetchApi(API_ENDPOINTS.CONFIG.UPDATE, {
      method: 'POST',
      body: JSON.stringify({ 
        aid,
        type,
        value: value.toString().toUpperCase(),
        status
      }),
    });
  }
}

export default ApiService;