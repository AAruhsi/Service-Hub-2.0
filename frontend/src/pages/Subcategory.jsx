import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Subcategory() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [allServices, setAllServices] = useState([]);
  const [services, setServices] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  });

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(BASE_URL + "/subcategory/" + id, {
          withCredentials: true,
        });
        // console.log(res.data.data);
        setSubcategories(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchServices = async () => {
      try {
        const res = await axios.get(BASE_URL + "/service/" + id, {
          withCredentials: true,
        });
        const data = res.data.data;
        setAllServices(data); // ✅ store all

        if (data.length > 0) {
          setSelectedSubcategory(subcategories[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubcategories();
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedSubcategory) {
      const filtered = allServices.filter(
        (service) => service.subcategoryId === selectedSubcategory._id
      );
      setServices(filtered);
    }
  }, [selectedSubcategory, allServices]);

  return (
    <div className="flex h-[88vh] bg-base-200">
      {/* Sidebar */}
      <aside className="w-54 bg-base-100 py-6 border-r border-gray-300 pl-12">
        <h2 className="text-lg text-gray-500 font-bold mb-4">Subcategories</h2>
        <ul className="menu bg-base-100 rounded-box w-full mr-0 pr-0">
          {subcategories.map((sub) => (
            <li key={sub._id} className="">
              <button
                className={`btn btn-ghost justify-start w-[100%] text-left mb-4 ${
                  selectedSubcategory?._id === sub._id
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
                    src={service.photo}
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
