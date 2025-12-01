import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { Login } from './pages/login';
import { Layout } from './components/layout';
import { Inventario } from './pages/inventario';
import { Ventas } from './pages/ventas'; // <--- Importante
import { Reportes } from './pages/reportes';

const ReportesPlaceholder = () => <h2>Configuración de Reportes (En construcción)</h2>;

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<Layout />}>
           <Route index element={<Navigate to="/dashboard/inventario" replace />} />
           <Route path="inventario" element={<Inventario />} />
           <Route path="ventas" element={<Ventas />} /> {/* <--- Pantalla Real */}
           <Route path="reportes" element={<Reportes />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;