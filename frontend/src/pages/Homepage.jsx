import React from "react";
import Navbar from "../components/Navbar";
import { Button } from "@mui/material";

const Homepage = () => {
  return (
    <div className="w-screen h-screen relative bg-[url('/assets/homepage.jpg')] bg-cover bg-center">
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content Layer */}
      <div className="relative z-20">
        <Navbar />
        <div className="absolute  flex flex-col justify-center items-center w-full h-[80vh] text-white">
          <h1 className=" text-[4rem] font-poppins font-semibold text-center">
            Home services at your doorstep
          </h1>
          <h3 className="text-2xl mt-10 font-light">What do you want today?</h3>
          <div className="flex justify-center gap-10 items-center w-full mt-4">
            <Button
              variant="outlined"
              size="large"
              style={{
                color: "white",
                borderColor: "white",
                width: "20vw",
                height: "10vh",
              }}
            >
              Home Service
            </Button>
            <Button
              variant="outlined"
              size="large"
              style={{
                color: "white",
                borderColor: "white",
                width: "20vw",
                height: "10vh",
              }}
            >
              Grooming Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
