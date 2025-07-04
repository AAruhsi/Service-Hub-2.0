import Sidebar from "../../components/dashboard components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const DashboardProvider = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-white dark:bg-[#050505] dark:text-white">
      <Sidebar role={"provider"} />
      <div class="ml-auto h-[100vh] lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
        <div class="sticky z-10 top-0 h-16 bg-white text-black dark:bg-[#050505] dark:text-white  lg:py-2.5">
          <Navbar />
        </div>

        <div class="px-6 pt-5 mt-6 max-h-screen bg-white text-black dark:bg-[#050505] dark:text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardProvider;
