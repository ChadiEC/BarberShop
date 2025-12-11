import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import "../css/Auth.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      return toast.error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { newPassword });

      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired token");
    }

    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Reset Password</h1>

        <form onSubmit={handleSubmit} className="reset-form">

          {/* NEW PASSWORD */}
          <div className="input-wrapper">
            <input
              type={showPass ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setShowPass(!showPass)}>
              {showPass ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-wrapper">
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setShowConfirmPass(!showConfirmPass)}>
              {showConfirmPass ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>
      </div>
    </div>
  );
}
