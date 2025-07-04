import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

const OrderAdmin = () => {
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
      const res = await axios.get(`${BASE_URL}/order`);
      console.log(res.data);
      setOrders(res.data); // Assuming res.data is an array of orders
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/review/getallreviews`);
      console.log(res.data);
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

  return (
    <>
      <div className="p-4 bg-white text-black dark:text-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-4">All Orders (Admin View)</h1>

        <div className="overflow-x-auto rounded-box border dark:bg-gray-800 border-base-content/5 bg-base-100 ">
          <table className="table ">
            <thead>
              <tr className="dark:text-white/50">
                <th>Customer</th>
                <th>Provider</th>
                <th>Service</th>
                <th>Date & time</th>

                <th>Address</th>
                <th>Phone</th>
                <th>Price</th>
                <th>Final Price</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const review = getReviewByOrderId(order._id);

                return (
                  <tr key={order._id}>
                    <td>{order.customerName}</td>
                    <td>
                      {order.provider?.firstName || "N/A"}{" "}
                      {order.provider?.lastName || "N/A"}
                    </td>
                    <td>{order.service?.name || "N/A"}</td>
                    <td>
                      {new Date(order.bookingDate).toLocaleDateString()}
                      <span>{order.timeSlot}</span>
                    </td>

                    <td>{order.address}</td>
                    <td>{order.phoneNo}</td>
                    <td>₹{order.price}</td>
                    <td>₹{order.finalPrice}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.paymentStatus === "SUCCESS"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td
                      className={`font-semibold ${
                        order.orderStatus === "COMPLETED"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {order.orderStatus}
                    </td>
                    <td>
                      {review ? (
                        <div className="flex flex-col space-y-1">
                          <div className="text-yellow-500 text-sm">
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
                        <span className="text-red-500 text-sm">Not rated</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OrderAdmin;
