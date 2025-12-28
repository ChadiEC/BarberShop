import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../css/Barbers.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface Barber {
  username: string;
  fullname: string;
  bio?: string;
  experience?: number;
  photoUrl?: string;
  specialties?: string[];
  avgRating?: number; // ⭐ moyenne envoyée par le backend
  ratingCount?: number; // nombre total de reviews
}

export default function Barbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form fields for admin modal
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState<number | "">("");
  const [specialties, setSpecialties] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // User role
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isStaff = user?.role === "admin";

  // Load all barbers
  useEffect(() => {
    async function loadBarbers() {
      try {
        const res = await api.get("/barbers");
        setBarbers(res.data);
      } catch (err) {
        console.error("Error fetching barbers:", err);
      }
    }

    loadBarbers();
  }, []);

  // -----------------------------
  // CREATE NEW BARBER (ADMIN ONLY)
  // -----------------------------
  async function handleCreateBarber() {
    if (!username || !fullname || !bio || !experience || !photoUrl) {
      toast.error("Please fill all required fields.");
      return;
    }

    const specialtiesArray = specialties
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await api.post("/barbers", {
        username,
        fullname,
        email,
        password,
        bio,
        experience,
        photoUrl,
        specialties: specialtiesArray,
      });

      setBarbers([...barbers, res.data]);
      setShowModal(false);

      // reset
      setUsername("");
      setFullname("");
      setEmail("");
      setPassword("");
      setBio("");
      setExperience("");
      setSpecialties("");
      setPhotoUrl("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create barber");
    }
  }

  // -----------------------------
  // UPDATE BARBER
  // -----------------------------
  async function handleUpdateBarber() {
    if (!username) {
      toast.error("Enter the barber username to update.");
      return;
    }

    const updateData: any = {};

    if (fullname) updateData.fullname = fullname;
    if (bio) updateData.bio = bio;
    if (experience !== "") updateData.experience = experience;

    if (specialties.trim() !== "") {
      updateData.specialties = specialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    if (photoUrl) updateData.photoUrl = photoUrl;

    if (Object.keys(updateData).length === 0) {
      toast.error("Nothing to update.");
      return;
    }

    try {
      const res = await api.patch(`/barbers/${username}`, updateData);

      setBarbers((prev) =>
        prev.map((b) => (b.username === username ? res.data : b))
      );

      setShowModal(false);

      setUsername("");
      setFullname("");
      setBio("");
      setExperience("");
      setSpecialties("");
      setPhotoUrl("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update barber.");
    }
  }

  // -----------------------------
  // DELETE BARBER
  // -----------------------------
  async function handleDeleteBarber() {
    if (!username) {
      toast.error("Enter the barber username to delete.");
      return;
    }

    if (!confirm(`Delete barber '${username}'? This cannot be undone.`)) return;

    try {
      await api.delete(`/barbers/${username}`);

      setBarbers((prev) => prev.filter((b) => b.username !== username));

      setShowModal(false);
      setUsername("");
      setFullname("");
      setBio("");
      setExperience("");
      setSpecialties("");
      setPhotoUrl("");

      toast.success("Barber deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete barber");
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="barbers-container">
      <h1>Our Barbers</h1>

      {isStaff && (
        <button className="add-barber-btn" onClick={() => setShowModal(true)}>
          Add / Edit Barbers
        </button>
      )}

      <div className="barbers-grid">
        {barbers.map((b) => (
          <div key={b.username} className="barber-card">
            <img src={b.photoUrl} alt={b.fullname} />

            <h2>{b.fullname}</h2>

            <p className="bio">{b.bio || "No description available."}</p>

            <div className="specialties">
              {b.specialties && b.specialties.length > 0 ? (
                b.specialties.map((s, i) => (
                  <span key={i} className="spec-tag">
                    {s}
                  </span>
                ))
              ) : (
                <span className="no-spec">No specialties listed.</span>
              )}
            </div>

            <p className="exp">✂ {b.experience || 0} years of experience</p>

            {/* ⭐ RATING */}
            <p className="rating">
              ⭐ {b.avgRating ?? 0} ({b.ratingCount ?? 0} reviews)
            </p>

            <Link to={`/barbers/${b.username}`} className="profile-btn">
              View Profile
            </Link>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add / Edit Barber</h2>

            <input
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <input
              placeholder="Experience"
              type="number"
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
            />
            <input
              placeholder="Specialties (comma separated)"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
            />
            <input
              placeholder="Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={handleCreateBarber}>Create</button>
              <button onClick={handleUpdateBarber}>Update</button>
              <button onClick={handleDeleteBarber} className="delete-btn">
                Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
