import React, { useState } from "react";
import { CheckSquare, Square } from "lucide-react";

export default function Page2() {
  const [selected, setSelected] = useState([]);

  return (
    <div className="min-h-[50%]  py-10 px-4 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-2 text-center">
        What Do You Need Help With Today?
      </h2>
      <p className="mb-8 text-sm text-gray-700">
        Choose the service that you need.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`relative cursor-pointer bg-white rounded-xl p-4 w-44 h-52 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center ${
              selected.includes(service.id) ? "ring-2 ring-red-500" : ""
            }`}
            onClick={() => toggleSelect(service.id)}
          >
            <img
              src={service.icon}
              alt={service.label}
              className="w-20 h-20 mb-3"
            />
            <p className="text-center font-medium text-gray-800">
              {service.label}
            </p>
            <div className="absolute top-2 right-2">
              {selected.includes(service.id) ? (
                <CheckSquare size={20} className="text-red-500" />
              ) : (
                <Square size={20} className="text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
