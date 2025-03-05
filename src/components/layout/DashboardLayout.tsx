import { useState, ReactNode } from 'react';
import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

const DashboardLayout = ({ children, onLogout }: DashboardLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      <Navbar toggleSidebar={handleToggleSidebar} onLogout={onLogout} />
      
      <Sidebar open={sidebarOpen} onClose={handleCloseSidebar} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${sidebarOpen ? 260 : 0}px)` },
          ml: { md: sidebarOpen ? '260px' : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          mt: '64px', // Navbar height
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 