import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

const ProviderOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState([]);

  useEffect(() => {
    if (user?._id) {
      fetchOrders();
      fetchRatings();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/order/${user._id}`);
      setOrders(res.data); // Assuming res.data is an array of orders
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/review/${user._id}`);
      setReviews(res.data); // Assuming res.data is an array of orders
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };
  const getReviewByOrderId = (orderId) => {
    return reviews.find(
      (review) => review.orderId?.toString() === orderId.toString()
    );
  };

  const showReviews = (review) => {
    setComment(review);
    document.getElementById("showReview").showModal();
  };

  const toggleOrderStatus = async (order) => {
    if (!isCompletionAllowed(order)) {
      console.warn("Attempted to complete an order before allowed time.");
      return;
    }

    try {
      console.log("Marking order as completed: ", order._id);
      await axios.patch(`${BASE_URL}/order/${order._id}`, {
        orderStatus: "COMPLETED",
      });
      fetchOrders(); // Refresh data
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const isCompletionAllowed = (order) => {
    try {
      // Make sure bookingDate is a Date object
      const bookingDate = new Date(order.bookingDate);

      // Extract time from timeSlot string (e.g., "19:00night" → "19:00")
      const timeMatch = order.timeSlot?.match(/\d{2}:\d{2}/);
      const time = timeMatch ? timeMatch[0] : "00:00";

      const [hours, minutes] = time.split(":").map(Number);

      // Combine booking date and time
      const bookingDateTime = new Date(bookingDate);
      bookingDateTime.setHours(hours, minutes, 0, 0);

      // Compare with current time
      const now = new Date();
      return now >= bookingDateTime;
    } catch (err) {
      console.error("Invalid date/time format", err);
      return false;
    }
  };

  return (
    <>
      <div className="p-4 bg-white text-black dark:text-white dark:bg-gray-900">
        <h1 className="text-2xl  font-bold mb-4 dark:text-white">
          Provider Orders
        </h1>
        <div className="overflow-x-auto rounded-box border dark:text-white dark:bg-gray-800 border-base-content/5 bg-base-100 ">
          <table className="table">
            <thead>
              <tr className="dark:text-white">
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Address</th>
                <th>Phone No</th>
                <th>Price</th>
                <th>Final Price</th>
                <th>Review</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const review = getReviewByOrderId(order._id);

                return (
                  <tr key={order._id}>
                    <td>{order.customerName}</td>
                    <td>{order.service?.name}</td>
                    <td>{new Date(order.bookingDate).toLocaleDateString()}</td>
                    <td>{order.timeSlot}</td>
                    <td>{order.address}</td>
                    <td>{order.phoneNo}</td>
                    <td>₹{order.price}</td>
                    <td>₹{order.finalPrice}</td>
                    <td>
                      {review ? (
                        <div className="flex flex-col items-start space-y-1">
                          <div className="text-yellow-500">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <span key={i}>⭐</span>
                            ))}
                          </div>
                          <button
                            className="btn btn-xs btn-outline btn-info"
                            onClick={() => showReviews(review)}
                          >
                            View Review
                          </button>
                        </div>
                      ) : (
                        <span className="text-red-500">Not rated</span>
                      )}
                    </td>
                    <td>{order.orderStatus}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          order.orderStatus === "COMPLETED"
                            ? "bg-red-500"
                            : isCompletionAllowed(order)
                            ? "bg-green-500"
                            : "bg-gray-400 cursor-not-allowed"
                        } text-white`}
                        onClick={() => toggleOrderStatus(order)}
                        disabled={
                          order.orderStatus === "COMPLETED" ||
                          !isCompletionAllowed(order)
                        }
                      >
                        {order.orderStatus === "COMPLETED"
                          ? "Completed"
                          : "Mark as Completed"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <dialog id="showReview" className="modal">
        <div className="modal-box bg-base-100 dark:bg-base-200 text-base-content">
          <h3 className="font-bold text-lg mb-2 text-yellow-500 flex">
            {Array.from({ length: comment.rating }, (_, i) => (
              <span key={i}>⭐</span>
            ))}
          </h3>
          <p className="font-light text-base italic mb-4">
            "{comment.comment}"
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-neutral">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ProviderOrders;
