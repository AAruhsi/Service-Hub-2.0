import { useNavigate } from "react-router-dom";
import Page2 from "./Page2";

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-[90vh] select-none mb-30   dark:bg-[#050505] dark:text-white transition-colors duration-300">
      <div className="flex flex-col justify-center items-center min-h-[70%] w-screen px-4 text-center">
        <h1 className="text-[3rem] md:text-[4.5rem] font-bold leading-tight tracking-tighter flex flex-wrap items-center justify-center gap-3">
          Choose Your
          <div className="w-24 h-24 overflow-hidden flex items-center justify-center rounded-full border-4 border-green-700 ">
            <video
              src="/assets/mainPage.mp4"
              loop
              autoPlay
              muted
              className="w-full h-full object-cover"
            ></video>
          </div>
          Preferred Service
        </h1>

        <p className="text-lg mt-4 max-w-xl text-gray-600 dark:text-gray-300">
          From home cleaning to appliance repair, we connect you with top
          professionals instantly for a seamless experience.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="mt-6 bg-green-500 hover:bg-green-600  text-white px-6 py-2 rounded-full text-lg mr-10"
        >
          Book a Service
        </button>
      </div>

      <Page2 />
    </div>
  );
};

export default Homepage;
