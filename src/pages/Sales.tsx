import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { Sale } from '../context/AppContext';

const Sales: React.FC = () => {
  const { state, addSale, editSale, deleteSale } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; id: string }>({
    isOpen: false,
    id: '',
  });

  const handleAddClick = () => {
    setCurrentSale(null);
    setShowForm(true);
  };

  const handleEditClick = (id: string) => {
    const sale = state.sales.find((s) => s.id === id);
    if (sale) {
      setCurrentSale(sale);
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
    deleteSale(confirmDialog.id);
    setConfirmDialog({ isOpen: false, id: '' });
  };

  const handleFormSubmit = (values: any) => {
    if (currentSale) {
      editSale({ ...values, id: currentSale.id });
    } else {
      addSale(values);
    }
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  // Sort sales by date (most recent first)
  const sortedSales = [...state.sales].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Sale
        </button>
      </div>

      <TransactionList
        transactions={sortedSales}
        title="Sales History"
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        type="sale"
      />

      {showForm && (
        <TransactionForm
          initialValues={currentSale || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          type="sale"
          title={currentSale ? 'Edit Sale' : 'Add Sale'}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Sale"
        message="Are you sure you want to delete this sale? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: '' })}
      />
    </div>
  );
};

export default Sales;