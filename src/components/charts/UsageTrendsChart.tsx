import { useTheme } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TimeRange, TimeSeriesData } from '../../types';

// Mock data for the chart
const generateMockData = (timeRange: TimeRange): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  let labels: string[] = [];
  
  switch (timeRange) {
    case 'day':
      labels = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'];
      break;
    case 'week':
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      break;
    case 'month':
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
      break;
    case 'year':
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      break;
    default:
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }
  
  for (let i = 0; i < labels.length; i++) {
    data.push({
      name: labels[i],
      sessions: Math.floor(Math.random() * 100) + 50,
      prompts: Math.floor(Math.random() * 500) + 200,
      feedback: Math.floor(Math.random() * 80) + 20,
    });
  }
  
  return data;
};

interface UsageTrendsChartProps {
  timeRange: TimeRange;
}

const UsageTrendsChart = ({ timeRange }: UsageTrendsChartProps) => {
  const theme = useTheme();
  const data = generateMockData(timeRange);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
        />
        <YAxis 
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
          }} 
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="sessions"
          stroke={theme.palette.primary.main}
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="prompts" 
          stroke="#9b59b6" 
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="feedback" 
          stroke="#2ecc71" 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UsageTrendsChart; 