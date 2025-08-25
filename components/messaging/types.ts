// --- MESSAGING SYSTEM TYPES ---
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: 'student' | 'teacher';
  avatar?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[]; // Variables like {firstName}, {lastName}, etc.
  category: 'general' | 'academic' | 'administrative' | 'emergency';
}

export interface Message {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientPhone: string;
  content: string;
  type: 'sms' | 'whatsapp' | 'facebook';
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
}

export interface MessagingService {
  name: string;
  type: 'sms' | 'whatsapp' | 'facebook';
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
}

export interface MessagingStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  smsCount: number;
  whatsappCount: number;
  facebookCount: number;
}

export interface BulkMessageRequest {
  recipients: Contact[];
  message: string;
  type: 'sms' | 'whatsapp' | 'facebook';
  templateId?: string;
  scheduledFor?: string;
}