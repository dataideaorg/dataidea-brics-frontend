import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/api';
import { Prompt } from '../types';

const PromptsPage = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const { logout } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPrompts, setTotalPrompts] = useState(0);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      setError(null);
      try {
        // In development, we'll use mock data
        if (import.meta.env.MODE === 'development') {
          setTimeout(() => {
            const mockPrompts: Prompt[] = Array.from({ length: 50 }, (_, i) => ({
              id: i + 1,
              sessionId: `session-${Math.floor(Math.random() * 100)}`,
              userId: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 1 : null,
              projectId: Math.floor(Math.random() * 5) + 1,
              modelId: ['gpt-4', 'claude-3', 'llama-3', 'gemini'][Math.floor(Math.random() * 4)],
              promptText: `Sample prompt text ${i + 1}. This is a mock prompt for testing purposes.`,
              responseText: `Sample response text ${i + 1}. This is a mock response for testing purposes.`,
              promptTokens: Math.floor(Math.random() * 100) + 50,
              responseTokens: Math.floor(Math.random() * 300) + 100,
              latency: Math.floor(Math.random() * 2000) + 500,
              timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
              metadata: {
                category: ['question', 'instruction', 'chat', 'creative'][Math.floor(Math.random() * 4)],
                language: ['en', 'es', 'fr', 'de'][Math.floor(Math.random() * 4)],
              },
            }));

            // Filter by search query if provided
            const filteredPrompts = searchQuery
              ? mockPrompts.filter(
                  (prompt) =>
                    prompt.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    prompt.responseText.toLowerCase().includes(searchQuery.toLowerCase())
                )
              : mockPrompts;

            setPrompts(filteredPrompts.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
            setTotalPrompts(filteredPrompts.length);
            setLoading(false);
          }, 1000);
          return;
        }

        // In production, we'll use the actual API
        const params = {
          page: page + 1,
          page_size: rowsPerPage,
          search: searchQuery || undefined,
        };
        const data = await analyticsService.getPromptsData(params);
        setPrompts(data.data);
        setTotalPrompts(data.total);
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setError('Failed to fetch prompts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [page, rowsPerPage, searchQuery]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getModelColor = (modelId: string) => {
    switch (modelId) {
      case 'gpt-4':
        return '#3498db';
      case 'claude-3':
        return '#9b59b6';
      case 'llama-3':
        return '#2ecc71';
      case 'gemini':
        return '#e67e22';
      default:
        return '#95a5a6';
    }
  };

  // Responsive column display
  const getVisibleColumns = () => {
    if (isXs) {
      return ['Model', 'Prompt', 'Timestamp'];
    } else if (isSm) {
      return ['ID', 'Model', 'Prompt', 'Tokens', 'Timestamp'];
    }
    return ['ID', 'Model', 'Prompt', 'Response', 'Tokens', 'Latency', 'Timestamp'];
  };

  const visibleColumns = getVisibleColumns();

  // Mobile card view for XS screens
  const renderMobileCard = (prompt: Prompt) => (
    <Card key={prompt.id} sx={{ mb: 2, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Chip
          label={prompt.modelId}
          size="small"
          sx={{
            backgroundColor: getModelColor(prompt.modelId),
            color: 'white',
            fontWeight: 500,
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {formatDate(prompt.timestamp)}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {truncateText(prompt.promptText, 100)}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          ID: {prompt.id}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {prompt.promptTokens + prompt.responseTokens} tokens
        </Typography>
      </Box>
    </Card>
  );

  return (
    <DashboardLayout onLogout={logout}>
      <Box sx={{ mb: isXs ? 2 : 4 }}>
        <Typography 
          variant={isXs ? "h5" : "h4"} 
          component="h1" 
          gutterBottom 
          fontWeight={600}
        >
          Prompts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and analyze all prompts sent to your LLM models.
        </Typography>
      </Box>

      <Paper sx={{ p: isXs ? 2 : 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: isXs ? 1 : 2 }}>
          <TextField
            placeholder="Search prompts..."
            variant="outlined"
            size={isXs ? "small" : "medium"}
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2 }}
          />
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {isXs ? (
            // Mobile card view
            <Box>
              {prompts.map(renderMobileCard)}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalPrompts}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          ) : (
            // Table view for larger screens
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: isSm ? 650 : 900 }}>
                  <TableHead>
                    <TableRow>
                      {visibleColumns.includes('ID') && <TableCell>ID</TableCell>}
                      {visibleColumns.includes('Model') && <TableCell>Model</TableCell>}
                      {visibleColumns.includes('Prompt') && <TableCell>Prompt</TableCell>}
                      {visibleColumns.includes('Response') && <TableCell>Response</TableCell>}
                      {visibleColumns.includes('Tokens') && <TableCell>Tokens</TableCell>}
                      {visibleColumns.includes('Latency') && <TableCell>Latency (ms)</TableCell>}
                      {visibleColumns.includes('Timestamp') && <TableCell>Timestamp</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prompts.map((prompt) => (
                      <TableRow key={prompt.id} hover>
                        {visibleColumns.includes('ID') && <TableCell>{prompt.id}</TableCell>}
                        {visibleColumns.includes('Model') && (
                          <TableCell>
                            <Chip
                              label={prompt.modelId}
                              size="small"
                              sx={{
                                backgroundColor: getModelColor(prompt.modelId),
                                color: 'white',
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                        )}
                        {visibleColumns.includes('Prompt') && (
                          <TableCell>{truncateText(prompt.promptText)}</TableCell>
                        )}
                        {visibleColumns.includes('Response') && (
                          <TableCell>{truncateText(prompt.responseText)}</TableCell>
                        )}
                        {visibleColumns.includes('Tokens') && (
                          <TableCell>
                            {prompt.promptTokens} / {prompt.responseTokens}
                          </TableCell>
                        )}
                        {visibleColumns.includes('Latency') && (
                          <TableCell>{prompt.latency}</TableCell>
                        )}
                        {visibleColumns.includes('Timestamp') && (
                          <TableCell>{formatDate(prompt.timestamp)}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalPrompts}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default PromptsPage; 