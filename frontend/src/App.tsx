import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Events from "./pages/Events";
import Book from "./pages/Book";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminBookings from "./pages/AdminBookings";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEvent from "./pages/CreateEvent";
import AdminEvents from "./pages/AdminEvents";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />

        {/* CLUB-only pages */}
        <Route element={<ProtectedRoute allowedRole="CLUB" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book" element={<Book />} />
          <Route path="/create-event" element={<CreateEvent />} />
        </Route>

        {/* ADMIN-only pages */}
        <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/events" element={<AdminEvents />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;