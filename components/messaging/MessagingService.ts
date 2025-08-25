import axios from 'axios';
import type { Student, Teacher } from '../../types';
import type { Contact, MessageTemplate, Message, MessagingService } from './types';

// Configuration des services de messagerie
export const messagingConfig: MessagingService[] = [
  {
    name: 'SMS Service',
    type: 'sms',
    enabled: true,
    apiKey: process.env.REACT_APP_SMS_API_KEY || '',
    apiSecret: process.env.REACT_APP_SMS_API_SECRET || '',
  },
  {
    name: 'WhatsApp Business',
    type: 'whatsapp',
    enabled: true,
    apiKey: process.env.REACT_APP_WHATSAPP_API_KEY || '',
    apiSecret: process.env.REACT_APP_WHATSAPP_API_SECRET || '',
  },
  {
    name: 'Facebook Messenger',
    type: 'facebook',
    enabled: false,
    apiKey: process.env.REACT_APP_FACEBOOK_API_KEY || '',
    apiSecret: process.env.REACT_APP_FACEBOOK_API_SECRET || '',
  },
];

// Classe principale pour la gestion des messages
export class MessagingServiceClass {
  private messages: Message[] = [];
  private templates: MessageTemplate[] = [
    {
      id: '1',
      name: 'Rappel de cours',
      content: 'Bonjour {firstName}, n\'oubliez pas votre cours de {subject} aujourd\'hui à {time}.',
      variables: ['firstName', 'subject', 'time'],
      category: 'academic',
    },
    {
      id: '2',
      name: 'Absence justifiée',
      content: 'Bonjour {firstName}, votre absence du {date} a été enregistrée. Merci de nous contacter pour plus d\'informations.',
      variables: ['firstName', 'date'],
      category: 'administrative',
    },
    {
      id: '3',
      name: 'Message urgent',
      content: 'MESSAGE URGENT: {message}. Merci de nous contacter immédiatement au {phone}.',
      variables: ['message', 'phone'],
      category: 'emergency',
    },
    {
      id: '4',
      name: 'Convocation parent',
      content: 'Madame/Monsieur {parentName}, nous vous prions de bien vouloir vous présenter à l\'établissement le {date} à {time} concernant votre enfant {studentName}.',
      variables: ['parentName', 'date', 'time', 'studentName'],
      category: 'administrative',
    },
    {
      id: '5',
      name: 'Résultats disponibles',
      content: 'Bonjour {firstName}, vos résultats pour le {term} sont maintenant disponibles. Consultez votre espace étudiant pour plus de détails.',
      variables: ['firstName', 'term'],
      category: 'academic',
    },
    {
      id: '6',
      name: 'Paiement en attente',
      content: 'Bonjour {firstName}, nous vous rappelons que votre paiement de {amount} FCFA pour {term} est en attente. Date limite: {dueDate}.',
      variables: ['firstName', 'amount', 'term', 'dueDate'],
      category: 'administrative',
    },
  ];

  // Convertir les étudiants en contacts
  convertStudentsToContacts(students: Student[]): Contact[] {
    return students.map(student => ({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      phone: student.phone || student.parentPhone || '',
      email: student.email || student.parentEmail,
      type: 'student' as const,
      avatar: student.avatar,
    })).filter(contact => contact.phone); // Filtrer ceux qui ont un numéro
  }

  // Convertir les enseignants en contacts
  convertTeachersToContacts(teachers: Teacher[]): Contact[] {
    return teachers.map(teacher => ({
      id: teacher.id,
      name: `${teacher.firstName} ${teacher.lastName}`,
      phone: teacher.phone,
      email: teacher.email,
      type: 'teacher' as const,
      avatar: teacher.avatar,
    })).filter(contact => contact.phone); // Filtrer ceux qui ont un numéro
  }

  // Obtenir tous les modèles
  getTemplates(): MessageTemplate[] {
    return this.templates;
  }

