import React from "react";
import Homepage from "./Homepage";
import Page2 from "./Page2";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
const VisitorPage = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default VisitorPage;
