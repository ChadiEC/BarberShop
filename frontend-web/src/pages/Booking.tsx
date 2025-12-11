import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../css/Booking.css";
import { useLocation } from "react-router-dom";

interface Barber {
  username: string;
  fullname: string;
}

interface Service {
  name: string;
  price: number;
  duration: number;
}

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [isDatePicked, setIsDatePicked] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ---------------------------
  // LOAD DATA ON PAGE LOAD
  // ---------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const b = await api.get("/barbers");
        setBarbers(b.data);

        const s = await api.get("/services");
        setServices(s.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!selectedBarber || !date) return;

    async function loadOccupiedSlots() {
      try {
        const res = await api.get("/reservations/occupied", {
          params: {
            barber: selectedBarber,
            date: date,
          },
        });

        setOccupiedTimes(res.data); // ["09:00", "13:30", ...]
      } catch (err) {
        console.error("Error loading occupied slots", err);
      }
    }

    loadOccupiedSlots();
  }, [selectedBarber, date]);

  useEffect(() => {
    const s = location.state?.preselectedService;
    if (s && selectedService === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedService(s);
    }
  }, [location.state, selectedService]);

  const TIME_SLOTS = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  // ---------------------------
  // HANDLE BOOKING SUBMIT
  // ---------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedService || !selectedBarber || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    // Date format expected: YYYY-MM-DDTHH:mm
    const DateYMD = `${date}`;
    const Time = `${time}`;
    try {
      await api.post("/reservations", {
        service: selectedService,
        barber: selectedBarber,
        date: DateYMD,
        time: Time,
      });

      alert("Reservation successful!");
      navigate("/my-reservations");
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment");
    }
  }

  return (
    <div className="booking-container">
      <h1>Book an Appointment</h1>

      <form className="booking-form" onSubmit={handleSubmit}>
        {/* SERVICE SELECT */}
        <label>Service</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name} — ${s.price}
            </option>
          ))}
        </select>

        {/* BARBER SELECT */}
        <label>Barber</label>
        <select
          value={selectedBarber}
          onChange={(e) => setSelectedBarber(e.target.value)}
        >
          <option value="">Select a barber</option>
          {barbers.map((b) => (
            <option key={b.username} value={b.username}>
              {b.fullname}
            </option>
          ))}
        </select>

        <label>Choose a date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            const newDate = e.target.value;

            setDate(newDate);

            if (newDate === "") {
              // Si l'utilisateur efface la date
              setIsDatePicked(false);
              setTime("");
              setOccupiedTimes([]);
            } else {
              // Si une date est choisie
              setIsDatePicked(true);
            }
          }}
        />
        {isDatePicked && selectedBarber && (
          <div className="timeslots">
            {TIME_SLOTS.map((slot) => {
              const isOccupied = occupiedTimes.includes(slot);

              return (
                <button
                  key={slot}
                  disabled={isOccupied}
                  className={
                    isOccupied
                      ? "slot occupied"
                      : time === slot
                      ? "slot selected"
                      : "slot"
                  }
                  onClick={() => !isOccupied && setTime(slot)}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
        <button type="submit" className="book-btn">
          Book Now
        </button>
      </form>
    </div>
  );
}
