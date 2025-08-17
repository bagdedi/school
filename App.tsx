import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { SidebarItem } from './components/SidebarItem';
import { DashboardIcon } from './components/icons/DashboardIcon';
import { StudentsIcon } from './components/icons/StudentsIcon';
import { TeachersIcon } from './components/icons/TeachersIcon';
import { ScholarshipIcon } from './components/icons/ScholarshipIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { LogoIcon } from './components/icons/LogoIcon';
import type { NavItem } from './types';
import DashboardPage from './components/dashboard/DashboardPage';
import StudentsPage from './components/students/StudentsPage';
import TeachersPage from './components/teachers/TeachersPage';
import ScholarshipPage from './components/scholarship/ScholarshipPage';
import SettingsPage from './components/settings/SettingsPage';

const App: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');

  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Students', icon: <StudentsIcon /> },
    { name: 'Teachers', icon: <TeachersIcon />, alert: true },
    { name: 'Scholarship', icon: <ScholarshipIcon /> },
    { name: 'Settings', icon: <SettingsIcon /> },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Students':
        return <StudentsPage />;
      case 'Teachers':
        return <TeachersPage />;
      case 'Scholarship':
        return <ScholarshipPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <h1>Page not found</h1>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        logo={<LogoIcon />}
        schoolName="Northwood High"
      >
        {navItems.map((item) => (
          <SidebarItem
            key={item.name}
            icon={item.icon}
            text={item.name}
            active={activeItem === item.name}
            alert={item.alert}
            onClick={() => setActiveItem(item.name)}
          />
        ))}
      </Sidebar>
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
