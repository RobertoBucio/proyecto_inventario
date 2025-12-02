import { useEffect, useState } from 'react';
import { Button, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { coreApi } from '../api/axios';

export const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: 0, stock: 0, categoria: '' });

  // Cargar productos al iniciar
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      // Enviamos el email como parámetro en la URL
      const res = await coreApi.get(`/inventory?email=${email}`);
      setProductos(res.data);
    } catch (error) {
      console.error("Error cargando inventario", error);
    }
  };

  const crearProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Recuperamos el email del dueño
      const emailDueño = localStorage.getItem('userEmail');

      // 2. Se lo agregamos a los datos del producto
      await coreApi.post('/inventory', { 
        ...nuevoProducto, 
        precio: Number(nuevoProducto.precio), // <--- ESTO ES CLAVE
        stock: Number(nuevoProducto.stock),   // <--- ESTO TAMBIÉN
        usuarioEmail: emailDueño 
      });

      setNuevoProducto({ nombre: '', precio: 0, stock: 0, categoria: '' });
      cargarProductos();
      alert('Producto creado correctamente');
    } catch (error) {
      console.error(error); // Para ver el error en consola si falla
      alert('Error al crear producto. Verifica que no falten datos.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestión de Inventario</Typography>

      {/* Formulario de Creación */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Agregar Nuevo Producto</Typography>
        <form onSubmit={crearProducto}>
          <Grid container spacing={2}>
            <Grid size={3}>
              <TextField label="Nombre" fullWidth value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} />
            </Grid>
            <Grid size={3}>
              <TextField label="Precio" type="number" fullWidth value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({...nuevoProducto, precio: Number(e.target.value)})} />
            </Grid>
            <Grid size={3}>
              <TextField label="Stock Inicial" type="number" fullWidth value={nuevoProducto.stock} onChange={(e) => setNuevoProducto({...nuevoProducto, stock: Number(e.target.value)})} />
            </Grid>
            <Grid size={3}>
              <Button type="submit" variant="contained" fullWidth sx={{ height: '100%' }}>Guardar</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Tabla de Productos */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod: any) => (
              <TableRow key={prod._id}>
                <TableCell>{prod.nombre}</TableCell>
                <TableCell>{prod.categoria || 'General'}</TableCell>
                <TableCell align="right">${prod.precio}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: prod.stock < 5 ? 'red' : 'green' }}>
                    {prod.stock}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};