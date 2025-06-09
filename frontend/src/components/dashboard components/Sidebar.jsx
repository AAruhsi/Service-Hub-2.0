import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ role = "admin" }) => {
  // src/config/menuConfig.js

  const menuItems = {
    admin: [
      { label: "Dashboard", path: "/admin/dashboard/home" },
      { label: "Categories", path: "/admin/dashboard/category" },
      { label: "Providers", path: "/admin/dashboard/providers" },
    ],
    provider: [
      { label: "Dashboard", path: "/provider/dashboard/home" },
      { label: "My Services", path: "/provider/dashboard/services" },
      { label: "Appointments", path: "/provider/dashboard/availability" },
    ],
  };

  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <aside className="ml-[-100%] fixed top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r border-gray-300 bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
      <div>
        <div className="mt-8 text-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuPzAOB6d0BxKBBN7Kr5fCEwML4vGslJXX2w&s"
            alt={role}
            className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28"
          />
          <h5 className="mt-4 text-xl font-semibold text-gray-600">{role}</h5>
        </div>

        <ul className="space-y-2 tracking-wide mt-8">
          {menuItems[role].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`px-4 py-3 flex items-center space-x-4 rounded-md ${
                  isActive(item.path)
                    ? "text-white bg-gradient-to-r from-sky-600 to-cyan-400"
                    : "text-gray-600 group"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
