import React from 'react';

type SummaryCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    positive: boolean;
  };
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="transform overflow-hidden rounded-xl bg-white p-6 shadow-md transition duration-300 ease-in-out hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center">
              <span className={trend.positive ? 'text-green-600' : 'text-red-600'}>
                {trend.positive ? '↑' : '↓'} {trend.value}%
              </span>
              <span className="ml-2 text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`rounded-full p-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;