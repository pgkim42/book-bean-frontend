import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserPlus } from 'lucide-react';

const NewUsersChart = ({ data = [] }) => {
  const [period, setPeriod] = useState('daily');

  // 기본 데이터
  const defaultData = {
    daily: [
      { date: '01-01', users: 12 },
      { date: '01-02', users: 8 },
      { date: '01-03', users: 15 },
      { date: '01-04', users: 18 },
      { date: '01-05', users: 11 },
      { date: '01-06', users: 22 },
      { date: '01-07', users: 25 },
    ],
    weekly: [
      { date: 'Week 1', users: 85 },
      { date: 'Week 2', users: 92 },
      { date: 'Week 3', users: 78 },
      { date: 'Week 4', users: 105 },
    ],
    monthly: [
      { date: '1월', users: 320 },
      { date: '2월', users: 380 },
      { date: '3월', users: 350 },
      { date: '4월', users: 420 },
      { date: '5월', users: 480 },
      { date: '6월', users: 450 },
    ],
  };

  const chartData = data.length > 0 ? data : defaultData[period];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-bold">신규 회원 가입</h3>
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
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value}명`}
          />
          <Tooltip
            formatter={(value) => [`${value}명`, '신규 회원']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorUsers)"
            name="신규 회원"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NewUsersChart;
