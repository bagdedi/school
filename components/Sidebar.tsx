import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface SidebarProps {
  logo: React.ReactNode;
  schoolName: string;
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ logo, schoolName, children, className }) => {
  const { locale, setLocale, t } = useTranslation();

  return (
    <aside className={`h-screen w-64 flex flex-col bg-gray-900 text-white shadow-lg ${className}`}>
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          {logo}
          <span className="text-xl font-bold">{schoolName}</span>
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
            src="https://picsum.photos/id/237/40/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{t('sidebar.adminUser')}</p>
            <p className="text-xs text-gray-400">admin@northwood.edu</p>
          </div>
        </div>
      </div>
    </aside>
  );
};