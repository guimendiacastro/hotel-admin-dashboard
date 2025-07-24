import { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box
} from '@mui/material';

function CreateHouse() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    primary_image_url: '',
    capacity: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/houses`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('House created successfully!');
      setError(false);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
      setError(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight={600}>
              Create New House
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                name="name"
                label="House Name"
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="description"
                label="Description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                name="address"
                label="Address"
                value={form.address}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="primary_image_url"
                label="Image URL"
                value={form.primary_image_url}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="capacity"
                label="Capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                fullWidth
              />
              <Button type="submit" variant="contained" fullWidth>
                Create House
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={!!message}
        autoHideDuration={4000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setMessage('')}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CreateHouse;
