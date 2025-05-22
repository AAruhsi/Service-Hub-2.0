import React from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import FaceIcon from "@mui/icons-material/Face";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
const Navbar = () => {
  const light = false;
  const loggedIn = false;
  return (
    <div className="w-full h-20 border-b-1 text-white border-gray-300 flex justify-between items-center px-10">
      <div className="logo w-fit h-fit pl-2 font-extrabold  text-2xl">
        Service<span className="font-extralight font-serif">Hub</span>
      </div>
      <div className="flex gap-6 justify-evenly items-center ">
        {light ? <LightModeIcon /> : <DarkModeIcon />}
        {loggedIn ? <FaceIcon /> : <LoginOutlinedIcon />}
      </div>
    </div>
  );
};

export default Navbar;
