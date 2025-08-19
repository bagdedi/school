import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import type { NavItem } from '../../types';


type SubItem = NavItem['subItems'][0];

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active: string;
  alert?: boolean;
  onClick: (name: string) => void;
  subItems?: SubItem[];
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active, alert = false, onClick, subItems }) => {
  const hasSubItems = subItems && subItems.length > 0;
  const isParentActive = hasSubItems && active.startsWith(text);
  
  const [isOpen, setIsOpen] = useState(isParentActive);

  useEffect(() => {
    if(isParentActive) {
      setIsOpen(true);
    }
  }, [isParentActive]);

  const handleItemClick = () => {
    if (hasSubItems) {
      setIsOpen(!isOpen);
    } else {
      onClick(text);
    }
  };

  const handleSubItemClick = (e: React.MouseEvent, subItemName: string) => {
    e.stopPropagation(); // Prevent parent onClick from firing
    onClick(`${text} > ${subItemName}`);
  };

  const isActive = hasSubItems ? isParentActive : active === text;

  return (
    <>
      <li
        onClick={handleItemClick}
        className={`
          relative flex items-center py-3 px-4 my-1
          font-medium rounded-lg cursor-pointer
          transition-colors group
          ${
            isActive
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
              : "hover:bg-gray-800 text-gray-300"
          }
      `}
      >
        {icon}
        <span className="ml-4 flex-1">{text}</span>
        {hasSubItems && <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
        {alert && !hasSubItems && (
          <div className="absolute right-4 w-2 h-2 rounded-full bg-indigo-400" />
        )}
      </li>
      {hasSubItems && isOpen && (
        <ul className="pl-8 text-sm font-medium transition-all duration-300 ease-in-out">
          {subItems.map(sub => {
            const isSubItemActive = active === `${text} > ${sub.name}`;
            return (
              <li
                key={sub.name}
                onClick={(e) => handleSubItemClick(e, sub.name)}
                className={`
                  flex items-center py-2 px-3 my-1 rounded-md cursor-pointer
                  transition-colors
                  ${
                    isSubItemActive
                      ? 'text-indigo-400'
                      : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                {sub.icon && <span className="h-5 w-5 mr-3">{sub.icon}</span>}
                <span className={!sub.icon ? 'pl-8' : ''}>{sub.name}</span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};