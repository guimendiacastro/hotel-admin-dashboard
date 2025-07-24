import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHouses } from '../api/api';

import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Button,
  Stack
} from '@mui/material';

export default function HouseList() {
  const [houses, setHouses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const { data } = await getHouses(token);
      console.log('Fetched houses:', data);
      setHouses(data);
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        mb={4}
      >
        <Typography variant="h5" fontWeight={600}>
          All Houses
        </Typography>
        <Button variant="contained" onClick={() => navigate('/create-house')}>
          Add New House
        </Button>
      </Stack>

      <Grid container spacing={4}>
        {houses.map((house) => (
          <Grid item key={house.id} xs={12} sm={6} md={4}>
            <Card elevation={3}>
              <CardActionArea onClick={() => navigate(`/houses/${house.id}`)}>
                <CardMedia
                  component="img"
                  height="180"
                  image={house.primary_image_url || 'https://via.placeholder.com/400x300'}
                  alt={house.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {house.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {house.address}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
