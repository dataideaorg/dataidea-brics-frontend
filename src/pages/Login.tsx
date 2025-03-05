import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Link,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(username, password);
      // Redirect is handled by the AuthContext
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        px: isXs ? 2 : 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isXs ? 3 : 4,
          width: '100%',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant={isXs ? "h5" : "h4"} 
            component="h1" 
            fontWeight={700} 
            color="primary"
          >
            DATAIDEA BRICS
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            LLM Analytics Platform
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            size={isXs ? "small" : "medium"}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            size={isXs ? "small" : "medium"}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: isXs ? 1 : 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="#" variant="body2" underline="hover">
              Forgot password?
            </Link>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Demo credentials
            </Typography>
            <Box
              sx={{
                p: 2,
                backgroundColor: theme.palette.grey[50],
                border: `1px solid ${theme.palette.grey[200]}`,
              }}
            >
              <Typography variant="body2">
                <strong>Username:</strong> demo
              </Typography>
              <Typography variant="body2">
                <strong>Password:</strong> demo123
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 