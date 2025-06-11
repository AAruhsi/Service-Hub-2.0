import Sidebar from "../../components/dashboard components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Dashboard = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-white dark:bg-black dark:text-white">
      <Sidebar role={"admin"} />
      <div class="ml-auto h-[100vh] lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
        <div class="sticky z-90 top-0 h-16   lg:py-2.5">
          <Navbar />
        </div>

        <div class="px-6 pt-5 max-h-[80%] mt-6 bg-gray-100 dark:bg-black dark:text-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
