import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../css/Service.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


interface Service {
  name: string;
  price: number;
  duration: number;
  description?: string;
  photoUrl?: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form fields for new service
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [duration, setDuration] = useState<number | "">("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  // Get user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isStaff = user?.role === "admin" || user?.role === "barber";

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/services");
        setServices(res.data);
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    }

    load();
  }, []);

  function handleBook(name: string) {
    const token = localStorage.getItem("token");
    if(!token){
      toast.error("Log in or register to book now!")
      navigate("/login");
      return
    }
    navigate("/booking", { state: { preselectedService: name } });
  }


  // -----------------------------
  // CREATE NEW SERVICE (STAFF ONLY)
  // -----------------------------
  async function handleCreateService() {
    if (!name || !price || !duration) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const res = await api.post("/services", {
        name,
        price,
        duration,
        description,
        photoUrl
      });

      // update instantly
      setServices([...services, res.data]);

      // close modal
      setShowModal(false);

      // reset form
      setName("");
      setPrice("");
      setDuration("");
      setPhotoUrl("");
      setDescription("");

    } catch (err) {
      console.error(err);
      toast.error("Failed to create service");
    }
  }

async function handleDeleteService() {
  if (!name) {
    toast.error("Enter the service username to delete.");
    return;
  }

  if (!confirm(`Delete service '${name}'? This cannot be undone.`)) {
    return;
  }

  try {
    await api.delete(`/services/${name}`);

    // Remove service from frontend list
    setServices(services.filter(s => s.name !== name));

    setShowModal(false);
    setName("");
    setPrice("");
    setDescription("");
    setDuration("");
    setPhotoUrl("");

    toast.success("Service deleted successfully.");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete service");
  }
}

async function handleUpdateService() {
  if (!name) {
    toast.error("Enter the service name you want to update.");
    return;
  }

  const updateData: any = {};

  if (price !== "") updateData.price = price;
  if (duration !== "") updateData.duration = duration;
  if (description !== "") updateData.description = description;
  if (photoUrl !== "") updateData.photoUrl = photoUrl;

  if (Object.keys(updateData).length === 0) {
    toast.error("No fields to update.");
    return;
  }

  try {
    const res = await api.put(`/services/${name}`, updateData);

    // update UI instantly
    setServices(
      services.map((s) => (s.name === name ? res.data : s))
    );

    setShowModal(false);

    setName("");
    setPrice("");
    setDuration("");
    setDescription("");
    setPhotoUrl("");

  } catch (err) {
    console.error(err);
    toast.error("Failed to update service");
  }
}

  return (
    <div className="services-container">
      <h1>Our Services</h1>

      {/* ADMIN / BARBER CAN ADD NEW SERVICE */}
      {isStaff && (
        <button className="add-service-btn" onClick={() => setShowModal(true)}>
          Add/Edit/Delete a Service
        </button>
      )}

      {/* SERVICE GRID */}
      <div className="services-grid">
        {services.map((s) => (
          <div className="service-card" key={s.name}>
            <div
              className="service-img-bg"
              style={{ backgroundImage: `url(${s.photoUrl})` }}
            ></div>

            <h2>{s.name}</h2>
            <p className="service-price">${s.price}</p>
            <p className="service-duration">{s.duration} min</p>

            {s.description && <p className="service-desc">{s.description}</p>}

            <button className="service-btn" onClick={() => handleBook(s.name)}>
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* MODAL FOR CREATING NEW SERVICE */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add/Update/Delete a Service</h2>

            <input
              placeholder="Service name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />

            <input
              placeholder="Duration (min)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />

            <input
              placeholder="Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={handleCreateService}>Create</button>
              <button onClick={handleUpdateService}>Update</button>
              <button className="delete-btn" onClick={handleDeleteService}>Delete</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
