import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import "../css/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [barbers, setBarbers] = useState([]);
  const [openDashboard, setOpenDashboard] = useState(false);
  const dashboardRef = useRef<HTMLDivElement | null>(null);

  // User settings dropdown
  const [showSettings, setShowSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const settingsRef = useRef<HTMLDivElement | null>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out");
  }
 

  // Load barbers only for admin
  useEffect(() => {
    if (user?.role === "admin") {
      api.get("/barbers").then((res) => setBarbers(res.data));
    }
  }, [user]);

  // Close admin dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dashboardRef.current && !dashboardRef.current.contains(e.target as Node)) {
        setOpenDashboard(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mouseup", handleClickOutside);
    return () => document.removeEventListener("mouseup", handleClickOutside);
  }, []);

  
  async function changePassword() {
    if (!currentPassword || !newPassword) {
      return toast.error("All fields are required.");
    }

    try {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password updated successfully!");

      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update password.");
    }
  }
  useEffect(() => {
  setShowSettings(false);
}, [token]);

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">
            Barber<span>Shop</span>
          </Link>

          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/barbers">Barbers</Link>

          {/* BARBER CANNOT BOOK */}
          {token && user.role !== "barber" && (
            <Link to="/booking">Book Now</Link>
          )}

          {/* BARBER DASHBOARD */}
          {token && user.role === "barber" && (
            <Link 
              to={`/dashboard/barber/${user.username}`} 
              className="dash-link"
            >
              My Dashboard
            </Link>
          )}

          {/* ADMIN DASHBOARD DROPDOWN */}
          {token && user.role === "admin" && (
            <div className="dropdown" ref={dashboardRef}>
              <button
                className="dash-link"
                onClick={() => setOpenDashboard(!openDashboard)}
              >
                Barber Dashboards ▾
              </button>

              {openDashboard && (
                <div className="dropdown-menu">
                  {barbers.map((b: any) => (
                    <Link
                      key={b.username}
                      to={`/dashboard/barber/${b.username}`}
                      className="dropdown-item"
                      onClick={() => setOpenDashboard(false)}
                    >
                      {b.username}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CLIENT */}
          {token && user.role === "client" && (
            <Link to="/my-reservations">My Reservations</Link>
          )}
        </div>

        <div className="nav-right">
          {!token ? (
            <>
              <Link to="/register" className="btn-outline">Register</Link>
              <Link to="/login" className="btn-primary">Login</Link>
            </>
          ) : (
            <div className="user-menu" ref={settingsRef}>
              <span className="user">@{user.username}</span>

              <button
                className="settings-btn"
                onClick={() => setShowSettings(!showSettings)}
              >
                ⚙
              </button>

              {showSettings && (
                <div className="settings-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowChangePassword(true);
                      setShowSettings(false);
                    }}
                  >
                    Change Password
                  </button>

                  <button className="dropdown-item logout-btn" onClick={logout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* CHANGE PASSWORD MODAL */}
      {showChangePassword && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Change Password</h2>

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={changePassword}>Save</button>
              <button
                className="cancel-btn"
                onClick={() => setShowChangePassword(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
