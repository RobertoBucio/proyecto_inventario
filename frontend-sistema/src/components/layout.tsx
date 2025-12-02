import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Button } from '@mui/material';
import { Inventory, ShoppingCart, Assessment, Logout } from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { useState } from 'react';
import { authApi } from '../api/axios';

const drawerWidth = 240;

export const Layout = () => {

  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const menuItems = [
    { text: 'Ventas', icon: <ShoppingCart />, path: '/dashboard/ventas' },
    { text: 'Inventario', icon: <Inventory />, path: '/dashboard/inventario' },
    { text: 'Reportes', icon: <Assessment />, path: '/dashboard/reportes' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const borrarCuenta = async () => {
    const email = localStorage.getItem('userEmail');

    try {
      await authApi.delete('/auth/delete', { data: { email } });
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      alert('Error al eliminar cuenta');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      
      {/* BARRA SUPERIOR */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sistema de Gestión Empresarial
          </Typography>

          <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          {/* ELIMINAR CUENTA */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpenDialog(true)}>
              <ListItemIcon>
                <DeleteForever color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="Eliminar Cuenta"
                sx={{ color: 'error.main' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* CONTENIDO PRINCIPAL */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>

      {/* ALERTA */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>¿Eliminar cuenta permanentemente?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción no se puede deshacer. Tu cuenta será eliminada de forma permanente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={borrarCuenta} variant="contained" color="error">
            Sí, Eliminar
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};