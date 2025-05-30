import React, { useState } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import FaceIcon from "@mui/icons-material/Face";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";
const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isLoggedIn, setLoggedIn } = useAuth();
  const navigate = useNavigate();
  const handlelogout = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (res.status == 200) {
        toast.success("Logged out Successfullt");
        setLoggedIn(false);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-20 border-b-1 dark:bg-gray-800 dark:text-white border-gray-300 bg-white text-black flex justify-between items-center px-10">
      <Link to="/">
        <div className="logo w-fit h-fit pl-2 font-extrabold  text-2xl dark:text-red-300">
          Service<span className="font-extralight font-serif">Hub</span>
        </div>
      </Link>
      <div className="flex gap-6 justify-evenly items-center cursor-pointer">
        <span onClick={toggleTheme}>
          {" "}
          {theme == "light" ? <LightModeIcon /> : <DarkModeIcon />}
        </span>

        <span>
          {" "}
          {isLoggedIn ? (
            <span>
              <FaceIcon onClick={() => navigate("/profile")} className="mr-4" />
              <LogoutIcon onClick={() => handlelogout()} />
            </span>
          ) : (
            <LoginOutlinedIcon onClick={() => navigate("/login")} />
          )}
        </span>
      </div>
    </div>
  );
};

export default Navbar;
