import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GuestDetails from './pages/GuestDetails';
import HouseList from './pages/HouseList';
import HouseDetails from './pages/HouseDetails';
import CreateHouse from './pages/CreateHouse';
import CreateReservation from './pages/CreateReservation';
import LoginPage from './pages/LoginPage';
import ReservationList from './pages/ReservationList';
import ReservationDetails from './pages/ReservationDetails';
import RegisterPage from './pages/RegisterPage';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReservationList />} />
        <Route path="/guests/:id" element={<GuestDetails />} />
        <Route path="/houses" element={<HouseList />} />
        <Route path="/houses/:id" element={<HouseDetails />} />
        <Route path="/create-house" element={<CreateHouse />} />
        <Route path="/create-reservation" element={<CreateReservation />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reservations/:id" element={<ReservationDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
