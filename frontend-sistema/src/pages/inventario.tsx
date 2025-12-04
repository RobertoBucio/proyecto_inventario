import React, { useState, useEffect } from 'react';
// Asegúrate de importar tu cliente de axios correctamente
import { coreApi } from '../api/axios'; 

interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  usuarioEmail: string;
}

const Inventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  
  // Estado para el formulario de crear
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: ''
  });

  // 1. CARGAR PRODUCTOS (Solo los tuyos)
  const cargarProductos = async () => {
    try {
      const emailUsuario = localStorage.getItem('userEmail');
      const respuesta = await coreApi.get('/inventory');
      // AGREGA ESTA LÍNEA PARA VER SI HAY USUARIO
      console.log("Mi Usuario es:", emailUsuario); 
      
      // AGREGA ESTA PARA VER QUÉ LLEGA DEL SERVIDOR
      console.log("Productos del servidor:", respuesta.data);

      const misProductos = respuesta.data.filter((p: any) => p.usuarioEmail === emailUsuario);
      setProductos(misProductos);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    }
  };

  // Cargar al iniciar la página
  useEffect(() => {
    cargarProductos();
  }, []);

  // 2. CREAR PRODUCTO NUEVO
  const manejarCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const emailUsuario = localStorage.getItem('userEmail');
      
      await coreApi.post('/inventory', {
        nombre: nuevoProducto.nombre,
        precio: Number(nuevoProducto.precio),
        stock: Number(nuevoProducto.stock),
        categoria: nuevoProducto.categoria,
        usuarioEmail: emailUsuario // Importante para que sea tuyo
      });

      alert('Producto creado con éxito');
      setNuevoProducto({ nombre: '', precio: '', stock: '', categoria: '' }); // Limpiar form
      cargarProductos(); // Recargar la lista
    } catch (error: any) {
      console.error(error);
      alert('Error al crear producto');
    }
  };

  // 3. ELIMINAR PRODUCTO (¡NUEVA FUNCIÓN!)
  const eliminarProducto = async (id: string) => {
    // Preguntar antes de borrar para evitar accidentes
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) {
      return;
    }

    try {
      // Petición DELETE al servidor
      await coreApi.delete(`/inventory/${id}`);
      
      // Actualizar la lista visualmente sin recargar la página
      setProductos(productos.filter(p => p._id !== id));
      alert("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("No se pudo eliminar el producto");
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gestión de Inventario</h1>

      {/* FORMULARIO DE CREACIÓN */}
      <div style={{ background: '#333', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>Agregar Nuevo Producto</h3>
        <form onSubmit={manejarCrear} style={{ display: 'grid', gap: '10px' }}>
          <input 
            placeholder="Nombre del producto" 
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
            Guardar Producto
          </button>
        </form>
      </div>

      {/* LISTA DE PRODUCTOS CON BOTÓN ELIMINAR */}
      <h3>Mis Productos Actuales</h3>
      {productos.length === 0 ? <p>No tienes productos registrados.</p> : (
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
                  {/* BOTÓN ELIMINAR */}
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