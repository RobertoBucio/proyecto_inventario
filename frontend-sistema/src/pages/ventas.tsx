import { useState, useEffect } from 'react';
import { coreApi } from '../api/axios'; 

interface Producto {
  _id: string;
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

  // 1. CARGAR PRODUCTOS
  const cargarProductos = async () => {
    try {
      const respuesta = await coreApi.get('/inventory');
      setProductos(respuesta.data);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // 2. CALCULAR TOTAL
  useEffect(() => {
    const nuevoTotal = carrito.reduce((suma, item) => {
      return suma + (Number(item.precio) * item.cantidad);
    }, 0);
    setTotal(nuevoTotal);
  }, [carrito]);

  // AGREGAR (O INCREMENTAR)
  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find(item => item._id === producto._id);

    if (itemExistente) {
      // Si ya existe, verificamos stock antes de sumar
      if (itemExistente.cantidad < producto.stock) {
        setCarrito(carrito.map(item => 
          item._id === producto._id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        ));
      } else {
        alert("¡Has alcanzado el límite de stock disponible!");
      }
    } else {
      if (producto.stock > 0) {
        setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      } else {
        alert("Producto agotado");
      }
    }
  };

  // DISMINUIR CANTIDAD
  const disminuirCantidad = (id: string) => {
    const item = carrito.find(i => i._id === id);
    if (item && item.cantidad > 1) {
      setCarrito(carrito.map(i => 
        i._id === id ? { ...i, cantidad: i.cantidad - 1 } : i
      ));
    } else {
      // Si llega a 0, lo sacamos del carrito
      eliminarDelCarrito(id);
    }
  };

  // ELIMINAR DEL CARRITO
  const eliminarDelCarrito = (id: string) => {
    setCarrito(carrito.filter(item => item._id !== id));
  };

  // --- ¡NUEVA FUNCIÓN DE VENTA CON RESTA DE STOCK! ---
  const realizarVenta = async () => {
    if (carrito.length === 0) return;

    try {
      // Recorremos el carrito y actualizamos cada producto en la base de datos
      for (const item of carrito) {
        const nuevoStock = item.stock - item.cantidad;
        
        // Enviamos la orden al servidor: "Actualiza el stock de este ID"
        await coreApi.patch(`/inventory/${item._id}`, { stock: nuevoStock });
      }

      alert(`¡Venta exitosa! Total cobrado: $${total.toFixed(2)}`);
      
      setCarrito([]); // Limpiar carrito
      setTotal(0);
      cargarProductos(); // RECARGAR la lista para ver el stock actualizado
      
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      alert("Hubo un error al descontar el stock. Verifica tu conexión.");
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Punto de Venta</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
        
        {/* COLUMNA IZQUIERDA: PRODUCTOS DISPONIBLES */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <h2>Inventario</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {productos.map((prod) => (
              <div key={prod._id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', background: '#222' }}>
                <h3>{prod.nombre}</h3>
                <p>Precio: ${Number(prod.precio).toFixed(2)}</p>
                <p style={{ color: prod.stock === 0 ? 'red' : '#0f0' }}>Stock: {prod.stock}</p>
                <button 
                  onClick={() => agregarAlCarrito(prod)}
                  disabled={prod.stock === 0}
                  style={{ 
                    backgroundColor: prod.stock === 0 ? 'gray' : '#007bff', 
                    color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', width: '100%', borderRadius: '4px' 
                  }}
                >
                  {prod.stock === 0 ? 'Agotado' : 'Agregar'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: CARRITO */}
        <div style={{ flex: 1, borderLeft: '1px solid #555', paddingLeft: '20px', minWidth: '250px' }}>
          <h2>Carrito</h2>
          
          {carrito.length === 0 ? <p>Vacío</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {carrito.map((item) => (
                <li key={item._id} style={{ marginBottom: '15px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong>{item.nombre}</strong>
                    <span>${(item.cantidad * Number(item.precio)).toFixed(2)}</span>
                  </div>
                  
                  {/* CONTROLES DE CANTIDAD */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => disminuirCantidad(item._id)}
                      style={{ background: '#555', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.cantidad}</span>
                    
                    <button 
                      onClick={() => agregarAlCarrito(item)}
                      style={{ background: '#555', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}
                    >
                      +
                    </button>

                    <button 
                      onClick={() => eliminarDelCarrito(item._id)}
                      style={{ background: 'red', color: 'white', border: 'none', marginLeft: 'auto', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Eliminar
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
                color: 'white', padding: '15px', width: '100%', border: 'none', 
                fontSize: '20px', borderRadius: '8px', cursor: carrito.length === 0 ? 'not-allowed' : 'pointer', marginTop: '10px'
              }}
            >
              Confirmar Compra
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Ventas;