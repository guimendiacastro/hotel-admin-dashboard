import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

API.interceptors.request.use(async (config) => {
  const token = await window.Clerk?.session?.getToken(); // ✅ This gets the Clerk token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email, password) =>
  API.post("/admin/login", { email, password });

// Houses
export const getHouses = () => API.get("/houses");
export const getHouseById = (id) => API.get(`/houses/${id}`);
export const createHouse = (houseData) => API.post("/houses", houseData);

// Reservations
export const getReservations = (params = {}) =>
  API.get("/reservations", { params });
export const getReservationById = (id) => API.get(`/reservations/${id}`);
export const createReservation = (reservationData) =>
  API.post("/reservations", reservationData);

// Guests
export const getGuests = (reservationId) =>
  API.get("/guests", { params: { reservationId } });
export const createGuest = (guestData) => API.post("/guests", guestData);

export default API;
