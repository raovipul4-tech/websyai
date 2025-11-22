export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  direction: MessageDirection;
  status: 'sent' | 'delivered' | 'read';
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  avatar: string;
  tags: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

export interface Template {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  content: string;
}

export interface AnalyticsData {
  name: string;
  sent: number;
  delivered: number;
  read: number;
}

export interface MetaCredentials {
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
  verified: boolean;
}

export interface AutomationRule {
  id: string;
  keyword: string;
  response: string;
  matchType: 'EXACT' | 'CONTAINS';
  isActive: boolean;
}