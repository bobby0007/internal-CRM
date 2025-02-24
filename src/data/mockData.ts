import { Merchant, Template } from '../types';

export const mockMerchants: Merchant[] = [
  {
    mid: 'MID123456',
    name: 'Sample Store',
    status: 'ACTIVE',
    internationalTxns: true,
    lastUpdated: new Date().toISOString(),
    transactionVolume: 50000,
  },
  {
    mid: 'MID001',
    name: 'Global Retail Solutions',
    status: 'ACTIVE',
    internationalTxns: true,
    lastUpdated: '2024-03-15T10:30:00Z',
    transactionVolume: 150000,
  },
  {
    mid: 'MID002',
    name: 'Tech Gadgets Store',
    status: 'BLOCK',
    internationalTxns: false,
    lastUpdated: '2024-03-14T15:45:00Z',
    transactionVolume: 75000,
  },
  {
    mid: 'MID003',
    name: 'Fashion Boutique Ltd',
    status: 'BLOCK',
    internationalTxns: false,
    lastUpdated: '2024-03-13T09:20:00Z',
    transactionVolume: 25000,
  }
];

export const mockTemplates: Template[] = [
  {
    dltPeId: 'DLT001',
    senderId: 'SENDER1',
    templateId: 'TEMP001',
    templateText: 'Your OTP for transaction is {#var#}. Valid for 5 minutes.',
    category: 'OTP',
    language: 'English',
  },
  {
    dltPeId: 'DLT002',
    senderId: 'SENDER2',
    templateId: 'TEMP002',
    templateText: 'Transaction of Rs.{#amount#} completed on your account ending {#account#}',
    category: 'Transaction',
    language: 'English',
  },
];