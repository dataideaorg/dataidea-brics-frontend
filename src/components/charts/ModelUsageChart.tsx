import { useTheme } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { TimeRange, PieChartData } from '../../types';

// Mock data for the chart
const generateMockData = (): PieChartData[] => {
  return [
    { name: 'GPT-4', value: 45 },
    { name: 'Claude 3', value: 30 },
    { name: 'Llama 3', value: 15 },
    { name: 'Gemini', value: 10 },
  ];
};

interface ModelUsageChartProps {
  timeRange: TimeRange;
}

const ModelUsageChart = ({ timeRange }: ModelUsageChartProps) => {
  const theme = useTheme();
  const data = generateMockData();
  
  // Custom colors for the pie chart
  const COLORS = ['#3498db', '#9b59b6', '#2ecc71', '#e67e22'];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${value}%`, 'Usage']}
          contentStyle={{ 
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
          }}
        />
        <Legend 
          layout="vertical" 
          verticalAlign="middle" 
          align="right"
          wrapperStyle={{
            paddingLeft: '20px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ModelUsageChart; 