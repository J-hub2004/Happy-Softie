import React, { useMemo } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  BarChart3 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import Chart from '../components/Chart';
import { formatCurrency, getLastNMonths } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const { 
    state, 
    getTotalSales, 
    getTotalExpenses, 
    getProfit 
  } = useAppContext();

  const totalSales = getTotalSales();
  const totalExpenses = getTotalExpenses();
  const profit = getProfit();
  
  // Calculate profit margin
  const profitMargin = totalSales > 0 
    ? (profit / totalSales) * 100 
    : 0;

  // Group transactions by month for the chart
  const monthlyData = useMemo(() => {
    const months = getLastNMonths(6);
    const salesByMonth = new Array(6).fill(0);
    const expensesByMonth = new Array(6).fill(0);
    
    state.sales.forEach(sale => {
      const date = new Date(sale.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      const index = months.indexOf(monthYear);
      if (index !== -1) {
        salesByMonth[index] += sale.amount;
      }
    });
    
    state.expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      const index = months.indexOf(monthYear);
      if (index !== -1) {
        expensesByMonth[index] += expense.amount;
      }
    });
    
    return {
      months,
      salesByMonth,
      expensesByMonth,
    };
  }, [state.sales, state.expenses]);
  
  // Prepare chart data
  const barChartData = monthlyData.months.map((month, index) => ({
    label: month,
    value: monthlyData.salesByMonth[index] - monthlyData.expensesByMonth[index],
    color: monthlyData.salesByMonth[index] - monthlyData.expensesByMonth[index] >= 0 
      ? '#10B981' // green
      : '#EF4444', // red
  }));
  
  const pieChartData = [
    { label: 'Sales', value: totalSales, color: '#3B82F6' }, // blue
    { label: 'Expenses', value: totalExpenses, color: '#F59E0B' }, // amber
  ];

  // Calculate expenses by category for the pie chart
  const expensesByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    
    state.expenses.forEach(expense => {
      const category = expense.category || 'Other';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += expense.amount;
    });
    
    return Object.entries(categories).map(([category, amount]) => ({
      label: category,
      value: amount,
      color: getCategoryColor(category),
    }));
  }, [state.expenses]);
  
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Sales"
          value={formatCurrency(totalSales)}
          icon={<DollarSign className="h-6 w-6" />}
          color="blue"
        />
        
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<CreditCard className="h-6 w-6" />}
          color="red"
        />
        
        <SummaryCard
          title="Net Profit"
          value={formatCurrency(profit)}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        
        <SummaryCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={<BarChart3 className="h-6 w-6" />}
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Chart 
          title="Monthly Profit" 
          data={barChartData} 
          type="bar" 
        />
        
        <Chart 
          title="Sales vs Expenses" 
          data={pieChartData} 
          type="pie" 
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Chart 
          title="Expenses by Category" 
          data={expensesByCategory} 
          type="pie" 
        />
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Quick Stats</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-gray-600">Total Transactions</span>
              <span className="font-medium text-gray-800">
                {state.sales.length + state.expenses.length}
              </span>
            </div>
            
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-gray-600">Average Sale</span>
              <span className="font-medium text-gray-800">
                {state.sales.length > 0
                  ? formatCurrency(totalSales / state.sales.length)
                  : formatCurrency(0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-gray-600">Average Expense</span>
              <span className="font-medium text-gray-800">
                {state.expenses.length > 0
                  ? formatCurrency(totalExpenses / state.expenses.length)
                  : formatCurrency(0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Profit Status</span>
              <span 
                className={`font-medium ${
                  profit > 0 ? 'text-green-600' : profit < 0 ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {profit > 0 
                  ? 'Profitable' 
                  : profit < 0 
                  ? 'Loss' 
                  : 'Break-even'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;