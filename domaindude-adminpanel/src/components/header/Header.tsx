
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-zinc-800 bg-black/80 px-6 backdrop-blur-md">
      
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

        {/* CTA Button using Brand Colors */}
        <button className="hidden sm:block rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all duration-200">
          + New Project
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-zinc-800 pl-6">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-primary to-brand-light p-[2px]">
            <div className="h-full w-full rounded-full bg-zinc-900 flex items-center justify-center">
               <span className="font-bold text-white text-xs">JD</span>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-zinc-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;