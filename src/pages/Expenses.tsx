import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { Expense } from '../context/AppContext';

const Expenses: React.FC = () => {
  const { state, addExpense, editExpense, deleteExpense } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: '',
  });

  const handleAddClick = () => {
    setCurrentExpense(null);
    setShowForm(true);
  };

  const handleEditClick = (id: string) => {
    const expense = state.expenses.find((e) => e.id === id);
    if (expense) {
      setCurrentExpense(expense);
      setShowForm(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      id,
    });
  };

  const handleConfirmDelete = () => {
    deleteExpense(confirmDialog.id);
    setConfirmDialog({ isOpen: false, id: '' });
  };

  const handleFormSubmit = (values: any) => {
    if (currentExpense) {
      editExpense({ ...values, id: currentExpense.id });
    } else {
      addExpense(values);
    }
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  // Sort expenses by date (most recent first)
  const sortedExpenses = [...state.expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </button>
      </div>

      <TransactionList
        transactions={sortedExpenses}
        title="Expense History"
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        type="expense"
      />

      {showForm && (
        <TransactionForm
          initialValues={currentExpense || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          type="expense"
          title={currentExpense ? 'Edit Expense' : 'Add Expense'}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: '' })}
      />
    </div>
  );
};

export default Expenses;