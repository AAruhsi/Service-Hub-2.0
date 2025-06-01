import React, { useEffect, useState } from "react";

// Dummy data with service images
const dummySubcategories = [
  { id: "1", name: "Cleaning" },
  { id: "2", name: "Plumbing" },
  { id: "3", name: "Electrical" },
];

const dummyServices = {
  1: [
    {
      name: "Sofa Cleaning",
      image: "https://via.placeholder.com/300x200?text=Sofa+Cleaning",
    },
    {
      name: "Carpet Cleaning",
      image: "https://via.placeholder.com/300x200?text=Carpet+Cleaning",
    },
    {
      name: "Sofa Cleaning",
      image: "https://via.placeholder.com/300x200?text=Sofa+Cleaning",
    },
    {
      name: "Carpet Cleaning",
      image: "https://via.placeholder.com/300x200?text=Carpet+Cleaning",
    },
    {
      name: "Sofa Cleaning",
      image: "https://via.placeholder.com/300x200?text=Sofa+Cleaning",
    },
    {
      name: "Carpet Cleaning",
      image: "https://via.placeholder.com/300x200?text=Carpet+Cleaning",
    },
  ],
  2: [
    {
      name: "Leak Fix",
      image: "https://via.placeholder.com/300x200?text=Leak+Fix",
    },
  ],
  3: [
    {
      name: "Fan Repair",
      image: "https://via.placeholder.com/300x200?text=Fan+Repair",
    },
  ],
};

function Subcategory() {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    setSubcategories(dummySubcategories);
    setSelectedSubcategory(dummySubcategories[0]);
  }, []);

  useEffect(() => {
    if (selectedSubcategory) {
      setServices(dummyServices[selectedSubcategory.id] || []);
    }
  }, [selectedSubcategory]);

  return (
    <div className="flex h-[88vh] bg-base-200">
      {/* Sidebar */}
      <aside className="w-54 bg-base-100 py-6 border-r border-gray-300 pl-12">
        <h2 className="text-lg text-gray-500 font-bold mb-4">Subcategories</h2>
        <ul className="menu bg-base-100 rounded-box w-full mr-0 pr-0">
          {subcategories.map((sub) => (
            <li key={sub.id} className="">
              <button
                className={`btn btn-ghost justify-start w-[100%] text-left mb-4 ${
                  selectedSubcategory?.id === sub.id
                    ? "bg-black shadow-2xl text-white scale-105"
                    : ""
                }`}
                onClick={() => setSelectedSubcategory(sub)}
              >
                {sub.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Services for:{" "}
          <span className="text-primary">{selectedSubcategory?.name}</span>
        </h2>

        {services.length === 0 ? (
          <div className="alert alert-warning shadow-lg w-fit">
            <span>No services available for this subcategory.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, index) => (
              <div key={index} className="card bg-base-100 shadow-md">
                <figure>
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <h3 className="card-title">{service.name}</h3>
                    <button className="btn btn-primary btn-sm">Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Subcategory;
