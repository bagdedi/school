import React, { useState, useMemo } from 'react';
import type { Message } from './types';

interface MessageHistoryProps {
  messages: Message[];
}

export const MessageHistory: React.FC<MessageHistoryProps> = ({ messages }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | Message['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Message['type']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'recipient'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedMessages = useMemo(() => {
    let filtered = messages.filter(message => {
      const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
      const matchesType = filterType === 'all' || message.type === filterType;
      const matchesSearch = searchTerm === '' || 
        message.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.recipientPhone.includes(searchTerm) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesType && matchesSearch;
    });

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'recipient':
          comparison = a.recipientName.localeCompare(b.recipientName);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [messages, filterStatus, filterType, searchTerm, sortBy, sortOrder]);

  const getStatusBadge = (status: Message['status']) => {
    const badges = {
      pending: { color: 'yellow', text: 'En attente', icon: '⏳' },
      sent: { color: 'blue', text: 'Envoyé', icon: '📤' },
      delivered: { color: 'green', text: 'Livré', icon: '✅' },
      failed: { color: 'red', text: 'Échec', icon: '❌' },
    };
    
    const badge = badges[status];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-800`}>
        <span className="mr-1">{badge.icon}</span>
        {badge.text}
      </span>
    );
  };

  const getTypeBadge = (type: Message['type']) => {
    const badges = {
      sms: { color: 'blue', text: 'SMS', icon: '📱' },
      whatsapp: { color: 'green', text: 'WhatsApp', icon: '📞' },
      facebook: { color: 'indigo', text: 'Facebook', icon: '💬' },
    };
    
    const badge = badges[type];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-800`}>
        <span className="mr-1">{badge.icon}</span>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = useMemo(() => {
    return {
      total: messages.length,
      pending: messages.filter(m => m.status === 'pending').length,
      sent: messages.filter(m => m.status === 'sent').length,
      delivered: messages.filter(m => m.status === 'delivered').length,
      failed: messages.filter(m => m.status === 'failed').length,
    };
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="text-gray-600 mr-2">📋</span>
          Historique des messages
          <span className="ml-2 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
            {filteredAndSortedMessages.length}
          </span>
        </h3>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-lg font-semibold text-yellow-800">{stats.pending}</div>
            <div className="text-xs text-yellow-600">En attente</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-lg font-semibold text-blue-800">{stats.sent}</div>
            <div className="text-xs text-blue-600">Envoyés</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-lg font-semibold text-green-800">{stats.delivered}</div>
            <div className="text-xs text-green-600">Livrés</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-lg font-semibold text-red-800">{stats.failed}</div>
            <div className="text-xs text-red-600">Échecs</div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="sent">Envoyé</option>
              <option value="delivered">Livré</option>
              <option value="failed">Échec</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tri</label>
            <div className="flex">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Date</option>
                <option value="status">Statut</option>
                <option value="recipient">Destinataire</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="border border-l-0 border-gray-300 rounded-r-md px-2 py-2 text-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <input
              type="text"
              placeholder="Destinataire ou message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Liste des messages */}
      <div className="border-t border-gray-200">
        {filteredAndSortedMessages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <div className="font-medium">Aucun message trouvé</div>
            <div className="text-sm">Aucun message ne correspond aux critères de filtrage.</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredAndSortedMessages.map((message) => (
              <div key={message.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeBadge(message.type)}
                      {getStatusBadge(message.status)}
                      <span className="text-sm text-gray-500">
                        {formatDate(message.sentAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {message.recipientName}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({message.recipientPhone})
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-700 line-clamp-2">
                      {message.content}
                    </div>
                    
                    {message.errorMessage && (
                      <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                        ❌ {message.errorMessage}
                      </div>
                    )}
                    
                    {message.deliveredAt && (
                      <div className="mt-1 text-xs text-green-600">
                        ✅ Livré le {formatDate(message.deliveredAt)}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};