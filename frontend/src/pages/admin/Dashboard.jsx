import Sidebar from "../../components/dashboard components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Dashboard = () => {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Sidebar />
      <div class="ml-auto h-[100vh] lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
        <div class="sticky z-10 top-0 h-16 border-b bg-white lg:py-2.5">
          <Navbar />
        </div>

        <div class="px-6 pt-10 max-h-screen  bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
