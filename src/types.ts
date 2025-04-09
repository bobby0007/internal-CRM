export type MerchantStatus = 'ACTIVE' | 'BLOCKED' | 'PENDING' | 'HARD_BLOCK' | 'SOFT_BLOCK';

export interface Merchant {
  mid: string;
  name: string;
  status: MerchantStatus;
  internationalTxns: boolean;
  lastUpdated: string;
  transactionVolume: number;
}

export interface Template {
  dltPeId: string;
  senderId: string;
  templateId: string;
  templateText: string;
  category: string;
  language: string;
}

export interface OtplessUser {
  status: string;
  token: string;
  message?: string;
  userId: string;
  timestamp: string;
  identities: {
    identityType: "EMAIL" | "PHONE";
    identityValue: string;
    channel: "OAUTH" | "OTP";
    methods: string[];
    name: string;
    verified: boolean;
    verifiedAt: string;
    isCompanyEmail: string;
  }[];
  idToken: string;
  network: {
    ip: string;
    timezone: string;
    ipLocation: Record<string, unknown>;
  };
  deviceInfo: Record<string, unknown>;
  sessionInfo: Record<string, unknown>;
  firebaseInfo: Record<string, unknown>;
}

export type TimeUnit = 'MINUTES' | 'HOUR' | 'DAY';
export type RestrictionType = 'STATE' | 'APP_ID' | 'IP' | 'USER_ID';

export interface TemplateInfo {
  templateCode: string;
  trafficSplit: number;
}



export type GetTemplateCatalogResponse = {
  buttonEnabled?: boolean;
  loadBalancingEnabled?: boolean;
  loadBalanceTemplates?: Record<string, TemplateInfo[]>;
  statusCode?: number;
  message?: string;
};

export interface TemplateUpdateDetails {
  buttonEnabled: boolean;
  loadBalancingEnabled: boolean;
  loadBalanceTemplates: Record<string, TemplateInfo[]>;
}

export interface TemplateUpdateRequest {
  aid: string;
  channel: string;
  communicationMode: string;
  defaultTemplateCode: string;
  updateDetails: TemplateUpdateDetails;
}

export interface TemplateCatalogRequest {
  aid: string;
  channel: string;
  communicationMode: string;
}

export interface CommunicationTemplate {
  appId: string;
  body: string;
  channel: 'WHATSAPP' | 'SMS';
  merchantName: string;
  templateType: 'SERVICE_IMPLICT' | 'SERVICE_EXPLICIT' | 'AUTHENTICATION';
  // SMS specific fields
  peId?: string;
  header?: string;
  // WhatsApp specific fields
  partnerAppId?: string;
  partnerAppToken?: string;
  whatsappNumber?: string;
  partnerName?: string;
  // Optional fields
  gatewayName?: string;
  templateId?: string;
}

export interface RateLimit {
  restrictionType: RestrictionType;
  status: 'ACTIVE' | 'INACTIVE';
  id: number;
  limits: {
    value: number;
    unit: TimeUnit;
    request: number;
  };
}

export interface MerchantConfig {
  type: string;
  value: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  inputValue: 'boolean' | 'Integer';
}