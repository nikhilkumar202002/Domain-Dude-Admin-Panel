import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiLogOut, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import LogoImage from '../../assets/Domine-Dude.png'; 
import { SidebarData } from '../common/MenuList'; // Import the data we just created

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  
  // State to track which submenu is open (by index)
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

  const handleSubMenuClick = (index: number) => {
    // If clicking the same menu, close it. Otherwise, open the new one.
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  return (
    <aside 
      className={`
        fixed left-0 top-0 z-40 h-screen w-64 transition-transform duration-300 ease-in-out
        bg-black border-r border-zinc-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static flex flex-col
      `}
    >
      {/* Logo Section */}
      <div className="flex h-20 items-center justify-center border-b border-zinc-800 px-6 shrink-0">
        <img 
          src={LogoImage} 
          alt="Domain Dude" 
          className="h-10 w-auto object-contain" 
        />
      </div>

      {/* Navigation Links (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto mt-6 px-4 space-y-2 custom-scrollbar">
        {SidebarData.map((item, index) => {
          const isActive = location.pathname === item.path;
          const hasSubNav = item.subNav && item.subNav.length > 0;
          const isSubMenuOpen = openSubMenu === index;

          return (
            <div key={index}>
              {/* Main Menu Item */}
              <div 
                 onClick={() => hasSubNav && handleSubMenuClick(index)}
                 className={`cursor-pointer`}
              >
                 <Link
                    to={hasSubNav ? '#' : item.path}
                    // Prevent navigation if it's a submenu toggle
                    onClick={(e) => hasSubNav && e.preventDefault()} 
                    className={`
                      group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                      ${isActive && !hasSubNav
                        ? 'bg-gradient-to-r from-brand-primary/20 to-transparent text-brand-secondary border-l-4 border-brand-primary' 
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <span className={`mr-3 text-lg ${isActive ? 'text-brand-secondary' : 'text-zinc-500 group-hover:text-white'}`}>
                        {item.icon}
                      </span>
                      {item.title}
                    </div>
                    
                    {/* Render Chevron if it has submenus */}
                    {hasSubNav && (
                      <span className="text-zinc-500">
                        {isSubMenuOpen ? <FiChevronDown /> : <FiChevronRight />}
                      </span>
                    )}
                </Link>
              </div>

              {/* Submenu Items (Rendered if open) */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isSubMenuOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'
                }`}
              >
                {hasSubNav && item.subNav.map((subItem, subIndex) => {
                  const isSubActive = location.pathname === subItem.path;
                  
                  return (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className={`
                        flex w-full items-center rounded-lg pl-12 pr-4 py-2 text-sm transition-all
                        ${isSubActive 
                          ? 'text-brand-secondary bg-zinc-900' 
                          : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                        }
                      `}
                    >
                      {/* Optional: Add dot or icon for subitems */}
                      <span className="mr-2 h-1 w-1 rounded-full bg-current opacity-50"></span>
                      {subItem.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="w-full border-t border-zinc-800 p-4 shrink-0">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <FiLogOut className="mr-2 h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;