import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ServiceProviding = () => {
  const { user } = useAuth();
  const modalRef = useRef();
  const editModalRef = useRef();
  const [services, setServices] = useState([]);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await axios.get(BASE_URL + "/serviceOffered/" + user._id, {
        withCredentials: true,
      });
      setServices(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openModal = () => {
    modalRef.current?.open();
  };

  const openEditModal = (service) => {
    setServiceToEdit(service);
    editModalRef.current?.open();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/serviceOffered/${id}`, {
        withCredentials: true,
      });
      toast.success("Service deleted successfully!");
      fetchServices(); // refresh table
    } catch (error) {
      toast.error("Failed to delete service");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between w-full items-center mr-20 p-4  dark:bg-[#050505] dark:text-white">
        <h1>Services</h1>
        <button className="btn bg-amber-400 text-white " onClick={openModal}>
          + Add Service
        </button>
      </div>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-gray-100 text-black dark:bg-gray-800 dark:text-white">
        <table className="table">
          <thead>
            <tr className="dark:text-gray-500">
              <th></th>
              <th>Name</th>
              <th>Subcategory</th>
              <th>Category</th>
              <th>Min Price</th>
              <th>Max Price</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map((service) => (
                <tr key={service._id}>
                  <th>
                    <img
                      className="size-10 rounded-box"
                      src={service.serviceId.photo}
                      alt="service"
                    />
                  </th>
                  <td>{service.serviceId.name}</td>
                  <td>{service.serviceId.subcategoryId?.name}</td>
                  <td>{service.serviceId.subcategoryId?.categoryId?.name}</td>
                  <td>₹{service.serviceId.min_price}</td>
                  <td>₹{service.serviceId.max_price}</td>
                  <td>₹{service.price}</td>
                  <td>
                    <div className="flex items-center justify-center gap-4">
                      <EditIcon
                        className="text-green-500 cursor-pointer"
                        onClick={() => openEditModal(service)}
                      />
                      <DeleteIcon
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(service._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddServiceModal ref={modalRef} refreshServices={fetchServices} />
      <EditServiceModal
        ref={editModalRef}
        service={serviceToEdit}
        refreshServices={fetchServices}
      />
    </div>
  );
};

export default ServiceProviding;

export const AddServiceModal = forwardRef((props, ref) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const [minPrice, setMinPrice] = useState(0); // 🔥
  const [maxPrice, setMaxPrice] = useState(0); // 🔥
  const [actualPrice, setActualPrice] = useState(""); // 🔥
  const [selectedServiceObject, setSelectedServiceObject] = useState(null); // 🔥

  useImperativeHandle(ref, () => ({
    open: () => {
      document.getElementById("addServicesModal").showModal();
      fetchCategories();
    },
  }));

  const handleServiceChange = (e) => {
    const id = e.target.value;
    setSelectedService(id);
    const service = services.find((srv) => srv._id === id); // 🔥
    if (service) {
      setMinPrice(service.minPrice || 0);
      setMaxPrice(service.maxPrice || 0);
      setSelectedServiceObject(service);
    }
  };
  const handleCategoryChange = (e) => {
    const id = e.target.value;
    setSelectedCategory(id);
    setSelectedSubcategory("");
    setSelectedService("");
    setSubcategories([]);
    setServices([]);
    fetchSubcategories(id);
  };

  const handleSubcategoryChange = (e) => {
    const id = e.target.value;
    setSelectedSubcategory(id);
    setSelectedService("");
    setServices([]);
    fetchServices(id);
  };
  const handleSave = async () => {
    try {
      if (
        actualPrice < selectedServiceObject.minPrice ||
        actualPrice > selectedServiceObject.maxPrice
      ) {
        toast.error(
          `Actual price must be between ₹${selectedServiceObject.minPrice} and ₹${selectedServiceObject.maxPrice}`
        );
        return;
      }
      const payload = {
        providerId: user._id,
        serviceId: selectedServiceObject._id,
        price: Number(actualPrice),
      };

      const res = await axios.post(BASE_URL + "/serviceOffered/add", payload, {
        withCredentials: true,
      });
      console.log(res);
      toast.success("Service saved successfully!");

      setSelectedCategory("");
      setSelectedSubcategory("");
      setSelectedServiceObject(null);
      setActualPrice("");
      setMinPrice(0);
      setMaxPrice(0);
    } catch (error) {
    } finally {
      document.getElementById("addServicesModal").close();
    }
  };
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(BASE_URL + "/category", {
        withCredentials: true,
      });
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(
        BASE_URL + "/subcategory/" + categoryId,
        { withCredentials: true }
      );

      setSubcategories(response.data.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Fetch services
  const fetchServices = async (subcategoryId) => {
    try {
      const response = await axios.get(
        BASE_URL + "/service/subcategory/" + subcategoryId,
        {
          withCredentials: true,
        }
      );

      setServices(response.data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  return (
    <>
      <dialog id="addServicesModal" className="modal">
        <div className="modal-box w-full max-w-md p-6 dark:bg-gray-800 dark:text-white">
          <h3 className="font-bold text-xl mb-6 text-center">
            Add New Service
          </h3>

          <div className="space-y-4">
            {/* Category */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                Category
              </label>
              <select
                className="w-full select select-bordered dark:bg-gray-700 dark:text-white"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700  dark:text-white">
                Subcategory
              </label>
              <select
                className="w-full select select-bordered dark:bg-gray-700 dark:text-white"
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
                disabled={!selectedCategory}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Service */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                Service
              </label>
              <select
                className="w-full select select-bordered dark:bg-gray-700 dark:text-white"
                value={selectedServiceObject?._id || ""}
                onChange={(e) => {
                  const selected = services.find(
                    (srv) => srv._id === e.target.value
                  );
                  setSelectedServiceObject(selected);
                  setActualPrice("");
                }}
                disabled={!selectedSubcategory}
              >
                <option value="">Select Service</option>
                {services.map((srv) => (
                  <option key={srv._id} value={srv._id}>
                    {srv.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Display & Input */}
            {selectedServiceObject && (
              <>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                    Price Range
                  </label>
                  <p className="text-sm text-gray-600 dark:bg-gray-700 dark:text-white">
                    ₹{selectedServiceObject.min_price} – ₹
                    {selectedServiceObject.max_price}
                  </p>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700  dark:text-white">
                    Actual Price
                  </label>
                  <input
                    type="number"
                    className="w-full input input-bordered dark:bg-gray-700 dark:text-white"
                    placeholder="Enter actual price"
                    value={actualPrice}
                    onChange={(e) => setActualPrice(e.target.value)}
                    min={selectedServiceObject.min_price}
                    max={selectedServiceObject.max_price}
                  />
                </div>
              </>
            )}
          </div>

          {/* Modal actions */}
          <div className="modal-action mt-6 flex justify-between">
            <form method="dialog">
              <button className="btn btn-outline">Close</button>
            </form>
            <button
              className="btn bg-amber-500 hover:bg-amber-600 text-white"
              disabled={!selectedServiceObject || !actualPrice}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
});

export const EditServiceModal = forwardRef(
  ({ service, refreshServices }, ref) => {
    const { user } = useAuth();
    const [actualPrice, setActualPrice] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    useImperativeHandle(ref, () => ({
      open: () => {
        if (service) {
          setActualPrice(service.price);
          setMinPrice(service.serviceId.min_price);
          setMaxPrice(service.serviceId.max_price);
          document.getElementById("editServicesModal").showModal();
        }
      },
    }));

    const handleSave = async () => {
      if (actualPrice < minPrice || actualPrice > maxPrice) {
        toast.error(`Price must be between ₹${minPrice} and ₹${maxPrice}`);
        return;
      }

      try {
        const payload = {
          price: Number(actualPrice),
        };

        await axios.patch(
          `${BASE_URL}/serviceOffered/${service._id}`,
          payload,
          {
            withCredentials: true,
          }
        );

        toast.success("Service updated successfully!");
        refreshServices?.(); // 👈 Re-fetch list
      } catch (error) {
        toast.error("Failed to update service");
        console.error(error);
      } finally {
        document.getElementById("editServicesModal").close();
      }
    };

    return (
      <dialog id="editServicesModal" className="modal ">
        <div className="modal-box w-full max-w-md p-6 dark:bg-gray-800">
          <h3 className="font-bold text-xl mb-6 text-center">
            Edit Service Price
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-white">
                Service
              </label>
              <input
                className="w-full input input-bordered bg-gray-100 dark:bg-gray-700 dark:text-white"
                readOnly
                value={service?.serviceId.name || ""}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-white">
                Category
              </label>
              <input
                className="w-full input input-bordered bg-gray-100 dark:bg-gray-700 dark:text-white"
                readOnly
                value={service?.serviceId.subcategoryId?.categoryId?.name || ""}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-white">
                Subcategory
              </label>
              <input
                className="w-full input input-bordered bg-gray-100 dark:bg-gray-700 dark:text-white"
                readOnly
                value={service?.serviceId.subcategoryId?.name || ""}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-white">
                Price Range
              </label>
              <p className="text-sm text-gray-600 dark:bg-gray-700 dark:text-white">
                ₹{minPrice} – ₹{maxPrice}
              </p>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-700 dark:text-white">
                New Price
              </label>
              <input
                type="number"
                className="w-full input input-bordered dark:bg-gray-700 dark:text-white"
                placeholder="Enter new price"
                value={actualPrice}
                onChange={(e) => setActualPrice(e.target.value)}
                min={minPrice}
                max={maxPrice}
              />
            </div>
          </div>

          <div className="modal-action mt-6 flex justify-between">
            <form method="dialog">
              <button className="btn btn-outline">Cancel</button>
            </form>
            <button
              className="btn bg-green-600 text-white"
              disabled={!actualPrice}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    );
  }
);
