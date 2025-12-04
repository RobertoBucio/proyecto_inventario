import { useState, useEffect } from 'react';
// ASEGÚRATE DE QUE LA RUTA SEA CORRECTA (puede ser '../api/axios' o '../api/api')
import { coreApi } from '../api/axios'; 

interface Producto {
  _id: string; // O 'id' dependiendo de tu base de datos
  nombre: string;
  precio: number;
  stock: number;
  usuarioEmail: string;
}

interface ItemCarrito extends Producto {
  cantidad: number;
}

const Ventas = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [total, setTotal] = useState<number>(0);

  // 1. CARGAR PRODUCTOS (CORREGIDO: FILTRA POR USUARIO)
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const emailUsuario = localStorage.getItem('userEmail');
        const respuesta = await coreApi.get('/inventory');
        
        // AQUÍ ESTÁ EL TRUCO: Filtramos para ver solo TUS productos
        const misProductos = respuesta.data.filter((p: any) => p.usuarioEmail === emailUsuario);
        
        setProductos(misProductos);
      } catch (error) {
        console.error("Error cargando inventario:", error);
      }
    };
    cargarProductos();
  }, []);

  // 2. CALCULAR TOTAL (CORREGIDO: ASEGURA QUE SEAN NÚMEROS)
  useEffect(() => {
    const nuevoTotal = carrito.reduce((suma, item) => {
      // Usamos Number() por seguridad, por si el precio viene como texto "100"
      return suma + (Number(item.precio) * item.cantidad);
    }, 0);
    setTotal(nuevoTotal);
  }, [carrito]);

  // Función para agregar al carrito
  const agregarAlCarrito = (producto: Producto) => {
    // Verificamos si ya está en el carrito
    const itemExistente = carrito.find(item => item._id === producto._id);

    if (itemExistente) {
      // Si ya está, aumentamos cantidad (si hay stock)
      if (itemExistente.cantidad < producto.stock) {
        setCarrito(carrito.map(item => 
          item._id === producto._id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        ));
      } else {
        alert("No hay más stock disponible");
      }
    } else {
      // Si no está, lo agregamos con cantidad 1
      if (producto.stock > 0) {
        setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      } else {
        alert("Producto agotado");
      }
    }
  };

  // Función para quitar del carrito
  const eliminarDelCarrito = (id: string) => {
    setCarrito(carrito.filter(item => item._id !== id));
  };

  // Función para confirmar la venta (Solo visual por ahora)
  const realizarVenta = () => {
    if (carrito.length === 0) return;
    
    alert(`Venta realizada con éxito. Total a cobrar: $${total}`);
    // Aquí iría la lógica para enviar la venta al backend y descontar stock
    setCarrito([]);
    setTotal(0);
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Punto de Venta</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        
        {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
        <div style={{ flex: 2 }}>
          <h2>Mis Productos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {productos.map((prod) => (
              <div key={prod._id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                <h3>{prod.nombre}</h3>
                <p>Precio: ${Number(prod.precio).toFixed(2)}</p>
                <p>Stock: {prod.stock}</p>
                <button 
                  onClick={() => agregarAlCarrito(prod)}
                  style={{ backgroundColor: '#007bff', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', width: '100%' }}
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: CARRITO Y TOTAL */}
        <div style={{ flex: 1, borderLeft: '1px solid #555', paddingLeft: '20px' }}>
          <h2>Carrito de Compras</h2>
          
          {carrito.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {carrito.map((item) => (
                <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #444', paddingBottom: '5px' }}>
                  <div>
                    <strong>{item.nombre}</strong> <br/>
                    {item.cantidad} x ${Number(item.precio)}
                  </div>
                  <div>
                    <span style={{ marginRight: '10px' }}>${(item.cantidad * Number(item.precio))}</span>
                    <button 
                      onClick={() => eliminarDelCarrito(item._id)}
                      style={{ background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: '20px', borderTop: '2px solid white', paddingTop: '10px' }}>
            <h2>Total: ${total.toFixed(2)}</h2>
            <button 
              onClick={realizarVenta}
              disabled={carrito.length === 0}
              style={{ 
                backgroundColor: carrito.length === 0 ? 'gray' : 'green', 
                color: 'white', 
                padding: '10px', 
                width: '100%', 
                border: 'none', 
                fontSize: '18px',
                cursor: carrito.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Cobrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Ventas;