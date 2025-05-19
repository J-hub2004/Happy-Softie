import React, { useState, useMemo } from 'react';
import { Calendar, Download, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Chart from '../components/Chart';
import { formatCurrency, getLastNMonths } from '../utils/formatters';

const Reports: React.FC = () => {
  const { state, getTotalSales, getTotalExpenses, getProfit } = useAppContext();
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return date.toISOString().split('T')[0];
    })(),
    end: new Date().toISOString().split('T')[0],
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter transactions by date range
  const filteredData = useMemo(() => {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    // Adjust end date to include the entire day
    endDate.setHours(23, 59, 59, 999);
    
    const sales = state.sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });
    
    const expenses = state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
    
    return { sales, expenses };
  }, [state.sales, state.expenses, dateRange]);
  
  // Calculate totals for filtered data
  const totalSales = filteredData.sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalExpenses = filteredData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = totalSales - totalExpenses;
  
  // Group expenses by category
  const expensesByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    
    filteredData.expenses.forEach(expense => {
      const category = expense.category || 'Other';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += expense.amount;
    });
    
    return Object.entries(categories)
      .map(([category, amount]) => ({
        label: category,
        value: amount,
        color: getCategoryColor(category),
      }))
      .sort((a, b) => b.value - a.value); // Sort by amount (descending)
  }, [filteredData.expenses]);
  
  // Helper to get consistent colors for categories
  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Office Supplies': '#3B82F6', // blue
      'Rent': '#8B5CF6', // purple
      'Utilities': '#EC4899', // pink
      'Salaries': '#F59E0B', // amber
      'Marketing': '#10B981', // green
      'Equipment': '#6366F1', // indigo
      'Software': '#14B8A6', // teal
      'Travel': '#F97316', // orange
      'Other': '#94A3B8', // slate
    };
    
    return colors[category] || '#94A3B8';
  }
  
  // Calculate daily sales and expenses for the selected period
  const dailyData = useMemo(() => {
    const dateMap = new Map<string, { sales: number; expenses: number }>();
    
    // Initialize all dates in the range
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { sales: 0, expenses: 0 });
    }
    
    // Sum sales by date
    filteredData.sales.forEach(sale => {
      const dateStr = sale.date.split('T')[0];
      const current = dateMap.get(dateStr) || { sales: 0, expenses: 0 };
      dateMap.set(dateStr, {
        ...current,
        sales: current.sales + sale.amount,
      });
    });
    
    // Sum expenses by date
    filteredData.expenses.forEach(expense => {
      const dateStr = expense.date.split('T')[0];
      const current = dateMap.get(dateStr) || { sales: 0, expenses: 0 };
      dateMap.set(dateStr, {
        ...current,
        expenses: current.expenses + expense.amount,
      });
    });
    
    // Convert to array and sort by date
    return Array.from(dateMap.entries())
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, values]) => ({
        date,
        sales: values.sales,
        expenses: values.expenses,
        profit: values.sales - values.expenses,
      }));
  }, [filteredData.sales, filteredData.expenses, dateRange]);
  
  // Prepare data for profit chart
  const profitChartData = dailyData.map(day => ({
    label: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: day.profit,
    color: day.profit >= 0 ? '#10B981' : '#EF4444',
  }));
  
  // Handle date range change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle export
  const handleExport = () => {
    // Create CSV content
    const salesData = filteredData.sales.map(sale => ({
      type: 'Sale',
      date: sale.date,
      description: sale.description,
      category: sale.customer,
      amount: sale.amount,
    }));
    
    const expensesData = filteredData.expenses.map(expense => ({
      type: 'Expense',
      date: expense.date,
      description: expense.description,
      category: expense.category,
      amount: -expense.amount, // Negative for expenses
    }));
    
    const allData = [...salesData, ...expensesData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const headers = ['Type', 'Date', 'Description', 'Category/Customer', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...allData.map(item => [
        item.type,
        item.date,
        `"${item.description.replace(/"/g, '""')}"`, // Handle quotes in text
        `"${item.category?.replace(/"/g, '""') || ''}"`,
        item.amount,
      ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `happy-softie-report-${dateRange.start}-to-${dateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button
            onClick={handleExport}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-800">Date Range</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start" className="mb-1 block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="start"
                name="start"
                value={dateRange.start}
                onChange={handleDateChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="end" className="mb-1 block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="end"
                name="end"
                value={dateRange.end}
                onChange={handleDateChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalSales)}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Net Profit</h3>
          <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(profit)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Chart
          title="Daily Profit"
          data={profitChartData}
          type="bar"
        />
        <Chart
          title="Expenses by Category"
          data={expensesByCategory}
          type="pie"
        />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Detailed Report</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b text-left text-sm font-medium text-gray-500">
                <th className="pb-3">Date</th>
                <th className="pb-3">Sales</th>
                <th className="pb-3">Expenses</th>
                <th className="pb-3">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {dailyData.map((day, index) => (
                <tr key={index} className="text-sm">
                  <td className="py-3 text-gray-800">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-gray-800">{formatCurrency(day.sales)}</td>
                  <td className="py-3 text-gray-800">{formatCurrency(day.expenses)}</td>
                  <td className={`py-3 font-medium ${day.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(day.profit)}
                  </td>
                </tr>
              ))}
              {dailyData.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No data available for the selected period
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t-2 border-gray-300 font-medium">
              <tr>
                <td className="py-3 text-gray-800">Total</td>
                <td className="py-3 text-gray-800">{formatCurrency(totalSales)}</td>
                <td className="py-3 text-gray-800">{formatCurrency(totalExpenses)}</td>
                <td className={`py-3 font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(profit)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;