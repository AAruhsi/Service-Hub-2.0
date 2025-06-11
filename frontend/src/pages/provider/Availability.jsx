import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const shifts = ["morning", "evening", "night"];
const shiftLabels = {
  morning: "🌅 Morning",
  evening: "🌇 Evening",
  night: "🌙 Night",
};

const Availability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState({});
  const [tempAvailability, setTempAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAvailabilityReady = (avail) => {
    return (
      avail &&
      Object.keys(avail).length > 0 &&
      daysOfWeek.every((day) => day in avail)
    );
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/provider/availability/${user._id}`,
          {
            withCredentials: true,
          }
        );
        const fetched =
          res.data.data.length > 0
            ? res.data.data[0].availability
            : generateEmptyAvailability();

        setAvailability(fetched);
        setTempAvailability(fetched);
      } catch (error) {
        console.error("Fetch error:", error);
        const empty = generateEmptyAvailability();
        setAvailability(empty);
        setTempAvailability(empty);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const generateEmptyAvailability = () =>
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { morning: false, evening: false, night: false };
      return acc;
    }, {});

  const toggleShift = (day, shift) => {
    setTempAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [shift]: !prev[day][shift],
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.post(
        `${BASE_URL}/provider/availability/${user._id}`,
        { availability: tempAvailability },
        { withCredentials: true }
      );
      setAvailability(tempAvailability);
      setIsEditing(false);
      toast.success("Availability saved!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // if (loading || !isAvailabilityReady(availability)) {
  //   return <div className="text-center h-screen">Loading...</div>;
  // }

  return (
    <div className="w-[80vw] h-[80vh] mx-auto  p-6 overflow-auto bg-base-200 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-neutral">
          🗓️ Weekly Availability
        </h2>
        <button
          className="btn btn-outline btn-primary"
          onClick={() => setIsEditing(true)}
        >
          ✏️ Edit
        </button>
      </div>
      {!loading && isAvailabilityReady(availability) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="card bg-base-100 p-4 shadow-md rounded-lg"
            >
              <h3 className="text-lg font-semibold text-primary mb-2">{day}</h3>
              <p className="text-sm text-gray-700 min-h-[1.5rem]">
                {(() => {
                  const dayAvailability = availability[day];
                  if (!dayAvailability)
                    return (
                      <span className="text-gray-400 italic">No shifts</span>
                    );

                  const activeShifts = Object.entries(dayAvailability)
                    .filter(([key, value]) => key !== "_id" && value === true)
                    .map(([key]) => shiftLabels[key]);

                  return activeShifts.length > 0 ? (
                    activeShifts.join(", ")
                  ) : (
                    <span className="text-gray-400 italic">No shifts</span>
                  );
                })()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isEditing && (
        <dialog id="editModal" className="modal modal-open">
          <div className="modal-box max-w-4xl w-full">
            <h3 className="font-bold text-xl mb-4 text-center text-neutral">
              Edit Availability
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {daysOfWeek.map((day) => (
                <div key={day} className="bg-base-100 p-3 rounded-lg shadow">
                  <h4 className="text-md font-bold mb-2 text-primary text-center">
                    {day}
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {shifts.map((shift) => (
                      <button
                        key={shift}
                        onClick={() => toggleShift(day, shift)}
                        className={`btn btn-xs rounded-full ${
                          tempAvailability[day]?.[shift]
                            ? "bg-success text-white hover:bg-success/90"
                            : "btn-outline"
                        }`}
                      >
                        {shiftLabels[shift]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-action justify-center mt-6">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "💾 Save"}
              </button>
              <button
                className="btn btn-ghost border"
                onClick={() => {
                  setTempAvailability(availability);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Availability;
