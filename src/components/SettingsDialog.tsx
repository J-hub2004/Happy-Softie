import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, Monitor } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

type SettingsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useAppContext();
  const [currency, setCurrency] = useState(state.settings.currency || 'USD');
  const [theme, setTheme] = useState(state.settings.theme || 'system');

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const isDark = mediaQuery.matches;
        document.documentElement.classList.toggle('dark', isDark);
        dispatch({ type: 'SET_THEME', payload: isDark ? 'dark' : 'light'});
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, dispatch]);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    if (theme === 'system') { 
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark',isDark);
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

    // Save to localStorage for persistence
    localStorage.setItem('theme', theme);
  }, [theme]);

  if (!isOpen) return null;

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    // Update context
    dispatch({ type: 'SET_CURRENCY', payload: newCurrency});
    // Save to localStorage
    localStorage.setItem('currency', newCurrency);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);

    // Apply immediately
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
      dispatch({ type: 'SET_THEME', payload: isDark ? 'dark' : 'light'});
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      dispatch({ type: 'SET_THEME', payload: newTheme });
    }
  };

  const currencies = [
    { value: 'USD', label: 'USD ($)', symbol: '$' },
    { value: 'EUR', label: 'EUR (€)', symbol: '€' },
    { value: 'GBP', label: 'GBP (£)', symbol: '£' },
    { value: 'JPY', label: 'JPY (¥)', symbol: '¥' },
    { value: 'UGX', label: 'UGX (USh)', symbol: 'USh' },
  ];

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Currency Settings */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {currencies.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Settings */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Theme
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {themes.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => handleThemeChange(id)}
                  className={`flex items-center justify-center rounded-lg p-4 transition duration-150 ease-in-out ${
                    theme === id
                      ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-500 ring-offset-2'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Data Summary */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Data Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-sm text-gray-500">Sales Records</p>
                <p className="text-lg font-semibold text-gray-900">{state.sales.length}</p>
              </div>
              <div className="rounded-lg bg-white p-3 shadow-sm">
                <p className="text-sm text-gray-500">Expense Records</p>
                <p className="text-lg font-semibold text-gray-900">{state.expenses.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;