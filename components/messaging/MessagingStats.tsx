import React, { useState, useEffect } from 'react';
import { messagingService } from './MessagingService';

export const MessagingStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalSent: 0,
    totalDelivered: 0,
    totalFailed: 0,
    smsCount: 0,
    whatsappCount: 0,
    facebookCount: 0,
  });

  useEffect(() => {
    const updateStats = () => {
      setStats(messagingService.getStats());
    };

    updateStats();
    
    // Mettre à jour les statistiques toutes les 30 secondes
    const interval = setInterval(updateStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const deliveryRate = stats.totalSent > 0 ? Math.round((stats.totalDelivered / stats.totalSent) * 100) : 0;
  const failureRate = stats.totalSent > 0 ? Math.round((stats.totalFailed / stats.totalSent) * 100) : 0;

  const statCards = [
    {
      title: 'Messages envoyés',
      value: stats.totalSent,
      icon: '📤',
      color: 'blue',
      trend: '+12%',
    },
    {
      title: 'Messages livrés',
      value: stats.totalDelivered,
      icon: '✅',
      color: 'green',
      trend: `${deliveryRate}%`,
    },
    {
      title: 'Échecs',
      value: stats.totalFailed,
      icon: '❌',
      color: 'red',
      trend: `${failureRate}%`,
    },
    {
      title: 'Taux de livraison',
      value: `${deliveryRate}%`,
      icon: '📊',
      color: 'purple',
      trend: deliveryRate >= 95 ? 'Excellent' : deliveryRate >= 85 ? 'Bon' : 'À améliorer',
    },
  ];

  const serviceStats = [
    {
      name: 'SMS',
      count: stats.smsCount,
      icon: '📱',
      color: 'blue',
      percentage: stats.totalSent > 0 ? Math.round((stats.smsCount / stats.totalSent) * 100) : 0,
    },
    {
      name: 'WhatsApp',
      count: stats.whatsappCount,
      icon: '📞',
      color: 'green',
      percentage: stats.totalSent > 0 ? Math.round((stats.whatsappCount / stats.totalSent) * 100) : 0,
    },
    {
      name: 'Facebook',
      count: stats.facebookCount,
      icon: '💬',
      color: 'indigo',
      percentage: stats.totalSent > 0 ? Math.round((stats.facebookCount / stats.totalSent) * 100) : 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.title === 'Échecs' 
                  ? stats.totalFailed === 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                  : 'text-green-600'
              }`}>
                {stat.trend}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                {stat.title === 'Taux de livraison' ? '' : 'vs période précédente'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Répartition par service */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="text-indigo-600 mr-2">📈</span>
          Répartition par service de messagerie
        </h3>
        
        {stats.totalSent === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <div className="font-medium">Aucune donnée disponible</div>
            <div className="text-sm">Envoyez des messages pour voir les statistiques</div>
          </div>
        ) : (
          <div className="space-y-4">
            {serviceStats.map((service, index) => (
              <div key={index} className="flex items-center">
                <div className="flex items-center w-24">
                  <span className="text-lg mr-2">{service.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{service.name}</span>
                </div>
                
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${service.color}-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 w-20">
                  <span className="text-sm font-semibold text-gray-900">
                    {service.count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({service.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Indicateurs de statut des services */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="text-green-600 mr-2">🟢</span>
          État des services
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-2">📱</span>
              <span className="font-medium text-blue-900">SMS</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-blue-700">Actif</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-2">📞</span>
              <span className="font-medium text-green-900">WhatsApp</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-700">Actif</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-2">💬</span>
              <span className="font-medium text-gray-900">Facebook</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Inactif</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <span className="text-blue-600 mr-2 mt-0.5">💡</span>
            <div className="text-sm text-blue-800">
              <span className="font-medium">Conseil:</span>
              <span className="ml-1">
                Pour activer Facebook Messenger, configurez les clés API dans les paramètres de l'application.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};