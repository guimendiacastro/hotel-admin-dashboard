import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // First register the user
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/register`, { email, password });

      // Then log in to get the token
      const loginResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/login`, {
        email,
        password
      });

      const token = loginResponse.data.token;
      localStorage.setItem('token', token);

      setMessage('Account created! Redirecting to dashboard...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight={600}>
              Register Admin Account
            </Typography>
          }
        />
        <CardContent>
          <Box component="form" onSubmit={handleRegister} noValidate>
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
              <Button type="submit" variant="contained" size="large" fullWidth>
                Create Account
              </Button>
            </Stack>
          </Box>

          {message && (
            <Alert severity="success" sx={{ mt: 3, textAlign: 'center' }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 3, textAlign: 'center' }}>
              {error}
            </Alert>
          )}

          <Box mt={4} textAlign="center">
            <Button onClick={() => navigate('/')} size="small">
              Back to Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
