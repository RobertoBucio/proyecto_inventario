import { useEffect, useState } from 'react';
import { Button, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';
import { AddShoppingCart, Receipt } from '@mui/icons-material';
import { coreApi } from '../api/axios';

export const Ventas = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [productoSelec, setProductoSelec] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [cliente, setCliente] = useState('Cliente General');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Cargar productos para el "Select"
  useEffect(() => {
    coreApi.get('/inventory').then(res => setProductos(res.data));
  }, []);

  // Agregar al carrito (Visualmente)
  const agregarAlCarrito = () => {
    const prod = productos.find(p => p._id === productoSelec);
    if (!prod) return;

    if (prod.stock < cantidad) {
      setMensaje({ tipo: 'error', texto: `Solo hay ${prod.stock} unidades de ${prod.nombre}` });
      return;
    }

    const item = {
      _id: prod._id,
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: Number(cantidad),
      subtotal: prod.precio * Number(cantidad)
    };

    setCarrito([...carrito, item]);
    setMensaje({ tipo: '', texto: '' });
  };

  // Finalizar Venta (Enviar al Backend)
  const finalizarVenta = async () => {
    try {
      // Preparamos los datos como los pide el Backend NestJS
      const ventaData = {
        cliente: cliente,
        items: carrito.map(item => ({
          productId: item._id,
          cantidad: item.cantidad
        }))
      };

      await coreApi.post('/sales', ventaData);
      
      setMensaje({ tipo: 'success', texto: '¡Venta realizada con éxito! El inventario se ha actualizado.' });
      setCarrito([]); // Limpiar carrito
      
      // Recargar productos para ver el stock actualizado
      coreApi.get('/inventory').then(res => setProductos(res.data));
      
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al procesar la venta. Verifique el stock.' });
    }
  };

  const totalVenta = carrito.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Punto de Venta</Typography>

      {mensaje.texto && <Alert severity={mensaje.tipo as any} sx={{ mb: 2 }}>{mensaje.texto}</Alert>}

      <Grid container spacing={3}>
        {/* Panel Izquierdo: Agregar Productos */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Agregar Producto</Typography>
            
            <TextField 
              label="Nombre del Cliente" 
              fullWidth 
              value={cliente} 
              onChange={(e) => setCliente(e.target.value)} 
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Seleccionar Producto</InputLabel>
              <Select
                value={productoSelec}
                label="Seleccionar Producto"
                onChange={(e) => setProductoSelec(e.target.value)}
              >
                {productos.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.nombre} - ${p.precio} (Stock: {p.stock})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField 
              label="Cantidad" 
              type="number" 
              fullWidth 
              value={cantidad} 
              onChange={(e) => setCantidad(Number(e.target.value))} 
              sx={{ mb: 3 }}
            />

            <Button 
              variant="contained" 
              startIcon={<AddShoppingCart />} 
              fullWidth 
              onClick={agregarAlCarrito}
              disabled={!productoSelec}
            >
              Agregar al Carrito
            </Button>
          </Paper>
        </Grid>

        {/* Panel Derecho: El Carrito y Total */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Ticket de Venta</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cant.</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carrito.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.nombre}</TableCell>
                      <TableCell align="right">{row.cantidad}</TableCell>
                      <TableCell align="right">${row.subtotal}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>TOTAL A PAGAR</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                      ${totalVenta}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Button 
              variant="contained" 
              color="success" 
              size="large" 
              fullWidth 
              startIcon={<Receipt />} 
              sx={{ mt: 3 }}
              onClick={finalizarVenta}
              disabled={carrito.length === 0}
            >
              Finalizar Venta
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};