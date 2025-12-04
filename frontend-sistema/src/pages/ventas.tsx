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

  // 1. CARGAR PRODUCTOS (Esta función la usaremos para refrescar la pantalla)
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

  // 2. CALCULAR TOTAL (CORRECCIÓN IMPORTANTE)
  useEffect(() => {
    // Usamos Number() en TODAS partes para asegurar que no sea texto
    const nuevoTotal = carrito.reduce((suma, item) => {
      return suma + (Number(item.precio) * Number(item.cantidad));
    }, 0);
    setTotal(nuevoTotal);
  }, [carrito]);

  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find(item => item._id === producto._id);

    if (itemExistente) {
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

  const disminuirCantidad = (id: string) => {
    const item = carrito.find(i => i._id === id);
    if (item && item.cantidad > 1) {
      setCarrito(carrito.map(i => 
        i._id === id ? { ...i, cantidad: i.cantidad - 1 } : i
      ));
    } else {
      eliminarDelCarrito(id);
    }
  };

  const eliminarDelCarrito = (id: string) => {
    setCarrito(carrito.filter(item => item._id !== id));
  };

  // --- FUNCIÓN DE VENTA QUE ACTUALIZA EL STOCK VISUALMENTE ---
  const realizarVenta = async () => {
    if (carrito.length === 0) return;

    try {
      // 1. Enviamos las actualizaciones al servidor una por una
      for (const item of carrito) {
        const nuevoStock = item.stock - item.cantidad;
        await coreApi.patch(`/inventory/${item._id}`, { stock: nuevoStock });
      }

      alert(`¡Venta exitosa! Total cobrado: $${total.toFixed(2)}`);
      
      // 2. Limpiamos el carrito
      setCarrito([]); 
      setTotal(0);

      // 3. ¡ESTE ES EL TRUCO! Recargamos los productos para ver el stock actualizado
      await cargarProductos(); 
      
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      alert("Hubo un error al descontar el stock. Verifica tu conexión.");
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Punto de Venta</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
        
        {/* LISTA DE PRODUCTOS (Izquierda) */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <h2>Inventario Disponible</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {productos.map((prod) => (
              <div key={prod._id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', background: '#222' }}>
                <h3>{prod.nombre}</h3>
                <p>Precio: ${Number(prod.precio).toFixed(2)}</p>
                {/* Aquí mostramos el stock en tiempo real */}
                <p style={{ color: prod.stock === 0 ? 'red' : '#0f0', fontWeight: 'bold' }}>
                  Stock Actual: {prod.stock}
                </p>
                <button 
                  onClick={() => agregarAlCarrito(prod)}
                  disabled={prod.stock === 0}
                  style={{ 
                    backgroundColor: prod.stock === 0 ? 'gray' : '#007bff', 
                    color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer', width: '100%', borderRadius: '4px' 
                  }}
                >
                  {prod.stock === 0 ? 'Agotado' : 'Agregar +'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CARRITO (Derecha) */}
        <div style={{ flex: 1, borderLeft: '1px solid #555', paddingLeft: '20px', minWidth: '250px' }}>
          <h2>Carrito</h2>
          
          {carrito.length === 0 ? <p>El carrito está vacío</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {carrito.map((item) => (
                <li key={item._id} style={{ marginBottom: '15px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong>{item.nombre}</strong>
                    {/* Aseguramos que el subtotal se calcule bien */}
                    <span>${(Number(item.cantidad) * Number(item.precio)).toFixed(2)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => disminuirCantidad(item._id)}
                      style={{ background: '#555', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}
                    > - </button>
                    
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.cantidad}</span>
                    
                    <button 
                      onClick={() => agregarAlCarrito(item)}
                      style={{ background: '#555', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}
                    > + </button>

                    <button 
                      onClick={() => eliminarDelCarrito(item._id)}
                      style={{ background: 'red', color: 'white', border: 'none', marginLeft: 'auto', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    > Eliminar </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: '20px', borderTop: '2px solid white', paddingTop: '10px' }}>
            {/* AQUÍ SE MUESTRA EL TOTAL */}
            <h2>Total a Pagar: ${Number(total).toFixed(2)}</h2>
            
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