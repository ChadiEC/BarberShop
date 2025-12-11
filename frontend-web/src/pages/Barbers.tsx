import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../css/Barbers.css";
import { Link } from "react-router-dom";

interface Barber {
  username: string;
  fullname: string;
  bio?: string;
  experience?: number;
  photoUrl?: string;
}

export default function Barbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [showModal, setShowModal] = useState(false);
  // Form fields for new barber
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState<number | "">("");
  const [photoUrl, setPhotoUrl] = useState("");

  // Get user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isStaff = user?.role === "admin";

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
  // CREATE NEW BARBER (STAFF ONLY)
  // -----------------------------
  async function handleCreateBarber() {
    if (!username || !fullname || !bio || !experience || !photoUrl) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const res = await api.post("/barbers", {
        username,
        fullname,
        email,
        password,
        bio,
        experience,
        photoUrl,
      });

      // update instantly
      setBarbers([...barbers, res.data]);

      // close modal
      setShowModal(false);

      // reset form
      setUsername("");
      setFullname("");
      setEmail("");
      setPassword("");
      setBio("");
      setExperience("");
      setPhotoUrl("");
    } catch (err) {
      console.error(err);
      alert("Failed to create barber");
    }
  }

 async function handleUpdateBarber() {
  if (!username) {
    alert("Enter the username of the barber you want to update.");
    return;
  }

  const updateData: any = {};

  if (fullname !== "") updateData.fullname = fullname;
  if (bio !== "") updateData.bio = bio;
  if (experience !== "") updateData.experience = experience;
  if (photoUrl !== "") updateData.photoUrl = photoUrl;

  if (Object.keys(updateData).length === 0) {
    alert("Nothing to update.");
    return;
  }

  try {
    const res = await api.patch(`/barbers/${username}`, updateData);

    setBarbers(
      barbers.map((b) =>
        b.username === username ? res.data : b
      )
    );

    setShowModal(false);

    // reset fields
    setUsername("");
    setFullname("");
    setBio("");
    setExperience("");
    setPhotoUrl("");
  } catch (err) {
    console.error(err);
    alert("Failed to update barber");
  }
}

async function handleDeleteBarber() {
  if (!username) {
    alert("Enter the barber username to delete.");
    return;
  }

  if (!confirm(`Delete barber '${username}'? This cannot be undone.`)) {
    return;
  }

  try {
    await api.delete(`/barbers/${username}`);

    // Remove barber from frontend list
    setBarbers(barbers.filter(b => b.username !== username));

    setShowModal(false);
    setUsername("");
    setFullname("");
    setBio("");
    setExperience("");
    setPhotoUrl("");

    alert("Barber deleted successfully.");
  } catch (err) {
    console.error(err);
    alert("Failed to delete barber");
  }
}



  return (
    <div className="barbers-container">
      <h1>Our Barbers</h1>
      {isStaff && (
        <button className="add-barber-btn" onClick={() => setShowModal(true)}>
          Add/Edit New Barbers
        </button>
      )}
      <div className="barbers-grid">
        {barbers.map((b) => (
          <div key={b.username} className="barber-card">
            <img src={b.photoUrl} alt={b.fullname} />

            <h2>{b.fullname}</h2>
            <p className="bio">{b.bio || "No description available."}</p>

            <p className="exp">✂ {b.experience || 0} years of experience</p>

            <Link to={`/barbers/${b.username}`} className="profile-btn">
              View Profile
            </Link>
          </div>
        ))}
      </div>
      {/* MODAL FOR CREATING NEW BARBER */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add/Edit Barber</h2>

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
              placeholder="Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={handleCreateBarber}>Create</button>
              <button onClick={handleUpdateBarber}>Update</button>
              <button onClick={handleDeleteBarber} className="delete-btn">Delete</button>
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
