import { useState } from "react";
import api from "../api/axiosInstance";
import "../css/Register.css";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    phoneNumber: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      toast.success("Account created!");
      window.location.href = "/login";
    } catch {
      toast.error("Error creating account");
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Create Account</h1>
        <p className="subtitle">
          Join Barber Web and book your next cut easily ✂️
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full name</label>
            <input name="fullname" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input name="email" type="email" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Username</label>
            <input name="username" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Phone number</label>
            <input name="phoneNumber" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="register-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
