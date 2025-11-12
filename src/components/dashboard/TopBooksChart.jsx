import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award } from 'lucide-react';

const TopBooksChart = ({ data = [] }) => {
  // 기본 데이터
  const defaultData = [
    { title: '클린 코드', sales: 245 },
    { title: '리팩터링', sales: 198 },
    { title: '이펙티브 자바', sales: 176 },
    { title: '오브젝트', sales: 165 },
    { title: '클린 아키텍처', sales: 154 },
    { title: 'DDD Start!', sales: 142 },
    { title: '스프링 부트', sales: 138 },
    { title: '자바의 정석', sales: 125 },
    { title: 'HTTP 완벽 가이드', sales: 118 },
    { title: '모던 자바', sales: 102 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900">{payload[0].payload.title}</p>
          <p className="text-sm text-gray-600">판매량: {payload[0].value}권</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold">베스트셀러 Top 10</h3>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value}권`}
          />
          <YAxis
            type="category"
            dataKey="title"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            width={120}
            tickFormatter={(value) =>
              value.length > 10 ? `${value.substring(0, 10)}...` : value
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="sales"
            fill="#3b82f6"
            radius={[0, 4, 4, 0]}
            name="판매량"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopBooksChart;
