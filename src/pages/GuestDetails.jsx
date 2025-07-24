import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Stack,
  Box
} from '@mui/material';

function GuestDetails() {
  const { id } = useParams();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/guests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const selected = data.find(g => g.id === parseInt(id));
        setGuest(selected);
      } catch (err) {
        console.error('Error fetching guest:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuest();
  }, [id]);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      {loading ? (
        <Card elevation={3}>
          <CardContent>
            <Skeleton height={40} width="60%" />
            <Stack spacing={2} mt={2}>
              <Skeleton height={20} />
              <Skeleton height={20} />
              <Skeleton height={20} />
              <Skeleton height={20} />
              <Skeleton height={20} />
              <Skeleton height={20} />
            </Stack>
          </CardContent>
        </Card>
      ) : guest ? (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Guest Details
            </Typography>

            <Box mt={2} display="flex" flexDirection="column" gap={1}>
              <Typography variant="body1">
                <strong>Name:</strong> {guest.first_name} {guest.last_name}
              </Typography>
              <Typography variant="body1">
                <strong>Date of Birth:</strong> {guest.date_of_birth}
              </Typography>
              <Typography variant="body1">
                <strong>Country of Residency:</strong> {guest.country_of_residency}
              </Typography>
              <Typography variant="body1">
                <strong>Nationality:</strong> {guest.nationality}
              </Typography>
              <Typography variant="body1">
                <strong>Passport Number:</strong> {guest.passport_number}
              </Typography>
              <Typography variant="body1">
                <strong>Issued By:</strong> {guest.passport_issued_by}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Typography align="center" color="text.secondary">
          Guest not found.
        </Typography>
      )}
    </Container>
  );
}

export default GuestDetails;
