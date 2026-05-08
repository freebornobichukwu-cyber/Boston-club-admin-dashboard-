import { LayoutDashboard, ShoppingBag, ShoppingCart, LogOut, Bell, Search, Menu, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();
  const { signOut } = useAuth();
  const active = location.pathname;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: ShoppingBag },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Reviews', path: '/reviews', icon: MessageSquare },
  ];

  return (
    <aside className={cn("flex flex-col w-64 h-screen border-r border-slate-800 bg-slate-900 text-sm font-medium", className)}>
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 text-white font-semibold text-lg tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
            B
          </div>
          BostonClub
        </div>
      </div>
      
      <div className="px-4 py-6 flex-1 flex flex-col gap-1">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">Main Menu</div>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-slate-400 hover:text-slate-300 hover:bg-slate-800",
              active === item.path && "bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 hover:text-indigo-300"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="px-4 py-6 border-t border-slate-800 flex flex-col gap-1">
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 content-end rounded-lg transition-colors text-slate-400 hover:text-rose-400 hover:bg-slate-800 mt-1">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden text-slate-500 hover:text-slate-900">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-slate-500">
        <button className="p-2 hover:bg-slate-50 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        
        <button className="flex items-center gap-3 hover:bg-slate-50 p-1 pr-3 rounded-full border border-transparent hover:border-slate-200 transition-all">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=admin" alt="User" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-medium text-slate-900">Admin User</div>
            <div className="text-xs text-slate-500">Store Manager</div>
          </div>
        </button>
      </div>
    </header>
  );
}
