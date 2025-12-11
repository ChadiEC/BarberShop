import { useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import "../css/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset email sent successfully!");
      setEmail("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Email not found");
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        <p className="auth-sub">
          Enter your email and we’ll send you reset instructions.
        </p>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <input
            className="forgot-input"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="forgot-btn">
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
}
