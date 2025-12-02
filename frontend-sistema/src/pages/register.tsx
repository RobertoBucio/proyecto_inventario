import { useState } from 'react';
import { Box, Button, Container, Paper, TextField, Typography, Alert } from '@mui/material';
import { authApi } from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos

    try {
      // 1. Enviamos los datos para CREAR el usuario
      await authApi.post('/auth/register', { email, password });

      // 2. Inmediatamente hacemos LOGIN automático con esos mismos datos
      const loginResponse = await authApi.post('/auth/login', { email, password });

      // 3. Guardamos el token y el email (igual que hacíamos en el Login)
      localStorage.setItem('token', loginResponse.data.access_token);
      localStorage.setItem('userEmail', email);

      // 4. Redirigimos directo al Dashboard (sin pasar por Login)
      alert('¡Cuenta creada! Bienvenido.');
      navigate('/dashboard');

    } catch (err: any) {
      console.error(err);
      setError('Error al registrar. Verifica si el correo ya existe.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Crear Nueva Cuenta
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleRegister}>
            <TextField
              margin="normal" required fullWidth label="Correo Electrónico"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal" required fullWidth label="Contraseña" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Registrarse
            </Button>
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button fullWidth>¿Ya tienes cuenta? Inicia Sesión</Button>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};