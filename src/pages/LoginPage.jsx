import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Container, Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  // If already signed in, redirect to homepage
  useEffect(() => {
    if (isSignedIn) navigate('/');
  }, [isSignedIn, navigate]);

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
          <Box display="flex" justifyContent="center">
            <SignIn path="/login" routing="path" redirectUrl="/" />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
