import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  useTheme,
  CircularProgress,
  Alert,
  useMediaQuery,
} from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TokenIcon from '@mui/icons-material/Token';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/api';
import UsageTrendsChart from '../components/charts/UsageTrendsChart';
import ModelUsageChart from '../components/charts/ModelUsageChart';
import { DashboardStats, TimeRange } from '../types';

// Mock data for development
const mockStats: DashboardStats = {
  totalPrompts: 1248,
  totalUsers: 87,
  avgLatency: 842,
  totalTokens: 1356789,
  promptsPerDay: [
    { date: '2023-06-01', count: 42 },
    { date: '2023-06-02', count: 53 },
    { date: '2023-06-03', count: 61 },
    { date: '2023-06-04', count: 48 },
    { date: '2023-06-05', count: 72 },
    { date: '2023-06-06', count: 85 },
    { date: '2023-06-07', count: 93 },
  ],
  modelUsage: [
    { model: 'gpt-4', count: 523 },
    { model: 'claude-3', count: 412 },
    { model: 'llama-3', count: 198 },
    { model: 'gemini', count: 115 },
  ],
  topCategories: [
    { category: 'question', count: 487 },
    { category: 'instruction', count: 356 },
    { category: 'chat', count: 289 },
    { category: 'creative', count: 116 },
  ],
  totalSessions: 1450,
  activeUsers: 65,
  avgFeedbackScore: 4.7,
  sessionsTrend: 12.5,
  usersTrend: 8.2,
  promptsTrend: 15.3,
  feedbackTrend: 0.3,
};

const Dashboard = () => {
  const theme = useTheme();
  const { logout } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Responsive breakpoints
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In development, use mock data
        if (import.meta.env.MODE === 'development') {
          setTimeout(() => {
            setStats(mockStats);
            setLoading(false);
          }, 1000);
          return;
        }

        // In production, use the actual API
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to fetch dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) => (
    <Card sx={{ height: '100%', borderRadius: '8px' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography 
              variant={isXs ? "h5" : "h4"} 
              component="div" 
              fontWeight={600}
              sx={{ wordBreak: 'break-word' }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '8px',
              width: isXs ? 40 : 48,
              height: isXs ? 40 : 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout onLogout={logout}>
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant={isXs ? "h5" : "h4"} 
          component="h1" 
          gutterBottom 
          fontWeight={600}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your LLM analytics data
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        stats && (
          <>
            <Grid container spacing={isXs ? 2 : 3} sx={{ mb: isXs ? 2 : 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Prompts"
                  value={stats.totalPrompts.toLocaleString()}
                  icon={<TrendingUpIcon />}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active Users"
                  value={stats.totalUsers.toLocaleString()}
                  icon={<PeopleIcon />}
                  color="#2ecc71"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Avg. Latency (ms)"
                  value={stats.avgLatency.toLocaleString()}
                  icon={<AccessTimeIcon />}
                  color="#e67e22"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Tokens"
                  value={stats.totalTokens.toLocaleString()}
                  icon={<TokenIcon />}
                  color="#9b59b6"
                />
              </Grid>
            </Grid>

            <Grid container spacing={isXs ? 2 : 3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: isXs ? 2 : 3, height: '100%', borderRadius: '8px' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isXs ? 'column' : 'row',
                    justifyContent: 'space-between', 
                    alignItems: isXs ? 'flex-start' : 'center', 
                    mb: 2,
                    gap: isXs ? 1 : 0
                  }}>
                    <Typography variant="h6" fontWeight={600}>
                      Prompts Over Time
                    </Typography>
                    <Button size="small" variant="outlined" sx={{ borderRadius: '6px' }}>
                      Last 7 Days
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ 
                    height: isXs ? 200 : 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Chart will be implemented with a charting library like Chart.js or Recharts
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: isXs ? 2 : 3, height: '100%', borderRadius: '8px' }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Model Usage
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ 
                    height: isXs ? 200 : 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Pie chart will be implemented here
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: isXs ? 2 : 3, borderRadius: '8px' }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Top Categories
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ 
                    height: isXs ? 180 : 250, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Bar chart will be implemented here
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: isXs ? 2 : 3, borderRadius: '8px' }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Recent Activity
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ 
                    height: isXs ? 180 : 250, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Activity timeline will be implemented here
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        )
      )}
    </DashboardLayout>
  );
};

export default Dashboard; 