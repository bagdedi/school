import React from 'react';
import type { Teacher } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';
import { LogoutIcon } from '../icons/LogoutIcon';
import { LogoIcon } from '../icons/LogoIcon';

interface TeacherSidebarProps {
  teacher: Teacher;
  onLogout: () => void;
  children: React.ReactNode;
}

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ teacher, onLogout, children }) => {
  const { locale, setLocale, t } = useTranslation();

  return (
    <aside className="h-screen w-64 flex flex-col bg-gray-900 text-white shadow-lg no-print">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <LogoIcon />
          <span className="text-xl font-bold">Espace Enseignant</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {children}
      </nav>
      <div className="p-4 border-t border-gray-700">
         <div className="flex justify-center items-center space-x-2 mb-4">
            <button 
                onClick={() => setLocale('fr')}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${locale === 'fr' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
                FR
            </button>
            <button 
                onClick={() => setLocale('en')}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${locale === 'en' ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
                EN
            </button>
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={teacher.avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{`${teacher.firstName} ${teacher.lastName}`}</p>
            <p className="text-xs text-gray-400">{teacher.email}</p>
          </div>
           <button onClick={onLogout} className="ml-auto text-gray-400 hover:text-white" title="Se déconnecter">
             <LogoutIcon />
           </button>
        </div>
      </div>
    </aside>
  );
};