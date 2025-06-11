import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../utils/constants";
import { useAuth } from "../context/AuthContext";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import toast from "react-hot-toast";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null); // Track selected offer
  const { service, provider, date, time, price, timeOfDay } =
    location.state || {};
  const [isEditing, setIsEditing] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: `${user?.firstName} ${user?.lastName}` || "",
    address: user?.address || "",
    phone: user?.phoneNo || "",
  });
  // Calculate discount and total
  const subtotal = price || 0;
  const discountPercentage = selectedOffer ? selectedOffer.discountValue : 0;
  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal - discountAmount;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: `${user?.firstName} ${user?.lastName}` || "",
      address: user?.address || "",
      phone: user?.phoneNo || "",
    },
  });

  const onSubmit = (data) => {
    setCustomerData(data); // store the edited values locally
    setIsEditing(false); // exit edit mode
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const fetchOffers = async () => {
    try {
      const subCatId = service?.subcategoryId;
      if (subCatId) {
        const response = await axios.get(
          `${BASE_URL}/offer/getvalidOffers/${subCatId}`
        );
        setOffers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    }
  };

  // Handle offer selection
  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
  };

  useEffect(() => {
    fetchOffers();
  }, [service?.subcategoryId]);

  console.log(
    "customerid: serviceid:: providerid: bookingDate: timeSlot(9:00 Am Morning): address: offer: price: finalPrice: paymentStatus:",
    user._id,
    service._id,
    provider._id,
    date,
    time,
    timeOfDay,
    customerData.address,
    customerData.name,
    customerData.phone,
    selectedOffer?._id,
    price,
    total
  );

  const handlePayment = async () => {
    try {
      const data = {
        customer: user._id,
        service: service._id,
        provider: provider._id,
        bookingDate: date,
        timeSlot: timeOfDay + time,
        address: customerData.address,
        customerName: customerData.name,
        phoneNo: customerData.phone,
        offer: selectedOffer?._id || null,
        price,
        finalPrice: total,
      };
      const order = await axios.post(BASE_URL + "/order", data, {
        withCredentials: true,
      });
      console.log(order);
      navigate("/showOrders");
      toast.success("Order Played ");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-6 min-h-[80vh] overflow-y-auto">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-6 justify-between mx-4">
        <button
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ← Back
        </button>
        <div className="space-y-2 text-right">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">
            Order Details
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 space-y-6">
            {/* Customer Cart Section */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Customer’s Cart
              </h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  className="w-full sm:w-32 h-32 object-cover rounded-md"
                  src={service?.photo || "https://via.placeholder.com/150"}
                  alt={service?.name || "service"}
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {service?.name || "N/A"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Provider:</span>{" "}
                      {provider?.firstName || "N/A"} {provider?.lastName || ""}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Date:</span> {date || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Time:</span>{" "}
                      {timeOfDay || "N/A"}{" "}
                      {time
                        ? ["09:00", "10:00", "11:00"].includes(time)
                          ? "AM"
                          : "PM"
                        : ""}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white text-right">
                    ₹{subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Available Offers
              </h2>
              {offers.length > 0 ? (
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div
                      key={offer._id}
                      className={`flex items-start gap-4 p-4 rounded-md cursor-pointer transition-colors ${
                        selectedOffer?._id === offer._id
                          ? "bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700"
                          : "bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900"
                      }`}
                      onClick={() => handleSelectOffer(offer)}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600 dark:text-blue-300"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold text-gray-800 dark:text-white">
                          {offer.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {offer.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Valid Till: {offer.validTill}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          -{offer.discountValue}%
                        </p>
                        {selectedOffer?._id === offer._id && (
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  No offers available.
                </p>
              )}
            </div>
          </div>

          {/* Customer and Offers Section */}
          <div className="w-full xl:w-96 space-y-6">
            {/* Customer Section */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Customer
              </h2>
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="mt-1 block w-full p-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address
                    </label>
                    <textarea
                      {...register("address", {
                        required: "Address is required",
                      })}
                      className="mt-1 block w-full p-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      placeholder="Enter your full address"
                      rows="4"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <input
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value:
                            /^\d{-when I select an offer, that offer gets applied in the summary discount section10}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                      className="mt-1 block w-full p-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      placeholder="Enter your 10-digit phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4">
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
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Avatar and Name */}
                  <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-600 pb-4">
                    <img
                      src="https://avatar.iran.liara.run/public/17"
                      alt="avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-base font-semibold text-gray-800 dark:text-white">
                        {customerData?.name ||
                          `${user?.firstName || "N/A"} ${user?.lastName || ""}`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {user?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-600 pb-4">
                    <LocalPhoneIcon className="text-gray-500 dark:text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      +91-{customerData?.phone || user?.phoneNo || "N/A"}
                    </p>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-white">
                      Shipping Address
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {customerData?.address || user?.address || "N/A"}
                    </p>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2.5 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit Details
                  </button>
                </div>
              )}
            </div>

            {/* Offers Section */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>
                    Discount{" "}
                    {selectedOffer ? (
                      <span className="inline-block px-2 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded dark:bg-gray-600 dark:text-white">
                        {selectedOffer.couponCode}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded dark:bg-gray-600 dark:text-white">
                        NONE
                      </span>
                    )}
                  </span>
                  <span>
                    -₹{discountAmount.toFixed(2)} ({discountPercentage}%
                    {selectedOffer ? ` - ${selectedOffer.title}` : ""})
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-gray-800 dark:text-white border-t pt-4">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                className="w-full px-3 py-2 bg-green-400 rounded-md mt-4 text-white"
                onClick={handlePayment}
              >
                PayNow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