  // Obtenir les modèles par catégorie
  getTemplatesByCategory(category: string): MessageTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  // Ajouter un nouveau modèle
  addTemplate(template: Omit<MessageTemplate, 'id'>): MessageTemplate {
    const newTemplate: MessageTemplate = {
      ...template,
      id: Date.now().toString(),
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  // Supprimer un modèle
  deleteTemplate(templateId: string): boolean {
    const index = this.templates.findIndex(t => t.id === templateId);
    if (index > -1) {
      this.templates.splice(index, 1);
      return true;
    }
    return false;
  }

  // Remplacer les variables dans un message
  replaceVariables(content: string, variables: Record<string, string>): string {
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return result;
  }

  // Envoyer un SMS
  async sendSMS(phone: string, message: string): Promise<boolean> {
    try {
      const smsConfig = messagingConfig.find(config => config.type === 'sms' && config.enabled);
      if (!smsConfig || !smsConfig.apiKey) {
        throw new Error('SMS service not configured');
      }

      // Simulation d'envoi SMS - remplacer par l'API réelle
      console.log(`Sending SMS to ${phone}: ${message}`);
      
      // Exemple avec Twilio (décommentez et configurez selon votre provider)
      /*
      const response = await axios.post('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
        To: phone,
        From: 'YOUR_TWILIO_PHONE_NUMBER',
        Body: message,
      }, {
        auth: {
          username: smsConfig.apiKey,
          password: smsConfig.apiSecret || '',
        },
      });
      */

      // Simulation de succès (remplacez par la vraie logique)
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Math.random() > 0.1; // 90% de succès simulé
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  // Envoyer un message WhatsApp
  async sendWhatsApp(phone: string, message: string): Promise<boolean> {
    try {
      const whatsappConfig = messagingConfig.find(config => config.type === 'whatsapp' && config.enabled);
      if (!whatsappConfig || !whatsappConfig.apiKey) {
        throw new Error('WhatsApp service not configured');
      }

      // Simulation d'envoi WhatsApp - remplacer par l'API réelle
      console.log(`Sending WhatsApp to ${phone}: ${message}`);
      
      // Exemple avec WhatsApp Business API (décommentez et configurez)
      /*
      const response = await axios.post(`https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages`, {
        messaging_product: 'whatsapp',
        to: phone,
        text: { body: message },
      }, {
        headers: {
          'Authorization': `Bearer ${whatsappConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      */

      // Simulation de succès
      await new Promise(resolve => setTimeout(resolve, 1500));
      return Math.random() > 0.05; // 95% de succès simulé
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      return false;
    }
  }

  // Envoyer un message Facebook
  async sendFacebook(recipientId: string, message: string): Promise<boolean> {
    try {
      const facebookConfig = messagingConfig.find(config => config.type === 'facebook' && config.enabled);
      if (!facebookConfig || !facebookConfig.apiKey) {
        throw new Error('Facebook service not configured');
      }

      // Simulation d'envoi Facebook - remplacer par l'API réelle
      console.log(`Sending Facebook message to ${recipientId}: ${message}`);
      
      // Exemple avec Facebook Messenger API (décommentez et configurez)
      /*
      const response = await axios.post('https://graph.facebook.com/v18.0/me/messages', {
        recipient: { id: recipientId },
        message: { text: message },
      }, {
        headers: {
          'Authorization': `Bearer ${facebookConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      */

      // Simulation de succès
      await new Promise(resolve => setTimeout(resolve, 2000));
      return Math.random() > 0.15; // 85% de succès simulé
    } catch (error) {
      console.error('Error sending Facebook message:', error);
      return false;
    }
  }

  // Envoyer un message à un contact
  async sendMessage(
    contact: Contact, 
    content: string, 
    type: 'sms' | 'whatsapp' | 'facebook'
  ): Promise<Message> {
    const message: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      recipientId: contact.id,
      recipientName: contact.name,
      recipientPhone: contact.phone,
      content,
      type,
      status: 'pending',
      sentAt: new Date().toISOString(),
    };

    this.messages.push(message);

    try {
      let success = false;
      
      switch (type) {
        case 'sms':
          success = await this.sendSMS(contact.phone, content);
          break;
        case 'whatsapp':
          success = await this.sendWhatsApp(contact.phone, content);
          break;
        case 'facebook':
          success = await this.sendFacebook(contact.id, content);
          break;
      }

      message.status = success ? 'sent' : 'failed';
      if (success) {
        // Simulation du délai de livraison
        setTimeout(() => {
          message.deliveredAt = new Date().toISOString();
          message.status = 'delivered';
        }, Math.random() * 5000 + 2000);
      } else {
        message.errorMessage = `Failed to send ${type} message`;
      }
    } catch (error) {
      message.status = 'failed';
      message.errorMessage = error instanceof Error ? error.message : 'Unknown error';
    }

    return message;
  }

  // Envoyer des messages en masse
  async sendBulkMessages(
    contacts: Contact[], 
    content: string, 
    type: 'sms' | 'whatsapp' | 'facebook'
  ): Promise<Message[]> {
    const promises = contacts.map(contact => this.sendMessage(contact, content, type));
    return Promise.all(promises);
  }

  // Obtenir l'historique des messages
  getMessages(): Message[] {
    return this.messages.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }

  // Obtenir les messages par statut
  getMessagesByStatus(status: Message['status']): Message[] {
    return this.messages.filter(m => m.status === status);
  }

  // Obtenir les messages par type
  getMessagesByType(type: Message['type']): Message[] {
    return this.messages.filter(m => m.type === type);
  }

  // Obtenir les statistiques
  getStats(): {
    totalSent: number;
    totalDelivered: number;
    totalFailed: number;
    smsCount: number;
    whatsappCount: number;
    facebookCount: number;
  } {
    return {
      totalSent: this.messages.filter(m => m.status !== 'pending').length,
      totalDelivered: this.messages.filter(m => m.status === 'delivered').length,
      totalFailed: this.messages.filter(m => m.status === 'failed').length,
      smsCount: this.messages.filter(m => m.type === 'sms').length,
      whatsappCount: this.messages.filter(m => m.type === 'whatsapp').length,
      facebookCount: this.messages.filter(m => m.type === 'facebook').length,
    };
  }

  // Supprimer un message
  deleteMessage(messageId: string): boolean {
    const index = this.messages.findIndex(m => m.id === messageId);
    if (index > -1) {
      this.messages.splice(index, 1);
      return true;
    }
    return false;
  }

  // Marquer un message comme lu
  markMessageAsRead(messageId: string): boolean {
    const message = this.messages.find(m => m.id === messageId);
    if (message && message.status === 'delivered') {
      // Vous pouvez ajouter un champ 'read' si nécessaire
      return true;
    }
    return false;
  }
}

// Instance singleton
export const messagingService = new MessagingServiceClass();