import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const theme = useTheme();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [analyticsOpen, setAnalyticsOpen] = useState(true);

  const handleAnalyticsClick = () => {
    setAnalyticsOpen(!analyticsOpen);
  };

  const drawerWidth = 260;

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      text: 'Analytics',
      icon: <BarChartIcon />,
      submenu: true,
      open: analyticsOpen,
      onClick: handleAnalyticsClick,
      items: [
        {
          text: 'Prompts',
          path: '/prompts',
        },
        {
          text: 'Models',
          path: '/models',
        },
        {
          text: 'Users',
          path: '/users',
        },
      ],
    },
    {
      text: 'Models',
      icon: <ModelTrainingIcon />,
      path: '/model-management',
    },
    {
      text: 'Feedback',
      icon: <FeedbackIcon />,
      path: '/feedback',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/';
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700} color="primary">
          DATAIDEA BRICS
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {user?.role === 'admin' ? 'Administrator' : 'User'}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {user?.username || 'Guest'}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <Box key={item.text}>
            {item.submenu ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={item.onClick}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.items?.map((subItem) => (
                      <ListItem key={subItem.text} disablePadding>
                        <ListItemButton
                          component={Link}
                          to={subItem.path}
                          sx={{
                            pl: 4,
                            backgroundColor: isActive(subItem.path)
                              ? theme.palette.action.selected
                              : 'transparent',
                          }}
                          onClick={isMobile ? onClose : undefined}
                        >
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    backgroundColor: isActive(item.path)
                      ? theme.palette.action.selected
                      : 'transparent',
                  }}
                  onClick={isMobile ? onClose : undefined}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            )}
          </Box>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/help">
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar; 