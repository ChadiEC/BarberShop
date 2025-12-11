import { useState } from "react";
import api from "../api/axiosInstance";
import "../css/Register.css";

export default function Register() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    phoneNumber: "",
    password: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Account created!");
      window.location.href = "/login";
    } catch {
      alert("Error creating account");
    }
  }

  return (
    <div className="register">
      <h1>Create Account</h1>

      <form className="register-form" onSubmit={handleSubmit}>
        <input name="fullname" placeholder="Full name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input name="phoneNumber" placeholder="Phone number" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <button>Create Account</button>
      </form>
    </div>
  );
}
