import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api", // Update if deployed
});

export const login = (email, password) =>
  API.post("/admin/login", { email, password });

export const getGuests = (token) =>
  API.get("/guests", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getReservations = (token) =>
  API.get("/reservations", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getHouses = (token) =>
  API.get("/houses", {
    headers: { Authorization: `Bearer ${token}` },
  });
