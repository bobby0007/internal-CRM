import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import type { RateLimit, RestrictionType, MerchantConfig, TemplateCatalogRequest, TemplateUpdateRequest } from '../types';

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message?: string;
}

interface CreatePartnerResponse {
  success: boolean;
  message: string;
}

interface GetTemplateCatalogResponse {
  buttonEnabled: boolean;
  loadBalancingEnabled: boolean;
  loadBalanceTemplates: Record<string, Array<{ templateCode: string; trafficSplit: number }>>;
}

interface MerchantDetailsResponse {
  orgName: string;
  status: string;
  internationalEnabled: boolean;
}

class ApiService {
  static async saveSilentAuthConfig(request: { aid: string; userName: string; password: string; refreshToken: string }): Promise<ApiResponse<any>> {
    return this.fetchApi('/dashboard/v3/crm/save-silent-auth-config', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: this.getHeaders(),
    });
  }
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

  static async updateTemplateCatalog(request: TemplateUpdateRequest): Promise<ApiResponse<any>> {
    return this.fetchApi(API_ENDPOINTS.TEMPLATE.UPDATE, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async getTemplateCatalog(request: TemplateCatalogRequest): Promise<ApiResponse<GetTemplateCatalogResponse>> {
    return this.fetchApi(API_ENDPOINTS.TEMPLATE.GET_CATALOG, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async createPartner(template: any): Promise<ApiResponse<CreatePartnerResponse>> {
    return this.fetchApi('/v1/partners/create', {
      method: 'POST',
      body: JSON.stringify(template),
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

  static async updateRateLimit(
    aid: string,
    restrictionType: RestrictionType | 'COUNTRY_CODE',
    limits: Array<{ request: number; countryCode?: string }>
  ): Promise<ApiResponse<any>> {
    return this.fetchApi(API_ENDPOINTS.RATE_LIMIT.UPDATE, {
      method: 'POST',
      body: JSON.stringify({
        aid,
        restrictionType,
        limits,
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