import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'; // <--- Importar esto
import { Login } from './pages/login';
import { Layout } from './components/layout';
import Inventario from './pages/inventario';
import Ventas from './pages/ventas';
import { Reportes } from './pages/reportes';
import { Register } from './pages/register';

// --- CONFIGURACIÓN DE TU ESTILO ---
const miTema = createTheme({
  palette: {
    mode: 'dark', // Cambia a 'light' si prefieres fondo blanco
    primary: {
      main: '#1976d2', // Azul corporativo (Botones principales, Headers)
    },
    secondary: {
      main: '#f50057', // Rosa/Rojo (Botones de acción, alertas)
    },
    background: {
      default: '#121212', // Color de fondo de la página
      paper: '#1e1e1e',   // Color de las tarjetas/cuadros
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Puedes cambiar la fuente aquí
    h4: {
      fontWeight: 600, // Títulos más gruesos
    },
  },
  shape: {
    borderRadius: 12, // Bordes más redondeados en botones y cuadros
  },
});

function App() {
  return (
    // Envuelve todo con ThemeProvider
    <ThemeProvider theme={miTema}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
           {/* ... Tus rutas siguen igual ... */}
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/dashboard" element={<Layout />}>
             <Route index element={<Navigate to="/dashboard/inventario" replace />} />
             <Route path="inventario" element={<Inventario />} />
             <Route path="ventas" element={<Ventas />} />
             <Route path="reportes" element={<Reportes />} />
             <Route path="register" element={<Register />} />
           </Route>
           <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;