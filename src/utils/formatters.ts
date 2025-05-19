export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getMonthName = (month: number): string => {
  const date = new Date();
  date.setMonth(month);
  return date.toLocaleString('default', { month: 'short' });
};

export const getLastNMonths = (n: number): string[] => {
  const months = [];
  const date = new Date();
  
  for (let i = 0; i < n; i++) {
    const month = date.getMonth() - i;
    const year = date.getFullYear();
    const adjustedDate = new Date(year, month, 1);
    months.unshift(
      adjustedDate.toLocaleString('default', { month: 'short', year: '2-digit' })
    );
  }
  
  return months;
};