import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, BarChart3, DollarSign, CreditCard, Home, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SettingsDialog from './SettingsDialog';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const context = useAppContext();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/sales', label: 'Sales', icon: <DollarSign className="h-5 w-5" /> },
    { path: '/expenses', label: 'Expenses', icon: <CreditCard className="h-5 w-5" /> },
    { path: '/reports', label: 'Reports', icon: <BarChart3 className="h-5 w-5" /> },
  ];

  const getPageTitle = () => {
    const item = navItems.find((item) => item.path === location.pathname);
    return item ? item.label : 'Not Found';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for medium screens and above */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-6">
            <div className="flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
                <span className="text-xl">☺</span>
              </div>
              <h1 className="text-xl font-bold text-blue-600">Happy Softie</h1>
            </div>
            <button 
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 md:hidden" 
              onClick={toggleSidebar}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t px-4 py-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="text-sm font-medium text-gray-600">Total Profit</div>
              <div className={`text-xl font-bold ${
                context.getProfit() >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${context.getProfit().toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <button
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 md:hidden"
                onClick={toggleSidebar}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="ml-2 text-xl font-semibold text-gray-800 md:ml-0">
                {getPageTitle()}
              </h2>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setSettingsOpen(true)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;