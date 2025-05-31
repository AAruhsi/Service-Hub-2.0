import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import EditIcon from "@mui/icons-material/Edit";
import toast from "react-hot-toast";
const PAGE_SIZE = 8;

const ServiceAdmin = ({ category }) => {
  const [allServices, setAllServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [modalMode, setModalMode] = useState("add");
  const [name, setName] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [file, setFile] = useState(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", name);
      form.append("subcategoryId", selectedSubcategory);
      form.append("min_price", min);
      form.append("max_price", max);
      if (file) {
        form.append("photo", file);
      }

      if (modalMode === "add") {
        const res = await axios.post(`${BASE_URL}/service`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        if (res.status === 200) {
          setFilteredServices((prev) => [res.data.data, ...prev]);
          toast.success(res.data.message);
        }
      } else if (modalMode === "edit" && selectedService) {
        const res = await axios.patch(
          `${BASE_URL}/service/${selectedService._id}`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        setFilteredServices((prev) =>
          prev.map((cat) =>
            cat._id === selectedService._id ? res.data.data : cat
          )
        );
        toast.success("Category updated!");
      }

      document.getElementById("my_modal_7").close();
    } catch (err) {
      console.error("Error saving category:", err);
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };
  console.log("This is filtered services", filteredServices);
  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/service`, {
          withCredentials: true,
        });
        setAllServices(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/subcategory`, {
          withCredentials: true,
        });
        setSubcategories(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };
    fetchSubcategories();
  }, []);

  // Filter services based on category
  useEffect(() => {
    if (!category?._id) return;
    const filtered = allServices.filter(
      (ser) => ser.subcategoryId?.categoryId?._id === category._id
    );
    setFilteredServices(filtered);
    setPage(1);
  }, [category, allServices]);

  // Filter subcategories for the current category
  const filteredSubcategories = subcategories.filter(
    (sub) => sub.categoryId?._id === category._id
  );

  const paginatedServices = filteredServices.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const hasMore = page * PAGE_SIZE < filteredServices.length;

  return (
    <div className="flex-2 overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-md p-4">
      <div className="pb-2 opacity-60 tracking-wide flex justify-between items-center mb-2">
        <h1 className="">Services</h1>
        <span
          className="text-white cursor-pointer bg-green-700 px-2 py-1 rounded-md"
          onClick={() => {
            setModalMode("add");
            setName("");
            setFile(null);
            setMin("");
            setMax("");
            setSelectedSubcategory("");
            document.getElementById("my_modal_7").showModal();
          }}
        >
          Add +
        </span>
      </div>

      {loading ? (
        <p className="p-4">Loading...</p>
      ) : filteredServices.length === 0 ? (
        <p className="p-4 text-sm opacity-60">No services found.</p>
      ) : (
        <>
          <table className="table table-xs">
            <thead className="text-center mb-5">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>SubCategory</th>
                <th>Min Price</th>
                <th>Max Price</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedServices.map((service, index) => (
                <tr key={service._id}>
                  <td>
                    {" "}
                    <div>
                      <img
                        className="size-10 rounded-box"
                        src={service.photo}
                        alt="service"
                      />
                    </div>
                  </td>
                  <td>{service.name}</td>
                  <td>{service.subcategoryId?.name}</td>
                  <td>{service.min_price}</td>
                  <td>{service.max_price}</td>
                  <td>
                    {service.isActive ? (
                      <div
                        className="status status-success status-xl"
                        aria-label="Active"
                      />
                    ) : (
                      <div
                        className="status status-error status-xl"
                        aria-label="Inactive"
                      />
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setModalMode("edit");
                        setName(service.name);
                        setMin(service.min_price);
                        setMax(service.max_price);
                        setFile(null);
                        setSelectedSubcategory(service.subcategoryId);
                        setSelectedService(service);
                        document.getElementById("my_modal_7").showModal();
                      }}
                    >
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredServices.length > PAGE_SIZE && (
            <div className="join mt-2 flex justify-center">
              <button
                className="join-item btn btn-sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button className="join-item btn btn-sm btn-disabled">
                {page}
              </button>
              <button
                className="join-item btn btn-sm"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!hasMore}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Service Modal */}
      <dialog id="my_modal_7" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {modalMode === "add" ? "Add Service" : "Edit Service"}
          </h3>

          <label className="floating-label my-3">
            <span>Service Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>

          <label className="floating-label mt-5">
            <span>Subcategory</span>
            <select
              className="select select-bordered w-full"
              disabled={modalMode === "edit" && selectedSubcategory !== ""}
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
            >
              <option disabled value="">
                Select Subcategory
              </option>
              {filteredSubcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-between items-center gap-2">
            <label className="floating-label my-3 w-full">
              <span>Minimum Price</span>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <label className="floating-label my-3 w-full">
              <span>Maximum Price</span>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
          </div>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input file-input-bordered w-full"
          />

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSave}
              >
                Save
              </button>
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ServiceAdmin;
