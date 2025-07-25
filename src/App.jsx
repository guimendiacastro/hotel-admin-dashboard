import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

import GuestDetails from './pages/GuestDetails';
import HouseList from './pages/HouseList';
import HouseDetails from './pages/HouseDetails';
import CreateHouse from './pages/CreateHouse';
import CreateReservation from './pages/CreateReservation';
import LoginPage from './pages/LoginPage';
import ReservationList from './pages/ReservationList';
import ReservationDetails from './pages/ReservationDetails';
import RegisterPage from './pages/RegisterPage';

function ClerkWithRouter({ children }) {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      {children}
    </ClerkProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Root Route with Sign-In check */}
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <ReservationList />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      {/* Protected Pages */}
      <Route
        path="/guests/:id"
        element={
          <>
            <SignedIn>
              <GuestDetails />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/houses"
        element={
          <>
            <SignedIn>
              <HouseList />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/houses/:id"
        element={
          <>
            <SignedIn>
              <HouseDetails />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/create-house"
        element={
          <>
            <SignedIn>
              <CreateHouse />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/create-reservation"
        element={
          <>
            <SignedIn>
              <CreateReservation />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/reservations/:id"
        element={
          <>
            <SignedIn>
              <ReservationDetails />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      {/* Fallback: Catch-all route */}
      <Route
        path="*"
        element={
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <ClerkWithRouter>
        <AppRoutes />
      </ClerkWithRouter>
    </Router>
  );
}
