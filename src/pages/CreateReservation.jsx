import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getHouses, createReservation } from '../api/api'; 


function CreateReservation() {
  const [houses, setHouses] = useState([]);
  const [form, setForm] = useState({
    name: '',
    house_id: '',
    reservation_code: '',
    check_in_date: '',
    check_out_date: '',
    contact_email: '',
    contact_phone: '',
    special_requests: '',
    status: 'confirmed'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const { data } = await getHouses();
        setHouses(data);
      } catch (err) {
        setError(true);
      }
    };
    fetchHouses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReservation(form);
      setMessage('Reservation created successfully!');
      setError(false);

      setTimeout(() => {
        navigate('/');
      }, 1000);
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
              Create Reservation
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                select
                name="house_id"
                label="House"
                value={form.house_id}
                onChange={handleChange}
                required
                fullWidth
              >
                <MenuItem value="">Select a house</MenuItem>
                {houses.map((house) => (
                  <MenuItem key={house.id} value={house.id}>
                    {house.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Reservation Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Reservation Code"
                name="reservation_code"
                value={form.reservation_code}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Check-In Date"
                name="check_in_date"
                type="date"
                value={form.check_in_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />

              <TextField
                label="Check-Out Date"
                name="check_out_date"
                type="date"
                value={form.check_out_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />

              <TextField
                label="Contact Email"
                name="contact_email"
                type="email"
                value={form.contact_email}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Contact Phone"
                name="contact_phone"
                value={form.contact_phone}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Special Requests"
                name="special_requests"
                value={form.special_requests}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />

              <Button type="submit" variant="contained" fullWidth>
                Create Reservation
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

export default CreateReservation;
