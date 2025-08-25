import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { messagingService } from './MessagingService';
import type { MessageTemplate } from './types';

export const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    setTemplates(messagingService.getTemplates());
  }, []);

  const filteredTemplates = filterCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === filterCategory);

  const categories = [
    { value: 'all', label: 'Toutes les catégories', icon: '📋' },
    { value: 'general', label: 'Général', icon: '💬' },
    { value: 'academic', label: 'Académique', icon: '🎓' },
    { value: 'administrative', label: 'Administratif', icon: '📄' },
    { value: 'emergency', label: 'Urgence', icon: '🚨' },
  ];

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || '📝';
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.label || category;
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      const success = messagingService.deleteTemplate(templateId);
      if (success) {
        setTemplates(prev => prev.filter(t => t.id !== templateId));
        toast.success('Modèle supprimé avec succès');
      } else {
        toast.error('Erreur lors de la suppression du modèle');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="text-purple-600 mr-3">📝</span>
          Modèles de Messages
        </h1>
        <p className="text-gray-600 mt-2">
          Gérez vos modèles de messages pour faciliter l'envoi de communications récurrentes
        </p>
      </div>

      {/* Actions et filtres */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
          
          <span className="text-sm text-gray-500">
            {filteredTemplates.length} modèle(s)
          </span>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center"
        >
          <span className="mr-2">➕</span>
          Nouveau modèle
        </button>
      </div>

      {/* Liste des modèles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
            {/* En-tête du modèle */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getCategoryIcon(template.category)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <span className="text-sm text-gray-500">{getCategoryLabel(template.category)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingTemplate(template)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Modifier"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Supprimer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenu du modèle */}
            <div className="mb-4">
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                {template.content}
              </div>
            </div>

            {/* Variables */}
            {template.variables.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Variables:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map(variable => (
                    <span
                      key={variable}
                      className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                    >
                      {`{${variable}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* État vide */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterCategory === 'all' ? 'Aucun modèle disponible' : `Aucun modèle dans la catégorie "${getCategoryLabel(filterCategory)}"`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filterCategory === 'all' 
              ? 'Créez votre premier modèle pour commencer'
              : 'Essayez de changer de catégorie ou créez un nouveau modèle'
            }
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Créer un modèle
          </button>
        </div>
      )}

      {/* Modal de création/édition */}
      {(isCreateModalOpen || editingTemplate) && (
        <TemplateModal
          template={editingTemplate}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingTemplate(null);
          }}
          onSave={(template) => {
            if (editingTemplate) {
              // Mise à jour
              setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
              toast.success('Modèle modifié avec succès');
            } else {
              // Création
              const newTemplate = messagingService.addTemplate(template);
              setTemplates(prev => [newTemplate, ...prev]);
              toast.success('Modèle créé avec succès');
            }
            setIsCreateModalOpen(false);
            setEditingTemplate(null);
          }}
        />
      )}
    </div>
  );
};

// Modal pour créer/éditer un modèle
interface TemplateModalProps {
  template: MessageTemplate | null;
  onClose: () => void;
  onSave: (template: Omit<MessageTemplate, 'id'>) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ template, onClose, onSave }) => {
  const [name, setName] = useState(template?.name || '');
  const [content, setContent] = useState(template?.content || '');
  const [category, setCategory] = useState<MessageTemplate['category']>(template?.category || 'general');
  const [variables, setVariables] = useState<string[]>(template?.variables || []);
  const [newVariable, setNewVariable] = useState('');

  const availableVariables = [
    'firstName', 'lastName', 'subject', 'time', 'date', 'phone', 
    'amount', 'term', 'dueDate', 'parentName', 'studentName'
  ];

  const addVariable = (variable: string) => {
    if (variable && !variables.includes(variable)) {
      setVariables(prev => [...prev, variable]);
      setNewVariable('');
    }
  };

  const removeVariable = (variable: string) => {
    setVariables(prev => prev.filter(v => v !== variable));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !content.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onSave({
      name: name.trim(),
      content: content.trim(),
      category,
      variables,
    });
  };

  const categories = [
    { value: 'general', label: 'Général', icon: '💬' },
    { value: 'academic', label: 'Académique', icon: '🎓' },
    { value: 'administrative', label: 'Administratif', icon: '📄' },
    { value: 'emergency', label: 'Urgence', icon: '🚨' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {template ? 'Modifier le modèle' : 'Nouveau modèle'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du modèle *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Ex: Rappel de cours"
                required
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MessageTemplate['category'])}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenu du message *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Tapez votre message ici... Utilisez {variable} pour les variables"
                required
              />
              <div className="text-sm text-gray-500 mt-1">
                {content.length} caractères
              </div>
            </div>

            {/* Variables */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Variables
              </label>
              
              {/* Variables actuelles */}
              {variables.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {variables.map(variable => (
                      <span
                        key={variable}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {`{${variable}}`}
                        <button
                          type="button"
                          onClick={() => removeVariable(variable)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ajouter des variables */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableVariables.filter(v => !variables.includes(v)).map(variable => (
                  <button
                    key={variable}
                    type="button"
                    onClick={() => addVariable(variable)}
                    className="text-left bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    {`{${variable}}`}
                  </button>
                ))}
              </div>

              {/* Variable personnalisée */}
              <div className="mt-3 flex">
                <input
                  type="text"
                  value={newVariable}
                  onChange={(e) => setNewVariable(e.target.value)}
                  placeholder="Variable personnalisée..."
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => addVariable(newVariable)}
                  disabled={!newVariable.trim() || variables.includes(newVariable)}
                  className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-4 py-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {template ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};