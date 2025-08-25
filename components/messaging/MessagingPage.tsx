import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { messagingService } from './MessagingService';
import { ContactSelector } from './ContactSelector';
import { MessageComposer } from './MessageComposer';
import { MessageHistory } from './MessageHistory';
import { MessagingStats } from './MessagingStats';
import type { Student, Teacher } from '../../types';
import type { Contact, MessageTemplate, Message } from './types';

export interface MessagingPageProps {
  students: Student[];
  teachers: Teacher[];
}

export const MessagingPage: React.FC<MessagingPageProps> = ({ students, teachers }) => {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [messageType, setMessageType] = useState<'sms' | 'whatsapp' | 'facebook'>('sms');
  const [messageContent, setMessageContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'stats'>('compose');

  // Convertir les utilisateurs en contacts
  const allContacts = React.useMemo(() => [
    ...messagingService.convertStudentsToContacts(students),
    ...messagingService.convertTeachersToContacts(teachers),
  ], [students, teachers]);

  // Charger l'historique des messages au montage du composant
  useEffect(() => {
    setMessages(messagingService.getMessages());
  }, []);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      toast.error('Veuillez saisir un message');
      return;
    }

    if (selectedContacts.length === 0) {
      toast.error('Veuillez sélectionner au moins un destinataire');
      return;
    }

    setSending(true);
    
    try {
      toast.loading(`Envoi en cours à ${selectedContacts.length} contact(s)...`, { id: 'sending' });
      
      const sentMessages = await messagingService.sendBulkMessages(
        selectedContacts,
        messageContent,
        messageType
      );
      
      // Mettre à jour la liste des messages
      setMessages(prev => [...sentMessages, ...prev]);
      
      // Statistiques des envois
      const successCount = sentMessages.filter(m => m.status === 'sent' || m.status === 'delivered').length;
      const failureCount = sentMessages.filter(m => m.status === 'failed').length;
      
      toast.dismiss('sending');
      
      if (failureCount === 0) {
        toast.success(`🎉 ${successCount} message(s) envoyé(s) avec succès!`);
      } else if (successCount > 0) {
        toast.success(`${successCount} message(s) envoyé(s), ${failureCount} échec(s)`);
      } else {
        toast.error(`❌ Échec de l'envoi de tous les messages`);
      }
      
      // Réinitialiser le formulaire
      setMessageContent('');
      setSelectedContacts([]);
      setSelectedTemplate(null);
      
    } catch (error) {
      console.error('Error sending messages:', error);
      toast.dismiss('sending');
      toast.error('Erreur lors de l\'envoi des messages');
    } finally {
      setSending(false);
    }
  };

  const handleTemplateChange = (template: MessageTemplate | null) => {
    setSelectedTemplate(template);
    if (template) {
      // Montrer un exemple de remplacement des variables
      let exampleContent = template.content;
      template.variables.forEach(variable => {
        switch (variable) {
          case 'firstName':
            exampleContent = exampleContent.replace(`{${variable}}`, 'Jean');
            break;
          case 'lastName':
            exampleContent = exampleContent.replace(`{${variable}}`, 'Dupont');
            break;
          case 'subject':
            exampleContent = exampleContent.replace(`{${variable}}`, 'Mathématiques');
            break;
          case 'time':
            exampleContent = exampleContent.replace(`{${variable}}`, '14h00');
            break;
          case 'date':
            exampleContent = exampleContent.replace(`{${variable}}`, new Date().toLocaleDateString('fr-FR'));
            break;
          case 'phone':
            exampleContent = exampleContent.replace(`{${variable}}`, '+33 1 23 45 67 89');
            break;
          case 'amount':
            exampleContent = exampleContent.replace(`{${variable}}`, '50000');
            break;
          case 'term':
            exampleContent = exampleContent.replace(`{${variable}}`, 'Trimestre 1');
            break;
          case 'dueDate':
            exampleContent = exampleContent.replace(`{${variable}}`, '31/12/2024');
            break;
          default:
            // Garder la variable telle quelle si on ne sait pas comment la remplacer
            break;
        }
      });
      setMessageContent(exampleContent);
    }
  };

  const tabs = [
    { id: 'compose', name: 'Composer', icon: '✏️' },
    { id: 'history', name: 'Historique', icon: '📋' },
    { id: 'stats', name: 'Statistiques', icon: '📊' },
  ] as const;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="text-blue-600 mr-3">💬</span>
          Centre de Messagerie
        </h1>
        <p className="text-gray-600 mt-2">
          Envoyez des SMS, messages WhatsApp ou Facebook aux étudiants et enseignants connectés
        </p>
        
        {/* Statistiques rapides dans l'en-tête */}
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-gray-600">{students.length} étudiants disponibles</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-gray-600">{teachers.length} enseignants disponibles</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            <span className="text-gray-600">{allContacts.length} contacts avec numéro</span>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sélection des contacts */}
          <div className="lg:col-span-1">
            <ContactSelector
              contacts={allContacts}
              selectedContacts={selectedContacts}
              onSelectionChange={setSelectedContacts}
            />
          </div>

          {/* Composition du message */}
          <div className="lg:col-span-2">
            <MessageComposer
              messageContent={messageContent}
              onMessageChange={setMessageContent}
              messageType={messageType}
              onTypeChange={setMessageType}
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
              onSend={handleSendMessage}
              sending={sending}
              recipientCount={selectedContacts.length}
            />
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <MessageHistory messages={messages} />
      )}

      {activeTab === 'stats' && (
        <MessagingStats />
      )}

      {/* Alertes et notifications */}
      {allContacts.length === 0 && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Aucun contact disponible</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Assurez-vous que les étudiants et enseignants ont des numéros de téléphone renseignés dans leurs profils.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Aide rapide */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-blue-600 mr-2 mt-0.5">💡</span>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Conseils d'utilisation</h3>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Utilisez les modèles pour gagner du temps et assurer la cohérence</li>
              <li>• Les variables comme {'{firstName}'} seront automatiquement remplacées</li>
              <li>• SMS: limité à 160 caractères, WhatsApp/Facebook: jusqu'à 4096 caractères</li>
              <li>• Vérifiez l'historique pour suivre le statut de livraison des messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};