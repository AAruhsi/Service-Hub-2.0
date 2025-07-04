import React, { useState, useEffect } from "react";
import { CheckSquare, Square } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";

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
          setCategories(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchServices();
  }, []);

  const toggleSelect = async (id) => {
    if (isLoggedIn) {
      navigate("/subcategory/" + id);
    } else {
      navigate("/login");
      toast.success("Please login first");
    }
  };
  return (
    <div className="min-h-[50%] py-10 px-4 flex flex-col items-center bg-base-100 dark:bg-[#050505] dark:text-white">
      <h2 className="text-2xl font-semibold mb-2 text-center text-base-content dark:text-white">
        What Do You Need Help With Today?
      </h2>
      <p className="mb-8 text-sm text-gray-700 dark:text-white">
        Choose the service that you need.
      </p>

      {categories.length === 0 ? (
        <span className="loading loading-dots loading-sm"></span>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {categories.map((cat) => (
            // <div
            //   key={category._id}
            //   className={`relative cursor-pointer rounded-xl p-4 w-44 h-52 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center
            //   bg-base-100 dark:bg-[#171717] dark:text-white
            //   text-base-content
            //   ${selected.includes(category._id) ? "ring-2 ring-red-500" : ""}
            // `}
            //   onClick={() => toggleSelect(category._id)}
            // >
            //   <img
            //     src={category.iconUrl}
            //     alt={category.name}
            //     className="w-20 h-20 mb-3"
            //   />
            //   <p className="text-center font-medium">{category.name}</p>
            // </div>
            <div
              key={cat._id}
              onClick={() => toggleSelect(cat._id)}
              className={`flex items-center justify-between p-6 border cursor-pointer rounded-2xl transition hover:shadow-md ${
                cat.highlighted
                  ? "border-blue-700 ring-1 ring-blue-700"
                  : "border-gray-200"
              }`}
            >
              <div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                  {cat.name}
                </div>
              </div>
              <img
                src={cat.iconUrl}
                alt={cat.name}
                className="w-20 h-20 ml-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

{
  /* <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505] py-10">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
    {categories.map((cat, idx) => (
      <div
        key={idx}
        className={`flex items-center justify-between p-6 border rounded-2xl transition hover:shadow-md ${
          cat.highlighted
            ? "border-blue-700 ring-1 ring-blue-700"
            : "border-gray-200"
        }`}
      >
        <div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            {cat.name}
          </div>
        </div>
        <img
          src={cat.iconUrl}
          alt={cat.name}
          className="w-20 h-20 object-contain ml-4"
        />
      </div>
    ))}
  </div>
</div>; */
}
