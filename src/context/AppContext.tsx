import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Sale = {
  id: string;
  date: string;
  customer: string;
  description: string;
  amount: number;
};

export type Expense = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
};

type AppState = {
  sales: Sale[];
  expenses: Expense[];
};

type AppAction =
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'EDIT_SALE'; payload: Sale }
  | { type: 'DELETE_SALE'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'EDIT_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'LOAD_DATA'; payload: AppState };

type AppContextType = {
  state: AppState;
  addSale: (sale: Omit<Sale, 'id'>) => void;
  editSale: (sale: Sale) => void;
  deleteSale: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  editExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  getTotalSales: () => number;
  getTotalExpenses: () => number;
  getProfit: () => number;
};


const initialState: AppState = {
  sales: [],
  expenses: [],
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_SALE':
      return {
        ...state,
        sales: [...state.sales, action.payload],
      };
    case 'EDIT_SALE':
      return {
        ...state,
        sales: state.sales.map((sale) =>
          sale.id === action.payload.id ? action.payload : sale
        ),
      };
    case 'DELETE_SALE':
      return {
        ...state,
        sales: state.sales.filter((sale) => sale.id !== action.payload),
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'EDIT_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
};

// Create context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from local storage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('happySoftieData');
    if (savedData) {
      dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) });
    }
  }, []);

  // Save data to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('happySoftieData', JSON.stringify(state));
  }, [state]);

  // Context value
  const value: AppContextType = {
    state,
    addSale: (sale) => {
      const newSale = {
        ...sale,
        id: uuidv4(),
      };
      dispatch({ type: 'ADD_SALE', payload: newSale });
    },
    editSale: (sale) => {
      dispatch({ type: 'EDIT_SALE', payload: sale });
    },
    deleteSale: (id) => {
      dispatch({ type: 'DELETE_SALE', payload: id });
    },
    addExpense: (expense) => {
      const newExpense = {
        ...expense,
        id: uuidv4(),
      };
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
    },
    editExpense: (expense) => {
      dispatch({ type: 'EDIT_EXPENSE', payload: expense });
    },
    deleteExpense: (id) => {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    },
    getTotalSales: () => {
      return state.sales.reduce((total, sale) => total + sale.amount, 0);
    },
    getTotalExpenses: () => {
      return state.expenses.reduce((total, expense) => total + expense.amount, 0);
    },
    getProfit: () => {
      const totalSales = state.sales.reduce((total, sale) => total + sale.amount, 0);
      const totalExpenses = state.expenses.reduce((total, expense) => total + expense.amount, 0);
      return totalSales - totalExpenses;
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the AppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};