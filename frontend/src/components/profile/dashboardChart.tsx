import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DashboardChartProps {
  data: { label: string; commentCount: number }[];
  commentAvg: number;
  period: number;
}

const formatDate = (dateStr: string, period: number) => {
  // Parse the date string and adjust for timezone
  const [year, month, day] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  const dayStr = date.getDate().toString().padStart(2, '0');
  const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
  const yearStr = date.getFullYear().toString().slice(-2);

  if (period === 7) {
    return `${dayStr}/${monthStr}`;
  } else if (period === 30) {
    return `${dayStr}/${monthStr}`;
  } else if (period === 365) {
    return `${monthStr}/${yearStr}`;
  }
  return dateStr;
};

const DashboardChart: React.FC<DashboardChartProps> = ({ data, commentAvg, period }) => {
  if (!data?.length) {
    return <div className="text-center">No data available</div>;    
  }

  const formattedData = data.map(item => ({
    ...item,
    label: formatDate(item.label, period)
  }));

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <div className="flex justify-start mb-4">
          <div className="bg-blue-600/20 px-4 py-2 rounded-lg border border-blue-500/30">
            <div className="text-sm text-blue-300">Média de comentários</div>
            <div className="text-2xl font-bold text-blue-200">
              {(commentAvg || 0).toFixed(1)}
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart 
            data={formattedData}
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="label" 
              interval={period === 30 ? 4 : period === 365 ? 1 : 0}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              axisLine={{ stroke: '#4B5563' }}
              angle={period === 30 ? -45 : -45}
              textAnchor={"end"}
              height={60}
            />
            <YAxis 
              hide={true}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6'
              }}
              labelStyle={{ color: '#F3F4F6' }}
              formatter={(value: number) => [`${value} comentários`]}
            />
            <Line 
              type="monotone" 
              dataKey="commentCount" 
              stroke="#60A5FA"
              strokeWidth={2}
              dot={{ r: 3, fill: '#60A5FA' }}
              activeDot={{ r: 4, fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardChart;