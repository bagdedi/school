import React, { useState, useEffect } from 'react';
import { messagingService } from './MessagingService';
import type { MessageTemplate } from './types';

interface MessageComposerProps {
  messageContent: string;
  onMessageChange: (content: string) => void;
  messageType: 'sms' | 'whatsapp' | 'facebook';
  onTypeChange: (type: 'sms' | 'whatsapp' | 'facebook') => void;
  selectedTemplate: MessageTemplate | null;
  onTemplateChange: (template: MessageTemplate | null) => void;
  onSend: () => void;
  sending: boolean;
  recipientCount: number;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  messageContent,
  onMessageChange,
  messageType,
  onTypeChange,
  selectedTemplate,
  onTemplateChange,
  onSend,
  sending,
  recipientCount,
}) => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showVariableHelper, setShowVariableHelper] = useState(false);

  useEffect(() => {
    setTemplates(messagingService.getTemplates());
  }, []);

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === '') {
      onTemplateChange(null);
      return;
    }
    
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onTemplateChange(template);
      onMessageChange(template.content);
      setShowVariableHelper(template.variables.length > 0);
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('message-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = messageContent.substring(0, start) + `{${variable}}` + messageContent.substring(end);
      onMessageChange(newContent);
      
      // Remettre le focus et la position du curseur
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2);
      }, 0);
    }
  };

  const getCharacterCount = () => {
    if (messageType === 'sms') {
      const maxSMS = 160;
      const messageCount = Math.ceil(messageContent.length / maxSMS);
      return {
        count: messageContent.length,
        max: maxSMS,
        messages: messageCount,
        isOverLimit: messageContent.length > maxSMS
      };
    }
    return {
      count: messageContent.length,
      max: 4096, // Limite généralement acceptée pour WhatsApp/Facebook
      messages: 1,
      isOverLimit: messageContent.length > 4096
    };
  };

  const charInfo = getCharacterCount();

  const getServiceIcon = (type: 'sms' | 'whatsapp' | 'facebook') => {
    switch (type) {
      case 'sms':
        return '📱';
      case 'whatsapp':
        return '📞';
      case 'facebook':
        return '💬';
      default:
        return '📧';
    }
  };

  const getServiceColor = (type: 'sms' | 'whatsapp' | 'facebook') => {
    switch (type) {
      case 'sms':
        return 'blue';
      case 'whatsapp':
        return 'green';
      case 'facebook':
        return 'indigo';
      default:
        return 'gray';
    }
  };

  const serviceColor = getServiceColor(messageType);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="text-purple-600 mr-2">✏️</span>
        Composer le message
      </h3>

      {/* Type de message */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Service de messagerie
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['sms', 'whatsapp', 'facebook'] as const).map((type) => {
            const color = getServiceColor(type);
            const isSelected = messageType === type;
            
            return (
              <label key={type} className="cursor-pointer">
                <input
                  type="radio"
                  value={type}
                  checked={isSelected}
                  onChange={(e) => onTypeChange(e.target.value as any)}
                  className="sr-only"
                />
                <div className={`
                  relative p-3 rounded-lg border-2 transition-all
                  ${isSelected 
                    ? `border-${color}-500 bg-${color}-50` 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}>
                  <div className="text-center">
                    <div className="text-2xl mb-1">{getServiceIcon(type)}</div>
                    <div className={`text-sm font-medium ${
                      isSelected ? `text-${color}-700` : 'text-gray-700'
                    }`}>
                      {type === 'sms' ? 'SMS' : type === 'whatsapp' ? 'WhatsApp' : 'Facebook'}
                    </div>
                  </div>
                  {isSelected && (
                    <div className={`absolute top-1 right-1 w-3 h-3 bg-${color}-500 rounded-full`}></div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Modèles */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Modèle de message (optionnel)
          </label>
          <button
            onClick={() => setShowVariableHelper(!showVariableHelper)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showVariableHelper ? 'Masquer l\'aide' : 'Aide variables'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes les catégories</option>
            <option value="general">Général</option>
            <option value="academic">Académique</option>
            <option value="administrative">Administratif</option>
            <option value="emergency">Urgence</option>
          </select>
          
          <select
            value={selectedTemplate?.id || ''}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Aucun modèle</option>
            {filteredTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zone de texte */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          id="message-content"
          value={messageContent}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Tapez votre message ici..."
          rows={6}
          className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-none ${
            charInfo.isOverLimit ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        
        {/* Informations sur les caractères */}
        <div className="flex justify-between items-center mt-2 text-sm">
          <div className={charInfo.isOverLimit ? 'text-red-600' : 'text-gray-500'}>
            {charInfo.count} caractères
            {messageType === 'sms' && (
              <span className="ml-2">
                ({charInfo.messages} SMS{charInfo.messages > 1 ? '' : ''})
              </span>
            )}
          </div>
          {charInfo.isOverLimit && (
            <div className="text-red-600 text-xs">
              ⚠️ Limite dépassée
            </div>
          )}
        </div>
      </div>

      {/* Variables disponibles */}
      {showVariableHelper && selectedTemplate && selectedTemplate.variables.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
            <span className="mr-2">🏷️</span>
            Variables disponibles pour ce modèle:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {selectedTemplate.variables.map(variable => (
              <button
                key={variable}
                onClick={() => insertVariable(variable)}
                className="bg-blue-100 text-blue-800 px-3 py-2 rounded-md text-sm hover:bg-blue-200 transition-colors"
              >
                {`{${variable}}`}
              </button>
            ))}
          </div>
          <div className="text-xs text-blue-700 mt-2">
            💡 Cliquez sur une variable pour l'insérer dans votre message
          </div>
        </div>
      )}

      {/* Aperçu du coût estimé (pour SMS) */}
      {messageType === 'sms' && recipientCount > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-md">
          <div className="text-sm text-yellow-800">
            <span className="font-medium">Estimation coût:</span>
            <span className="ml-2">
              {recipientCount} destinataire(s) × {charInfo.messages} SMS = {recipientCount * charInfo.messages} SMS total
            </span>
          </div>
        </div>
      )}

      {/* Bouton d'envoi */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {recipientCount > 0 ? (
            <span className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 bg-${serviceColor}-500`}></span>
              Prêt à envoyer via {messageType === 'sms' ? 'SMS' : messageType === 'whatsapp' ? 'WhatsApp' : 'Facebook'} à {recipientCount} contact(s)
            </span>
          ) : (
            'Sélectionnez des contacts pour envoyer'
          )}
        </div>
        <button
          onClick={onSend}
          disabled={sending || !messageContent.trim() || recipientCount === 0 || charInfo.isOverLimit}
          className={`px-6 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            sending 
              ? 'bg-gray-400 text-white'
              : `bg-${serviceColor}-600 text-white hover:bg-${serviceColor}-700`
          }`}
        >
          {sending ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi...
            </span>
          ) : (
            `Envoyer (${recipientCount})`
          )}
        </button>
      </div>
    </div>
  );
};