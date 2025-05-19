import React from 'react';
import { formatCurrency } from '../utils/formatters';

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category?: string;
  customer?: string;
};

type TransactionListProps = {
  transactions: Transaction[];
  title: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: 'sale' | 'expense';
};

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  title,
  onEdit,
  onDelete,
  type,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">{title}</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No {type === 'sale' ? 'sales' : 'expenses'} recorded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b text-left text-sm font-medium text-gray-500">
              <th className="pb-3">Date</th>
              {type === 'sale' && <th className="pb-3">Customer</th>}
              {type === 'expense' && <th className="pb-3">Category</th>}
              <th className="pb-3">Description</th>
              <th className="pb-3 text-right">Amount</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="text-sm">
                <td className="py-3 text-gray-800">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                {type === 'sale' && (
                  <td className="py-3 text-gray-800">{transaction.customer}</td>
                )}
                {type === 'expense' && (
                  <td className="py-3 text-gray-800">{transaction.category}</td>
                )}
                <td className="py-3 text-gray-800">{transaction.description}</td>
                <td className="py-3 text-right font-medium text-gray-800">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="py-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(transaction.id)}
                      className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;