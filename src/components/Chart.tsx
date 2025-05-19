import React, { useEffect, useRef } from 'react';
import { formatCurrency } from '../utils/formatters';

// This is a simple chart component using HTML/CSS to avoid adding chart libraries
// In a production app, you might want to use a proper chart library

type ChartData = {
  label: string;
  value: number;
  color: string;
};

type ChartProps = {
  data: ChartData[];
  title: string;
  type: 'bar' | 'pie';
};

const Chart: React.FC<ChartProps> = ({ data, title, type }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const maxValue = Math.max(...data.map((item) => item.value));

  useEffect(() => {
    // Animation effect when component mounts
    if (chartRef.current) {
      const bars = chartRef.current.querySelectorAll('[data-bar]');
      const pieSegments = chartRef.current.querySelectorAll('[data-segment]');
      
      if (type === 'bar') {
        bars.forEach((bar, index) => {
          setTimeout(() => {
            (bar as HTMLElement).style.height = `${(data[index].value / maxValue) * 100}%`;
            (bar as HTMLElement).style.opacity = '1';
          }, index * 100);
        });
      } else if (type === 'pie') {
        pieSegments.forEach((segment, index) => {
          setTimeout(() => {
            (segment as HTMLElement).style.opacity = '1';
          }, index * 100);
        });
      }
    }
  }, [data, maxValue, type]);

  if (type === 'bar') {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">{title}</h2>
        <div ref={chartRef} className="h-64">
          <div className="flex h-56 items-end justify-around">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative h-full w-12 flex justify-center">
                  <div
                    data-bar
                    style={{ 
                      backgroundColor: item.color, 
                      height: '0%',
                      opacity: 0,
                      transition: 'height 0.5s ease-out, opacity 0.3s ease-in',
                    }}
                    className="absolute bottom-0 w-10 rounded-t-md"
                  ></div>
                </div>
                <div className="mt-2 text-xs font-medium text-gray-700">{item.label}</div>
                <div className="text-xs text-gray-500">{formatCurrency(item.value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    // Calculate percentage for each value
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const percentages = data.map((item) => (item.value / total) * 100);
    
    // Create color-coded legend instead of actual pie chart
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex">
          <div ref={chartRef} className="relative h-48 w-48">
            {/* We'll create a simple colored circle instead of a full pie chart */}
            <div className="absolute inset-0 rounded-full bg-gray-100"></div>
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(${data.map((item, index) => 
                  `${item.color} ${index > 0 
                    ? percentages.slice(0, index).reduce((a, b) => a + b, 0) 
                    : 0}% ${percentages.slice(0, index+1).reduce((a, b) => a + b, 0)}%`
                ).join(', ')})`,
                opacity: 0,
                transition: 'opacity 0.5s ease-in',
              }}
              data-segment
            ></div>
            {total === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm text-gray-400">No data</span>
              </div>
            )}
          </div>
          <div className="ml-8 flex flex-col justify-center space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="mr-2 h-4 w-4 rounded-sm"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-gray-500">
                    {formatCurrency(item.value)} ({percentages[index].toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Chart;