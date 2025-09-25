import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Risk Management App
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please sign in with your Google account to continue.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogin} size="large">
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default Login;