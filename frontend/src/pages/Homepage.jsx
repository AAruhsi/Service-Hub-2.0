// import React from "react";
// import Navbar from "../components/Navbar";
// import { Button } from "@mui/material";

// const Homepage = () => {
//   return (
//     <div className="w-screen h-screen relative bg-[url('/assets/homepage.jpg')] bg-cover bg-center">
//       {/* Black Overlay */}
//       <div className="absolute inset-0 bg-black/60 z-10" />

//       {/* Content Layer */}
//       <div className="relative z-20">
//         <Navbar />
//         <div className="absolute  flex flex-col justify-center items-center w-full h-[80vh] text-white">
//           <h1 className=" text-[4rem] font-poppins font-semibold text-center">
//             Home services at your doorstep
//           </h1>
//           <h3 className="text-2xl mt-10 font-light">What do you want today?</h3>
//           <div className="flex justify-center gap-10 items-center w-full mt-4">
//             <Button
//               variant="outlined"
//               size="large"
//               style={{
//                 color: "white",
//                 borderColor: "white",
//                 width: "20vw",
//                 height: "10vh",
//               }}
//             >
//               Home Service
//             </Button>
//             <Button
//               variant="outlined"
//               size="large"
//               style={{
//                 color: "white",
//                 borderColor: "white",
//                 width: "20vw",
//                 height: "10vh",
//               }}
//             >
//               Grooming Service
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Homepage;

import Page2 from "./Page2";
const Homepage = () => {
  //Professional Services Delivered with Precision and Care
  //What Do You Need Help With Today?
  return (
    <div className="w-screen h-screen bg-white dark:bg-black">
      <div className=" flex flex-col justify-center items-center min-h-[80%] w-screen px-4 text-center">
        <h1 className="text-[3rem] md:text-[4.5rem] font-bold leading-tight tracking-tighter flex flex-wrap items-center justify-center gap-3">
          Choose Your
          <div className="w-24 h-24  overflow-hidden flex items-center justify-center">
            <video
              src="/assets/mainPage.mp4"
              loop
              autoPlay
              muted
              className="w-[100%] h-[100%] object-center object-cover"
            ></video>
          </div>
          Preferred Service
        </h1>

        <p className="text-lg mt-4 max-w-xl ">
          From cleaning to grooming, plumbing to pampering <br></br>book expert
          services with ease.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button className="bg-black text-white px-6 py-3 rounded-xl text-sm hover:bg-gray-900 transition">
            Explore Services
          </button>
          <button className="bg-white border border-black px-6 py-3 rounded-xl text-sm hover:bg-gray-100 transition">
            Book Now
          </button>
        </div>
      </div>
      <Page2 />
    </div>
  );
};

export default Homepage;
