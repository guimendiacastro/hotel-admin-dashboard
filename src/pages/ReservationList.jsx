import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservations } from '../api/api';
import axios from 'axios';

import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Paper,
  Grid,
  Button,
  Stack
} from '@mui/material';

import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterMode, setFilterMode] = useState('checkin');
  const [searchQuery, setSearchQuery] = useState('');




  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/api/reservations`);

        if (selectedHouse) url.searchParams.append('houseId', selectedHouse);
        if (filterDate) {
          if (filterMode === 'checkin') {
            url.searchParams.append('checkIn', filterDate);
          } else {
            url.searchParams.append('checkOut', filterDate);
          }
        }

        const { data } = await axios.get(url.toString(), {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReservations(data);
      } catch (err) {
        setError('Failed to load reservations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchHouses = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/houses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHouses(data);
      } catch (err) {
        console.error('Failed to fetch houses', err);
      }
    };

    fetchHouses();
    fetchReservations();
  }, [navigate, selectedHouse, filterDate, filterMode]);



  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error" icon={<ErrorIcon />}>
          {error}
        </Alert>
        <Box mt={2}>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  const filteredReservations = reservations.filter((r) =>
  r.name?.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <>
      {/* Top AppBar with Sign Out */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Reservations Dashboard
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login', { replace: true }); // <--- this is key
            }}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2} mb={4}>
          <Grid item xs={12} sm="auto">
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarIcon color="primary" />
              <Typography variant="h5" fontWeight={600}>
                Reservations
              </Typography>
            </Box>
          </Grid>
         <Grid item xs={12} md={4}>
            <TextField
              select
              label="Filter by House"
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value)}
              sx={{ minWidth: 200 }} // 👈 Add this line
            >
              <MenuItem value="">All Houses</MenuItem>
              {houses.map((house) => (
                <MenuItem key={house.id} value={house.id}>
                  {house.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                label="Filter Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              <Button
                variant={filterMode === 'checkin' ? 'contained' : 'outlined'}
                onClick={() => setFilterMode('checkin')}
              >
                Check-In
              </Button>
              <Button
                variant={filterMode === 'checkout' ? 'contained' : 'outlined'}
                onClick={() => setFilterMode('checkout')}
              >
                Check-Out
              </Button>
            </Box>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-reservation')}
              >
                New Reservation
              </Button>
              <Button variant="outlined" onClick={() => navigate('/houses')}>
                View Houses
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Search by Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </Grid>

        </Grid>

        <Paper elevation={3}>
          {reservations.length === 0 ? (
            <Box p={6} textAlign="center">
              <CalendarIcon fontSize="large" sx={{ color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6">No reservations found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first reservation to get started.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-reservation')}
              >
                Create Reservation
              </Button>
            </Box>
          ) : (
            <Box p={3} overflow="auto">
              <Typography variant="subtitle1" mb={2} fontWeight={500}>
                All Reservations ({reservations.length})
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Check-In</TableCell>
                    <TableCell>Check-Out</TableCell>
                    <TableCell>Contact Email</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                {filteredReservations.map((r) => (
                  <TableRow
                    key={r.id}
                    hover
                    onClick={() => navigate(`/reservations/${r.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      {r.name || '—'}
                    </TableCell>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 500 }}>
                      {r.reservation_code}
                    </TableCell>
                    <TableCell>{formatDate(r.check_in_date)}</TableCell>
                    <TableCell>{formatDate(r.check_out_date)}</TableCell>
                    <TableCell>{r.contact_email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
}
