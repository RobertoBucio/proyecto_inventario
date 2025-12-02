import { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography, Alert } from '@mui/material';
import { authApi } from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Para redirigir después del login

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // 1. Llamada al backend Auth (Puerto 3001)
      const response = await authApi.post('/auth/login', { email, password });
      
      // 2. Guardar el token en el navegador
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('userEmail', email);
      
      // 3. Redirigir al dashboard (crearemos esta ruta después)
      navigate('/dashboard');
      
    } catch (err: any) {
        setError('Credenciales incorrectas o error de conexión');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Correo Electrónico"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            <Box textAlign="center" sx={{ mt: 2 }}>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                        ¿No tienes cuenta? Regístrate aquí
                    </Typography>
                </Link>
            </Box>
          </Box>
          {/* Aquí podrías agregar un link a "Registrarse" */}
        </Paper>
      </Box>
    </Container>
  );
};