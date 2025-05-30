import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { isLoggedIn, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phoneNo: "",
    address: "",
    email: "",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      console.log("useEffect user", user);

      setFormData(user);
    }
  }, [isLoggedIn, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(BASE_URL + "/auth/user-edit", formData, {
        withCredentials: true,
      });
      if (res.status == 200) {
        console.log("resposne res.data: ", res.data);
        setUser(res.data.data);

        console.log("After adding data", user);
        document.getElementById("my_modal_5").close();
        const message = res.data.message;
        toast.success(message);
      }
    } catch (error) {
      const message = error.response.data.message;
      document.getElementById("my_modal_5").close();
      toast.error(message);

      console.error("Update failed:", error);
    }
  };

  return (
    <>
      {user && (
        <>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">
                Hello{" "}
                <span className="text-purple-500">
                  {formData.firstName} {formData.lastName}
                </span>
              </h1>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">User Information</h2>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      document.getElementById("my_modal_5").showModal()
                    }
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <p>
                    <strong>First Name:</strong> {formData.firstName}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {formData.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {formData.phoneNo}
                  </p>
                  <p>
                    <strong>Gender:</strong> {formData.gender}
                  </p>
                  <p>
                    <strong>Address:</strong> {formData.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Edit Profile</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="input input-bordered w-full"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  min="10"
                  max="10"
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Gender"
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="modal-action">
                <form method="dialog" className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button className="btn">Cancel</button>
                </form>
              </div>
            </div>
          </dialog>
        </>
      )}
    </>
  );
};

export default ProfilePage;
