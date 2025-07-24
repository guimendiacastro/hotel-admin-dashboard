import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';

import {
  Container,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Alert,
  Stack
} from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await login(email, password);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight={600}>
              Admin Login
            </Typography>
          }
        />
        <CardContent>
          <Box component="form" onSubmit={handleLogin} noValidate>
            <Stack spacing={3}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Alert severity="error" sx={{ textAlign: 'center' }}>
                  {error}
                </Alert>
              )}
              <Button type="submit" variant="contained" size="large" fullWidth>
                Login
              </Button>
            </Stack>
          </Box>

          <Box mt={4} textAlign="center">
            <Button onClick={() => navigate('/register')} size="small">
              Create an account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
