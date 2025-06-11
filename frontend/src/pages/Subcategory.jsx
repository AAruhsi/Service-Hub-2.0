import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const bookingSlots = {
  morning: ["09:00", "10:00", "11:00"],
  evening: ["13:00", "14:00", "15:00"],
  night: ["18:00", "19:00", "20:00"],
};

function Subcategory() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [allServices, setAllServices] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  });

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(BASE_URL + "/subcategory/" + id, {
          withCredentials: true,
        });
        // console.log(res.data.data);
        setSubcategories(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchServices = async () => {
      try {
        const res = await axios.get(BASE_URL + "/service/" + id, {
          withCredentials: true,
        });
        const data = res.data.data;
        setAllServices(data); // ✅ store all

        if (data.length > 0) {
          setSelectedSubcategory(subcategories[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubcategories();
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedSubcategory) {
      const filtered = allServices.filter(
        (service) => service.subcategoryId === selectedSubcategory._id
      );
      setServices(filtered);
    }
  }, [selectedSubcategory, allServices]);

  const getTimeOfDay = (selectedTime) => {
    for (const [timeOfDay, slots] of Object.entries(bookingSlots)) {
      if (slots.includes(selectedTime)) {
        return timeOfDay;
      }
    }
    return null; // Return null if no match is found
  };
  const openModal = (service) => {
    setSelectedService(service);
    document.getElementById("bookingModal").showModal();
  };

  const handleBooking = () => {
    if (!bookingDate || !selectedTime) {
      toast.error("Please select both date and time!");
      return;
    }

    const selected = new Date(bookingDate);
    const today = new Date();

    // Set to midnight to avoid time differences
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selected <= today) {
      toast.error("Please select a date after today.");
      return;
    }
    const timeOfDay = getTimeOfDay(selectedTime);
    const selectedData = {
      service: selectedService,
      date: bookingDate,
      time: selectedTime,
      timeOfDay: timeOfDay,
    };
    console.log("selected time", selectedTime);
    console.log(" time of day", timeOfDay);
    navigate("/selectedProvider", { state: selectedData });
    toast.success(
      `Booked ${selectedService.name} on ${bookingDate} at ${selectedTime}`
    );

    // Reset modal
    setBookingDate("");
    setSelectedTime("");
    setSelectedService(null);
    document.getElementById("bookingModal").close();
  };

  return (
    <div className="flex h-[88vh] bg-base-200">
      {/* Sidebar */}
      <aside className="w-54 bg-base-100 py-6 border-r border-gray-300 pl-12">
        <h2 className="text-lg text-gray-500 font-bold mb-4">Subcategories</h2>
        <ul className="menu bg-base-100 rounded-box w-full mr-0 pr-0">
          {subcategories.map((sub) => (
            <li key={sub._id} className="">
              <button
                className={`btn btn-ghost justify-start w-[100%] text-left mb-4 ${
                  selectedSubcategory?._id === sub._id
                    ? "bg-black shadow-2xl text-white scale-105"
                    : ""
                }`}
                onClick={() => setSelectedSubcategory(sub)}
              >
                {sub.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Services for:{" "}
          <span className="text-primary">{selectedSubcategory?.name}</span>
        </h2>

        {services.length === 0 ? (
          <div className="alert alert-warning shadow-lg w-fit">
            <span>No services available for this subcategory.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, index) => (
              <div key={index} className="card bg-base-100 shadow-md">
                <figure>
                  <img
                    src={service.photo}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h3 className="card-title">{service.name}</h3>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openModal(service)}
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <dialog id="bookingModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            Book: {selectedService?.name}
          </h3>

          <div className="form-control mb-4">
            <label className="label mr-3">Select Date</label>
            <input
              type="date"
              className="input input-bordered"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>
          <label className="mb-2 label">Select Time</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(bookingSlots).map(([period, times]) => (
              <div key={period}>
                <p className="text-sm capitalize mb-2">{period}</p>
                {times.map((time) => (
                  <button
                    key={time}
                    className={`btn btn-xs mb-1 w-full ${
                      selectedTime === time ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="modal-action w-[100%]  flex justify-center items-center">
            <button className="btn btn-primary flex-1" onClick={handleBooking}>
              Confirm Booking
            </button>
            <button
              className="btn flex-1 bg-red-500 text-white"
              onClick={() => {
                document.getElementById("bookingModal").close();
                setSelectedService(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Subcategory;
