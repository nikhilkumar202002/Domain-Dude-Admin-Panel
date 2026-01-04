import { useState, useRef, useEffect } from 'react';
import { FiBell, FiSearch, FiMenu, FiLogOut, FiUser, FiSettings, FiChevronDown } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom'; // Remove this if not used elsewhere
import { authAPI } from '../../services/auth'; 

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // const navigate = useNavigate(); // Not needed for hard refresh

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Call the backend logout API
      await authAPI.logout(); 
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // 1. Remove the token
      localStorage.removeItem('token'); 
      
      // 2. Force a hard refresh to the login page.
      // This ensures all App state (isAuthenticated) is reset immediately.
      window.location.href = '/login'; 
    }
  };

  return (
    <header className="sticky top-0 z-30 flex py-4 w-full items-center justify-between border-b border-zinc-800 bg-black/80 px-6 backdrop-blur-md">
      
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 lg:hidden"
        >
          <FiMenu className="h-6 w-6" />
        </button>

        <div className="relative hidden md:block">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects..."
            className="h-10 w-64 rounded-full border border-zinc-800 bg-zinc-900 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Notification Bell */}
        <button className="relative text-zinc-400 hover:text-white transition-colors">
          <FiBell className="h-6 w-6" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-primary"></span>
        </button>

        {/* CTA Button */}
        <button className="hidden sm:block rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all duration-200">
          + New Project
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 border-l border-zinc-800 pl-6 focus:outline-none group"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-primary to-brand-light p-[2px]">
              <div className="h-full w-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                 <span className="font-bold text-white text-xs">JD</span>
              </div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white group-hover:text-brand-primary transition-colors">John Doe</p>
              <p className="text-xs text-zinc-500">Admin</p>
            </div>
            <FiChevronDown className={`hidden md:block h-4 w-4 text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-56 origin-top-right rounded-xl border border-zinc-800 bg-zinc-900 p-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
              
              <div className="px-3 py-2 border-b border-zinc-800 md:hidden">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-zinc-500">admin@domaindude.com</p>
              </div>

              <div className="p-1">
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  <FiUser className="h-4 w-4" />
                  My Profile
                </button>
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                  <FiSettings className="h-4 w-4" />
                  Account Settings
                </button>
              </div>

              <div className="border-t border-zinc-800 p-1">
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <FiLogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;