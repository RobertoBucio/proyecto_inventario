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
      const res = await coreApi.get('/inventory');
      setProductos(res.data);
    } catch (error) {
      console.error("Error cargando inventario", error);
    }
  };

  const crearProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await coreApi.post('/inventory', nuevoProducto);
      setNuevoProducto({ nombre: '', precio: 0, stock: 0, categoria: '' }); // Limpiar form
      cargarProductos(); // Recargar tabla
      alert('Producto creado correctamente');
    } catch (error) {
      alert('Error al crear producto');
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
            <Grid item xs={3}>
              <TextField label="Nombre" fullWidth value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} />
            </Grid>
            <Grid item xs={3}>
              <TextField label="Precio" type="number" fullWidth value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({...nuevoProducto, precio: Number(e.target.value)})} />
            </Grid>
            <Grid item xs={3}>
              <TextField label="Stock Inicial" type="number" fullWidth value={nuevoProducto.stock} onChange={(e) => setNuevoProducto({...nuevoProducto, stock: Number(e.target.value)})} />
            </Grid>
            <Grid item xs={3}>
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