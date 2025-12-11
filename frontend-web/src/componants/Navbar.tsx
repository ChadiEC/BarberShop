import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          Barber<span>Shop</span>
        </Link>

        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/barbers">Barbers</Link>
        <Link to="/booking">Book Now</Link>

        {token && <Link to="/my-reservations">My Reservations</Link>}
      </div>

      <div className="nav-right">
        {!token ? (
          <>
            <Link to="/register" className="btn-outline">Register</Link>
            <Link to="/login" className="btn-primary">Login</Link>
          </>
        ) : (
          <div className="user-menu">
            <span className="user">@{user.username}</span>
            <button className="btn-logout" onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
