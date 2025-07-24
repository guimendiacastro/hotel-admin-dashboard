import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function HouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/houses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHouse(data);
      } catch (err) {
        console.error('Failed to fetch house:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHouse();
  }, [id]);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {loading ? (
        <Card elevation={3}>
          <Skeleton variant="rectangular" height={300} />
          <CardContent>
            <Skeleton height={40} width="60%" />
            <Skeleton height={20} width="80%" />
            <Skeleton height={20} width="40%" />
            <Skeleton height={20} width="50%" />
          </CardContent>
        </Card>
      ) : house ? (
        <Card elevation={3}>
          <CardMedia
            component="img"
            height="300"
            image={house.primary_image_url || 'https://via.placeholder.com/600x400'}
            alt={house.name}
          />
          <CardContent>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {house.name}
            </Typography>

            <Stack spacing={1} mt={2}>
              <Typography variant="body1" color="text.secondary">
                <strong>Description:</strong> {house.description || 'No description provided'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Address:</strong> {house.address || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Capacity:</strong> {house.capacity || 'N/A'}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Typography color="text.secondary" align="center">
          Unable to load house details.
        </Typography>
      )}
    </Container>
  );
}
