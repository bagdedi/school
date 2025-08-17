import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  onClick: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active = false, alert = false, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-3 px-4 my-1
        font-medium rounded-lg cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-gray-800 text-gray-300"
        }
    `}
    >
      {icon}
      <span className="ml-4">{text}</span>
      {alert && (
        <div className="absolute right-4 w-2 h-2 rounded-full bg-indigo-400" />
      )}
    </li>
  );
};