import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Alert,
  IconButton,
  Modal,
  Stack,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';

import {
  ArrowBack,
  CalendarToday,
  Email,
  Phone,
  Error as ErrorIcon,
  PersonAdd
} from '@mui/icons-material';
import { getReservationById, getGuests, createGuest } from '../api/api';

export default function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [guestForm, setGuestForm] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    country_of_residency: '',
    nationality: '',
    id_type: 'Passport',
    id_number: '',
    id_issued_by: ''
  });

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const [resData, guestData] = await Promise.all([
          getReservationById(id),
          getGuests(id),
        ]);

        setReservation(resData.data);
        setGuests(guestData.data);
      } catch (err) {
        setError('Failed to load reservation details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReservationData();
  }, [id]);

  const handleGuestChange = (e) => {
    setGuestForm({ ...guestForm, [e.target.name]: e.target.value });
  };

  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGuest({ ...guestForm, reservation_id: id });

      setShowModal(false);
      setGuestForm({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        country_of_residency: '',
        nationality: '',
        id_type: 'Passport',
        id_number: '',
        id_issued_by: ''
      });

      const guestRes = await getGuests(id);
      setGuests(guestRes.data);
    } catch (err) {
      alert('Failed to add guest: ' + (err.response?.data?.error || err.message));
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const formatDOB = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !reservation) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error" icon={<ErrorIcon />}>
          {error || 'Reservation not found.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box mb={3}>
        <IconButton onClick={() => navigate(-1)} size="small" sx={{ mb: 1 }}>
          <ArrowBack fontSize="small" />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          {reservation.name || `Reservation #${reservation.reservation_code}`}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader title="Stay Details" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" gap={2} alignItems="center">
                        <CalendarToday color="primary" />
                        <Box>
                          <Typography variant="subtitle2">Check-in</Typography>
                          <Typography>{formatDate(reservation.check_in_date)}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" gap={2} alignItems="center">
                        <CalendarToday color="error" />
                        <Box>
                          <Typography variant="subtitle2">Check-out</Typography>
                          <Typography>{formatDate(reservation.check_out_date)}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Special Requests" />
                <Divider />
                <CardContent>
                  {reservation.special_requests ? (
                    <Typography>{reservation.special_requests}</Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      None
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ mt: 4 }}>
            <CardHeader title="Contact Info" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" gap={2} alignItems="center">
                    <Email color="primary" />
                    <Box>
                      <Typography variant="subtitle2">Email</Typography>
                      <Typography>{reservation.contact_email}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" gap={2} alignItems="center">
                    <Phone color="primary" />
                    <Box>
                      <Typography variant="subtitle2">Phone</Typography>
                      <Typography>{reservation.contact_phone}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 4 }}>
            <CardHeader
              title={`Guest List (${guests.length})`}
              action={
                <IconButton onClick={() => setShowModal(true)}>
                  <PersonAdd />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              {guests.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No guests registered for this reservation.
                </Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Full Name</TableCell>
                      <TableCell>DOB</TableCell>
                      <TableCell>Residency</TableCell>
                      <TableCell>Nationality</TableCell>
                      <TableCell>Document Type</TableCell>
                      <TableCell>Document Number</TableCell>
                      <TableCell>Issued By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>{guest.first_name} {guest.last_name}</TableCell>
                        <TableCell>{formatDOB(guest.date_of_birth)}</TableCell>
                        <TableCell>{guest.country_of_residency}</TableCell>
                        <TableCell>{guest.nationality}</TableCell>
                        <TableCell>{guest.id_type}</TableCell>          
                        <TableCell>{guest.id_number}</TableCell>       
                        <TableCell>{guest.id_issued_by}</TableCell>     
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
        <Card sx={{ backgroundColor: '#f9f9f9' }}>
          <CardHeader title="Reservation Summary" />
          <Divider />
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              {calculateNights(reservation.check_in_date, reservation.check_out_date)} nights stay
            </Typography>
            {reservation.name && (
              <>
                <Typography variant="subtitle2">Name:</Typography>
                <Typography>{reservation.name}</Typography>
              </>
            )}
            {reservation.house?.name && (
              <>
                <Typography variant="subtitle2">House:</Typography>
                <Typography>{reservation.house.name}</Typography>
              </>
            )}

            {/* ✅ Moved inside and added spacing */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => {
                if (!reservation?.reservation_code || !reservation?.house_id) {
                  alert('Missing reservation code or house ID.');
                  return;
                }

                const encodedCode = btoa(reservation.reservation_code); // base64 encode the reservation code
                const url = `${import.meta.env.VITE_GUEST_FORM_BASE_URL}/?k=${encodeURIComponent(encodedCode)}&house=${reservation.house_id}`;

                navigator.clipboard.writeText(url)
                  .then(() => alert('Link copied to clipboard!'))
                  .catch(() => alert('Failed to copy link.'));
              }}
            >
              Copy Guest Link
            </Button>

          </CardContent>
        </Card>

        </Grid>
      </Grid>

      {/* Guest Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          component="form"
          onSubmit={handleGuestSubmit}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: 400
          }}
        >
          <Typography variant="h6" mb={2}>
            Add Guest
          </Typography>
          <Stack spacing={2}>
            <TextField name="first_name" label="First Name" required onChange={handleGuestChange} />
            <TextField name="last_name" label="Last Name" required onChange={handleGuestChange} />
           <TextField
              name="date_of_birth"
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              required
              value={guestForm.date_of_birth?.split('T')[0] || ''} // 👈 format correctly
              onChange={handleGuestChange}
            />

            <TextField name="country_of_residency" label="Country of Residency" onChange={handleGuestChange} />
            <TextField name="nationality" label="Nationality" onChange={handleGuestChange} />
            <FormControl fullWidth>
            <InputLabel>Document Type</InputLabel>
            <Select
              name="id_type"                   // ✅ was: document_type
              value={guestForm.id_type}
              label="Document Type"
              onChange={handleGuestChange}
            >
              <MenuItem value="passport">Passport</MenuItem>
              <MenuItem value="national_id">National ID</MenuItem>
            </Select>
          </FormControl>

          <TextField name="id_number" label="Document Number" onChange={handleGuestChange} />
          <TextField name="id_issued_by" label="Issued By" onChange={handleGuestChange} />
            <Button type="submit" variant="contained" fullWidth>
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}
