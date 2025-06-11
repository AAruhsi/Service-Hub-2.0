import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const ProfilePage = () => {
  const { isLoggedIn, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNo: user?.phoneNo || "",
      gender: user?.gender || "",
      address: user?.address || "",
    },
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNo: user?.phoneNo || "",
        gender: user?.gender || "",
        address: user?.address || "",
      });
      fetchOrders();
    }
  }, [isLoggedIn, user, reset, navigate]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/order/customer/${user._id}`,
        {
          withCredentials: true,
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders.");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(`${BASE_URL}/auth/user-edit`, data, {
        withCredentials: true,
      });
      setUser(response.data.data);
      toast.success(response.data.message || "Profile updated successfully!");
      document.getElementById("my_modal_5").close();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.error || "Failed to update profile.");
      document.getElementById("my_modal_5").close();
    }
  };

  const handleCancel = () => {
    reset();
    document.getElementById("my_modal_5").close();
  };

  return (
    <>
      {isLoggedIn && user && (
        <div className="container mx-auto px-4 py-6 min-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 dark:text-gray-100">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-6 justify-between mx-4">
            <button
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => navigate("/")}
              aria-label="Go back"
            >
              ← Back
            </button>
            <div className="space-y-2 text-right">
              <h1 className="text-2 font-bold text-gray-800 dark:text-white sm:text-3xl">
                Hello,{" "}
                <span className="text-blue-600">
                  {user.firstName} {user.lastName}
                </span>
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* User Information */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  User Information
                </h2>
                <button
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() =>
                    document.getElementById("my_modal_5").showModal()
                  }
                >
                  Edit Profile
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  First Name:{" "}
                  <span className="font-normal">{user.firstName || "N/A"}</span>
                </p>
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  Last Name:{" "}
                  <span className="font-normal">{user.lastName || "N/A"}</span>
                </p>
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  Email:{" "}
                  <span className="font-normal">{user.email || "N/A"}</span>
                </p>
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  Phone:{" "}
                  <span className="font-normal">
                    +91-{user.phoneNo || "N/A"}
                  </span>
                </p>
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  Gender:{" "}
                  <span className="font-normal">{user.gender || "N/A"}</span>
                </p>
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  Address:{" "}
                  <span className="font-normal">{user.address || "N/A"}</span>
                </p>
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                My Orders
              </h2>
              {isLoadingOrders ? (
                <div className="flex justify-center">
                  <svg
                    className="animate-spin h-6 w-36 text-blue-gray-600 dark:text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          Order ID: {order._id}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Service: {order.service?.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Date & Time: {order.bookingDate} at {order.timeSlot}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Offer: {order.offer ? "Applied" : "None"}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          ₹{order.finalPrice?.toFixed(2) || "0.00"}
                        </p>
                        <p
                          className={`text-sm ${
                            order.paymentStatus === "Completed"
                              ? "text-green-600 dark:text-green-400"
                              : "text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          Status: {order.paymentStatus || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  No orders found.
                </p>
              )}
            </div>
          </div>

          {/* Modal */}
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
                Edit Profile
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      placeholder="First Name"
                      className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm dark:text-white"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      placeholder="Last Name"
                      className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm dark:text-white"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="Email"
                      className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm dark:text-white"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("phoneNo", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                      placeholder="Phone Number"
                      className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm dark:text-white"
                    />
                    {errors.phoneNo && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phoneNo.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("gender")}
                      placeholder="Gender"
                      className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      {...register("address")}
                      placeholder="Address"
                      className="input input-bordered w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm dark:text-white"
                    />
                  </div>
                </div>
                <div className="modal-action">
                  <div className="flex gap-4 w-full">
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </dialog>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
