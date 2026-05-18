import {Outlet, Link, useLocation} from 'react-router-dom';
import {navigation} from '../lib/navigation';
import {cn} from '../lib/utils';
import {LogOut, Search, Bell, Shield, Database} from 'lucide-react';
import {useAuth} from '../context/AuthContext';

export default function Layout() {
  const location = useLocation();
  const {user, profile, signOut} = useAuth();

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col">
        <div className="p-6 border-bottom">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-600">EMBLOCK</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold font-mono">Knowledge Workspace</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                id={`nav-${item.name.toLowerCase()}`}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-indigo-600" : "text-gray-400")} />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Corporate Base</p>
            <Link
              to="/internal-base"
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                location.pathname === '/internal-base'
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              id="nav-internal-base"
            >
              <Database className={cn("mr-3 h-5 w-5", location.pathname === '/internal-base' ? "text-indigo-600" : "text-gray-400")} />
              Emblock Access
            </Link>
          </div>

          {(profile?.isAdmin || user?.email === 'raokpavani@gmail.com') && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Management</p>
              <Link
                to="/admin"
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                  location.pathname === '/admin'
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                id="nav-admin"
              >
                <Shield className={cn("mr-3 h-5 w-5", location.pathname === '/admin' ? "text-indigo-600" : "text-gray-400")} />
                Admin Panel
              </Link>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-[#E5E7EB]">
          <button 
            onClick={signOut}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200" 
            id="logout-btn"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 z-10">
          <div className="flex items-center flex-1">
            <div className="relative w-96">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </span>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-[#E5E7EB] rounded-full bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Search resources, projects, or people..."
                id="main-search"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors" id="notifications-btn">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900 leading-none">{profile?.displayName || user?.displayName}</p>
                <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-tighter mt-1">{profile?.role || 'Member'}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white overflow-hidden shadow-sm" id="user-avatar">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-bold text-sm">{(user?.displayName || 'U').charAt(0)}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
