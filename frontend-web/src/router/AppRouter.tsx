import { Routes, Route } from "react-router-dom";
import Layout from "../componants/Layout";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Services from "../pages/Service";
import Barbers from "../pages/Barbers";
import Booking from "../pages/Booking";
import MyReservations from "../pages/Reservation";
import BarberProfile from "../pages/BarberProfile";


export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />

      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />

      <Route
        path="/services"
        element={
          <Layout>
            <Services />
          </Layout>
        }
      />

      <Route
        path="/barbers"
        element={
          <Layout>
            <Barbers />
          </Layout>
        }
      />

      <Route
        path="/booking"
        element={
          <Layout>
            <Booking />
          </Layout>
        }
      />

      <Route
        path="/my-reservations"
        element={
          <Layout>
            <MyReservations />
          </Layout>
        }
      />

      <Route path="/barbers/:username" element={<BarberProfile />} />

    </Routes>
  );
}
