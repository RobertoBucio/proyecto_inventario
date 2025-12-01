import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Button } from '@mui/material';
import { Inventory, ShoppingCart, Assessment, Logout } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';

const drawerWidth = 240;

export const Layout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Ventas', icon: <ShoppingCart />, path: '/dashboard/ventas' },
    { text: 'Inventario', icon: <Inventory />, path: '/dashboard/inventario' },
    { text: 'Reportes', icon: <Assessment />, path: '/dashboard/reportes' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Barra Superior (Header) */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión Empresarial
          </Typography>
          <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      {/* Menú Lateral (Sidebar) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* Espacio para que no tape el Header */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Contenido Principal (Aquí cambiarán las páginas) */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};