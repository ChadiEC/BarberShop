import { useState } from "react";
import api from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Welcome back 👋");
      navigate("/");
    } catch {
      toast.error("Wrong email or password");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">
          Login to manage your bookings and reviews ✂️
        </p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="login-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <span>
              No account? <Link to="/register">Register</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
