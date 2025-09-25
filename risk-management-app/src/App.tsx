import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, IconButton, Container } from '@mui/material';
import { Brightness4, Brightness7, ExitToApp } from '@mui/icons-material';
import { getStoredDarkMode, setStoredDarkMode, setStoredCurrentPage } from './utils/localStorage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Scenarios from './pages/Scenarios';
import Plans from './pages/Plans';
import Remediations from './pages/Remediations';
import Inventory from './pages/Inventory';
import EmergencyContacts from './pages/EmergencyContacts';

function AppContent() {
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(() => getStoredDarkMode());

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setStoredDarkMode(newDarkMode);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Store current page when location changes
  useEffect(() => {
    setStoredCurrentPage(location.pathname);
  }, [location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Risk Management
          </Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/scenarios">Scenarios</Button>
          <Button color="inherit" component={Link} to="/plans">Plans</Button>
          <Button color="inherit" component={Link} to="/remediations">Remediations</Button>
          <Button color="inherit" component={Link} to="/inventory">Inventory</Button>
          <Button color="inherit" component={Link} to="/contacts">Contacts</Button>
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/remediations" element={<Remediations />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/contacts" element={<EmergencyContacts />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
