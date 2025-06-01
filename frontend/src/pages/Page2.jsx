import React, { useState, useEffect } from "react";
import { CheckSquare, Square } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Page2() {
  const [selected, setSelected] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(BASE_URL + "/category", {
          withCredentials: true,
        });
        if (res.status == 200) {
          console.log(res.data.data);
          setCategories(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchServices();
  });

  const toggleSelect = async (id) => {
    if (isLoggedIn) {
      navigate("/subcategory");
    } else {
      navigate("/login");
      toast.success("Please login first");
    }
  };
  return (
    <div className="min-h-[50%]  py-10 px-4 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-2 text-center">
        What Do You Need Help With Today?
      </h2>
      <p className="mb-8 text-sm text-gray-700">
        Choose the service that you need.
      </p>

      {categories.length == 0 ? (
        <span className="loading loading-dots loading-sm"></span>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className={`relative cursor-pointer bg-white rounded-xl p-4 w-44 h-52 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center ${
                selected.includes(category._id) ? "ring-2 ring-red-500" : ""
              }`}
              onClick={() => toggleSelect(category._id)}
            >
              <img
                src={category.iconUrl}
                alt={category.name}
                className="w-20 h-20 mb-3"
              />
              <p className="text-center font-medium text-gray-800">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
