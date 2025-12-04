import { useState, useEffect } from 'react';
import { coreApi } from '../api/axios';

interface Producto {
  _id: string; // MongoDB usa _id
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

const Inventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  
  // Estado para el formulario
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: ''
  });

  // FUNCIÓN PARA CARGAR LA LISTA
  const cargarProductos = async () => {
    try {
      const respuesta = await coreApi.get('/inventory');
      // Guardamos TODO lo que viene del servidor (sin filtros)
      setProductos(respuesta.data);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    }
  };

  // Cargar al iniciar
  useEffect(() => {
    cargarProductos();
  }, []);

  // FUNCIÓN CREAR
  const manejarCrear = async (e: any) => {
    e.preventDefault();
    try {
      const emailUsuario = localStorage.getItem('userEmail') || "admin@prueba.com";
      
      // 1. Enviamos el producto al servidor
      await coreApi.post('/inventory', {
        nombre: nuevoProducto.nombre,
        precio: Number(nuevoProducto.precio),
        stock: Number(nuevoProducto.stock),
        categoria: nuevoProducto.categoria,
        usuarioEmail: emailUsuario 
      });

      alert('Producto creado con éxito');
      
      // 2. Limpiamos el formulario
      setNuevoProducto({ nombre: '', precio: '', stock: '', categoria: '' });
      
      // 3. ¡IMPORTANTE! Recargamos la lista inmediatamente
      await cargarProductos(); 

    } catch (error: any) {
      console.error(error);
      alert('Error al crear producto');
    }
  };

  // FUNCIÓN ELIMINAR
  const eliminarProducto = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) {
      return;
    }

    try {
      // 1. Pedimos al servidor que borre
      await coreApi.delete(`/inventory/${id}`);
      
      alert("Producto eliminado correctamente");
      
      // 2. Recargamos la lista para ver que desapareció
      await cargarProductos();
      
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("No se pudo eliminar. Verifica que el Backend en Render esté actualizado.");
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gestión de Inventario</h1>

      {/* FORMULARIO */}
      <div style={{ background: '#333', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>Agregar Nuevo Producto</h3>
        <form onSubmit={manejarCrear} style={{ display: 'grid', gap: '10px' }}>
          <input 
            placeholder="Nombre" 
            value={nuevoProducto.nombre}
            onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
            required
            style={{ padding: '8px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="number" placeholder="Precio" 
              value={nuevoProducto.precio}
              onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
              required
              style={{ padding: '8px', flex: 1 }}
            />
            <input 
              type="number" placeholder="Stock" 
              value={nuevoProducto.stock}
              onChange={(e) => setNuevoProducto({...nuevoProducto, stock: e.target.value})}
              required
              style={{ padding: '8px', flex: 1 }}
            />
          </div>
          <input 
            placeholder="Categoría" 
            value={nuevoProducto.categoria}
            onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
            required
            style={{ padding: '8px' }}
          />
          <button type="submit" style={{ background: 'green', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
            Guardar
          </button>
        </form>
      </div>

      {/* LISTA */}
      <h3>Lista de Productos</h3>
      {productos.length === 0 ? <p>Cargando o lista vacía...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#444', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Nombre</th>
              <th style={{ padding: '10px' }}>Precio</th>
              <th style={{ padding: '10px' }}>Stock</th>
              <th style={{ padding: '10px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod._id} style={{ borderBottom: '1px solid #555' }}>
                <td style={{ padding: '10px' }}>{prod.nombre}</td>
                <td style={{ padding: '10px' }}>${Number(prod.precio).toFixed(2)}</td>
                <td style={{ padding: '10px' }}>{prod.stock}</td>
                <td style={{ padding: '10px' }}>
                  <button 
                    onClick={() => eliminarProducto(prod._id)}
                    style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Inventario;