import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

const SalesChart = ({ data = [] }) => {
  const [period, setPeriod] = useState('daily');

  // 기본 데이터 (실제로는 props로 받아야 함)
  const defaultData = {
    daily: [
      { date: '01-01', sales: 1200000 },
      { date: '01-02', sales: 980000 },
      { date: '01-03', sales: 1450000 },
      { date: '01-04', sales: 1650000 },
      { date: '01-05', sales: 1320000 },
      { date: '01-06', sales: 1890000 },
      { date: '01-07', sales: 2100000 },
    ],
    weekly: [
      { date: 'Week 1', sales: 8500000 },
      { date: 'Week 2', sales: 9200000 },
      { date: 'Week 3', sales: 8800000 },
      { date: 'Week 4', sales: 10500000 },
    ],
    monthly: [
      { date: '1월', sales: 35000000 },
      { date: '2월', sales: 42000000 },
      { date: '3월', sales: 38000000 },
      { date: '4월', sales: 45000000 },
      { date: '5월', sales: 52000000 },
      { date: '6월', sales: 48000000 },
    ],
  };

  const chartData = data.length > 0 ? data : defaultData[period];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-bold">매출 추이</h3>
        </div>
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p === 'daily' ? '일별' : p === 'weekly' ? '주별' : '월별'}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
          />
          <Tooltip
            formatter={(value) => formatPrice(value)}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="매출"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
