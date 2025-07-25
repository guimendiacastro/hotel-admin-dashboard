import { SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Container, Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isSignedIn) navigate('/');
  }, [isSignedIn, navigate]);

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h5" align="center" fontWeight={600}>
              Create an Admin Account
            </Typography>
          }
        />
        <CardContent>
          <Box display="flex" justifyContent="center">
            <SignUp path="/register" routing="path" redirectUrl="/" />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
