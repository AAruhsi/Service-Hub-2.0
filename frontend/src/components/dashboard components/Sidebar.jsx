import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [selected, setSelected] = useState("dashboard");

  const isActive = (path) => location.pathname.includes(path);

  return (
    <aside className="ml-[-100%] fixed top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r border-gray-300 bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
      <div>
        <div className="mt-8 text-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuPzAOB6d0BxKBBN7Kr5fCEwML4vGslJXX2w&s"
            alt="Admin"
            className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28"
          />
          <h5 className="mt-4 text-xl font-semibold text-gray-600">Admin</h5>
        </div>

        <ul className="space-y-2 tracking-wide mt-8">
          <li>
            <Link
              to="/admin/dashboard/home"
              onClick={() => setSelected("home")}
              className={`relative px-4 py-3 flex items-center space-x-4 rounded-xl ${
                isActive("home")
                  ? "text-white bg-gradient-to-r from-sky-600 to-cyan-400"
                  : "text-gray-600 group"
              }`}
            >
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/dashboard/category"
              onClick={() => setSelected("category")}
              className={`px-4 py-3 flex items-center space-x-4 rounded-md ${
                isActive("category")
                  ? "text-white bg-gradient-to-r from-sky-600 to-cyan-400"
                  : "text-gray-600 group"
              }`}
            >
              <span>Categories</span>
            </Link>
          </li>

          <li>
            <Link
              to="/admin/dashboard/providers"
              onClick={() => setSelected("providers")}
              className={`px-4 py-3 flex items-center space-x-4 rounded-md ${
                isActive("providers")
                  ? "text-white bg-gradient-to-r from-sky-600 to-cyan-400"
                  : "text-gray-600 group"
              }`}
            >
              <span className="group-hover:text-gray-700">Providers</span>
            </Link>
          </li>
          {/* 

          <li>
            <Link
              to="/admin/dashboard/other"
              className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  className="fill-current"
                  d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                />
                <path
                  className="fill-current text-gray-300 group-hover:text-cyan-300"
                  d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
                />
              </svg>
              <span className="group-hover:text-gray-700">Other Data</span>
            </Link>
          </li> */}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
