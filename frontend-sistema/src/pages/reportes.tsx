import { useState } from 'react';
import { Button, Container, Paper, TextField, Typography, Alert } from '@mui/material';
import { Email } from '@mui/icons-material';

export const Reportes = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState(false);

  const guardarConfiguracion = (e: React.FormEvent) => {
    e.preventDefault();
    // En un sistema real, aquí harías un POST al backend para guardar este email en la BD.
    // Por ahora, lo simulamos visualmente.
    console.log("Email configurado para reportes:", email);
    setMensaje(true);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Configuración de Reportes</Typography>
      
      <Paper sx={{ p: 4, mt: 3 }}>
        <Typography variant="body1" paragraph>
          El sistema genera automáticamente reportes Semanales, Mensuales y Anuales en formato PDF.
          Ingrese el correo electrónico donde desea recibir estos informes.
        </Typography>

        {mensaje && <Alert severity="success" sx={{ mb: 2 }}>Correo actualizado correctamente.</Alert>}

        <form onSubmit={guardarConfiguracion}>
          <TextField 
            label="Correo Electrónico Destino" 
            fullWidth 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <Button 
            variant="contained" 
            startIcon={<Email />} 
            fullWidth 
            type="submit"
          >
            Guardar Configuración
          </Button>
        </form>
      </Paper>
    </Container>
  );
};