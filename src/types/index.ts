export interface TemplateCatalogRequest {
  aid: string;
  channel: 'OTP' | 'PROMOTIONAL' | 'TRANSACTIONAL';
  communicationMode: 'SMS' | 'EMAIL' | 'WHATSAPP';
}

export interface TemplateInfo {
  templateCode: string;
  trafficSplit: number;
}

export interface TemplateCatalogResponse {
  buttonEnabled: boolean;
  loadBalancingEnabled: boolean;
  loadBalanceTemplates: {
    [key: string]: TemplateInfo[];
  };
}
