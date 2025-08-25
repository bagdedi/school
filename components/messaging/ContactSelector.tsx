import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import type { Contact } from './types';

interface ContactSelectorProps {
  contacts: Contact[];
  selectedContacts: Contact[];
  onSelectionChange: (contacts: Contact[]) => void;
}

export const ContactSelector: React.FC<ContactSelectorProps> = ({
  contacts,
  selectedContacts,
  onSelectionChange,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'student' | 'teacher'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesType = filterType === 'all' || contact.type === filterType;
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.phone.includes(searchTerm) ||
                           (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [contacts, filterType, searchTerm]);

  const contactOptions = useMemo(() => {
    return filteredContacts.map(contact => ({
      value: contact.id,
      label: `${contact.name} (${contact.phone})`,
      contact,
    }));
  }, [filteredContacts]);

  const selectedOptions = useMemo(() => {
    return contactOptions.filter(option => 
      selectedContacts.some(selected => selected.id === option.value)
    );
  }, [contactOptions, selectedContacts]);

  const handleSelectAll = () => {
    onSelectionChange(filteredContacts);
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  const handleSelectByType = (type: 'student' | 'teacher') => {
    const contactsOfType = filteredContacts.filter(contact => contact.type === type);
    const newSelection = [...selectedContacts];
    
    contactsOfType.forEach(contact => {
      if (!newSelection.some(selected => selected.id === contact.id)) {
        newSelection.push(contact);
      }
    });
    
    onSelectionChange(newSelection);
  };

  const studentCount = filteredContacts.filter(c => c.type === 'student').length;
  const teacherCount = filteredContacts.filter(c => c.type === 'teacher').length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="text-blue-600 mr-2">👥</span>
        Sélectionner les destinataires
      </h3>
      
      {/* Statistiques rapides */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{contacts.length}</div>
            <div className="text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">{studentCount}</div>
            <div className="text-gray-600">Étudiants</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">{teacherCount}</div>
            <div className="text-gray-600">Enseignants</div>
          </div>
        </div>
      </div>
      
      {/* Filtres */}
      <div className="mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de contact
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous ({contacts.length})</option>
            <option value="student">Étudiants ({studentCount})</option>
            <option value="teacher">Enseignants ({teacherCount})</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rechercher
          </label>
          <input
            type="text"
            placeholder="Nom, téléphone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Sélecteur multiple */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contacts 
          <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            {selectedContacts.length} sélectionnés
          </span>
        </label>
        <Select
          isMulti
          options={contactOptions}
          value={selectedOptions}
          onChange={(selected) => {
            const contacts = (selected || []).map(option => option.contact);
            onSelectionChange(contacts);
          }}
          placeholder="Sélectionner les contacts..."
          className="mb-2"
          classNamePrefix="select"
          noOptionsMessage={() => "Aucun contact trouvé"}
          loadingMessage={() => "Chargement..."}
        />
        
        {filteredContacts.length > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            {filteredContacts.length} contact(s) disponible(s) avec ce filtre
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSelectAll}
            disabled={filteredContacts.length === 0}
            className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tout sélectionner
          </button>
          <button
            onClick={handleDeselectAll}
            disabled={selectedContacts.length === 0}
            className="bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tout désélectionner
          </button>
        </div>
        
        {filterType === 'all' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSelectByType('student')}
              disabled={studentCount === 0}
              className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Étudiants ({studentCount})
            </button>
            <button
              onClick={() => handleSelectByType('teacher')}
              disabled={teacherCount === 0}
              className="bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Enseignants ({teacherCount})
            </button>
          </div>
        )}
      </div>

      {/* Contacts sélectionnés */}
      {selectedContacts.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Contacts sélectionnés ({selectedContacts.length})
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {selectedContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between text-xs bg-white p-2 rounded">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    contact.type === 'student' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></span>
                  <span className="font-medium">{contact.name}</span>
                  <span className="text-gray-500 ml-1">({contact.phone})</span>
                </div>
                <button
                  onClick={() => {
                    const newSelection = selectedContacts.filter(c => c.id !== contact.id);
                    onSelectionChange(newSelection);
                  }}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};