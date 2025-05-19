import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export type TransactionFormValues = {
  date: string;
  description: string;
  amount: number;
  category?: string;
  customer?: string;
};

type TransactionFormProps = {
  initialValues?: TransactionFormValues;
  onSubmit: (values: TransactionFormValues) => void;
  onCancel: () => void;
  type: 'sale' | 'expense';
  title: string;
};

// Category options for expenses
const EXPENSE_CATEGORIES = [
  'Office Supplies',
  'Rent',
  'Utilities',
  'Salaries',
  'Marketing',
  'Equipment',
  'Software',
  'Travel',
  'Other',
];

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  type,
  title,
}) => {
  const [values, setValues] = useState<TransactionFormValues>({
    date: getTodayDate(),
    description: '',
    amount: 0,
    category: type === 'expense' ? EXPENSE_CATEGORIES[0] : undefined,
    customer: type === 'sale' ? '' : undefined,
  });

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onCancel}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={values.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {type === 'sale' && (
            <div className="mb-4">
              <label htmlFor="customer" className="mb-1 block text-sm font-medium text-gray-700">
                Customer
              </label>
              <input
                type="text"
                id="customer"
                name="customer"
                value={values.customer}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {type === 'expense' && (
            <div className="mb-4">
              <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={values.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={values.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;