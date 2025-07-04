import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import EditIcon from "@mui/icons-material/Edit";

const OfferAdmin = () => {
  const { user } = useAuth();
  const addModalRef = useRef();
  const editModalRef = useRef();
  const [offers, setOffers] = useState([]);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/offer`, {
        withCredentials: true,
      });
      console.log(res.data);
      setOffers(res.data || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to fetch offers");
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openAddModal = () => {
    addModalRef.current?.open();
  };

  const openEditModal = (offer) => {
    editModalRef.current?.open(offer);
  };

  return (
    <div className="container mx-auto px-4 py-4 h-[80vh] overflow-y-auto">
      <div className="flex flex-col justify-between w-full gap-5">
        <div className="flex justify-between w-full items-center mr-2">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Offers
          </h2>
          <div className="flex justify-end items-center space-y-2 flex-col mt-2">
            <button
              className="btn bg-amber-400 text-white hover:bg-amber-600"
              onClick={openAddModal}
            >
              + Add Offer
            </button>
          </div>
        </div>

        <div>
          <div className="overflow-x-auto rounded-lg border-b3-gray-200 bg-white dark:bg-gray-800 shadow-lg">
            <table className="table w-full table-sm">
              <thead>
                <tr className="text-gray-600 dark:text-gray-400">
                  <th>Title</th>
                  <th className="w-48">Description</th>
                  <th>Discount (%)</th>
                  <th>Valid From</th>
                  <th>Valid Till</th>
                  <th>Applicable On</th>
                  <th>Coupon Code</th>
                  <th>Status</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {offers.length > 0 ? (
                  offers.map((offer) => (
                    <tr
                      key={offer._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td>{offer.title}</td>
                      <td
                        className="w-48 max-w-[12rem] truncate"
                        title={offer.description}
                      >
                        {offer.description}
                      </td>
                      <td>{offer.discountValue}%</td>
                      <td>{new Date(offer.validFrom).toLocaleDateString()}</td>
                      <td>{new Date(offer.validTill).toLocaleDateString()}</td>
                      <td>
                        <ul className="list-disc list-inside">
                          {offer.applicableSubcategoryIds.map((item, index) => (
                            <li key={index}>{item.name}</li>
                          ))}
                        </ul>
                      </td>
                      <td>{offer.couponCode}</td>
                      <td>
                        <span
                          className={`badge ${
                            offer.isActive ? "badge-success" : "badge-error"
                          }`}
                        >
                          {offer.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="flex items-center justify-center gap-4">
                          <EditIcon
                            className="text-green-500 cursor-pointer"
                            onClick={() => openEditModal(offer)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center text-gray-600 dark:text-gray-300"
                    >
                      No offers available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <AddOfferModal ref={addModalRef} refreshOffers={fetchOffers} />
          <EditOfferModal ref={editModalRef} refreshOffers={fetchOffers} />
        </div>
      </div>
    </div>
  );
};

export default OfferAdmin;

export const AddOfferModal = forwardRef(({ refreshOffers }, ref) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      discountValue: "",
      validFrom: "",
      validTill: "",
      isActive: true,
      couponCode: "",
      applicableSubcategoryIds: [],
    },
  });
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState("");

  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    setValue(
      "applicableSubcategoryIds",
      selectedSubcategories.map((sub) => sub._id)
    );
  }, [selectedSubcategories, setValue]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/subcategory`, { withCredentials: true }) // Replace with your actual route
      .then((res) => setSubcategories(res.data.data))
      .catch((err) => console.error("Failed to load subcategories", err));
  }, []);

  useImperativeHandle(ref, () => ({
    open: () => {
      document.getElementById("addOfferModal").showModal();
    },
  }));

  const onSubmit = async (data) => {
    try {
      const serviceIds = Array.isArray(data.applicableSubcategoryIds)
        ? data.applicableSubcategoryIds
        : [data.applicableSubcategoryIds];

      const payload = {
        ...data,
        applicableSubcategoryIds: serviceIds,
        discountValue: Number(data.discountValue),
      };
      console.log("data", payload);
      console.log("Selected subcategories");
      await axios.post(`${BASE_URL}/offer`, payload, {
        withCredentials: true,
      });

      toast.success("Offer added successfully!");
      refreshOffers();
      reset();
    } catch (error) {
      toast.error("Failed to add offer");
      console.error("Error adding offer:", error);
    } finally {
      document.getElementById("addOfferModal").close();
    }
  };

  return (
    <dialog id="addOfferModal" className="modal">
      <div className="modal-box w-full max-w-md p-6 bg-white dark:bg-gray-800">
        <h3 className="font-bold text-xl mb-6 text-center text-gray-800 dark:text-white">
          Add New Offer
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full input input-bordered bg-gray-50 dark:bg-gray-700 dark:text-white"
              placeholder="Enter offer title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full input input-bordered bg-gray-50 dark:bg-gray-700 dark:text-white"
              placeholder="Enter offer description"
              rows="3"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex justify-center items-center gap-3">
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Discount Value (%)
              </label>
              <input
                type="number"
                {...register("discountValue", {
                  required: "Discount value is required",
                  min: { value: 0, message: "Discount must be at least 0%" },
                  max: { value: 100, message: "Discount cannot exceed 100%" },
                })}
                className="w-full input input-bordered bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Enter discount percentage"
              />
              {errors.discountValue && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.discountValue.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Coupon Code
              </label>
              <input
                {...register("couponCode", {
                  required: "Coupon code is required",
                })}
                className="w-full input input-bordered bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Enter coupon code"
              />
              {errors.couponCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.couponCode.message}
                </p>
              )}
            </div>
          </div>
          {/* date */}
          <div className="w-full flex justify-between items-center gap-3">
            {/* valide from */}
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Valid From
              </label>
              <input
                type="date"
                {...register("validFrom", {
                  required: "Valid from date is required",
                })}
                className="w-full input input-bordered bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
              {errors.validFrom && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.validFrom.message}
                </p>
              )}
            </div>
            {/* valid till */}
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Valid Till
              </label>
              <input
                type="date"
                {...register("validTill", {
                  required: "Valid till date is required",
                  validate: (value, formValues) =>
                    new Date(value) >= new Date(formValues.validFrom) ||
                    "Valid till date must be after valid from date",
                })}
                className="w-full input input-bordered bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
              {errors.validTill && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.validTill.message}
                </p>
              )}
            </div>
          </div>

          {/* subcatgeoryy */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white ">
              SubCategory
            </label>

            <div className="flex items-center gap-2">
              <select
                className="w-full select select-bordered dark:bg-gray-700 dark:text-white"
                value={currentSubcategoryId}
                onChange={(e) =>
                  setCurrentSubcategoryId(e.target.value.toString())
                }
              >
                <option value="">Select a subcategory</option>
                {subcategories?.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    disabled={selectedSubcategories.some(
                      (sub) => sub._id === cat._id
                    )}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const selected = subcategories.find(
                    (sc) => sc._id === currentSubcategoryId
                  );
                  console.log("Selcted", selected);
                  if (
                    selected &&
                    !selectedSubcategories.some(
                      (sub) => sub._id === selected._id
                    )
                  ) {
                    setSelectedSubcategories([
                      ...selectedSubcategories,
                      selected,
                    ]);
                    setCurrentSubcategoryId(""); // reset dropdown
                  }
                }}
              >
                Add
              </button>
            </div>

            {/* Display selected subcategories */}
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSubcategories.map((sub) => (
                <div
                  key={sub._id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded flex items-center gap-1"
                >
                  {sub.name}
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() =>
                      setSelectedSubcategories(
                        selectedSubcategories.filter((s) => s._id !== sub._id)
                      )
                    }
                  >
                    {/* &times; */}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isActive")}
              className="checkbox checkbox-primary"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>
          <div className="modal-action mt-6 flex justify-between">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                document.getElementById("addOfferModal").close();
                reset();
              }}
            >
              Close
            </button>
            <button
              type="submit"
              className="btn bg-amber-500 hover:bg-amber-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
});

export const EditOfferModal = forwardRef(({ refreshOffers }, ref) => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm();

  const [offerId, setOfferId] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState("");

  // Load subcategories from backend
  useEffect(() => {
    axios
      .get(`${BASE_URL}/subcategory`, { withCredentials: true })
      .then((res) => setSubcategories(res.data.data))
      .catch((err) => console.error("Failed to load subcategories", err));
  }, []);

  // Sync selected subcategories with form
  useEffect(() => {
    setValue(
      "applicableSubcategoryIds",
      selectedSubcategories.map((sub) => sub._id)
    );
  }, [selectedSubcategories, setValue]);

  useImperativeHandle(ref, () => ({
    open: (offer) => {
      setOfferId(offer._id);

      // Pre-fill the form
      setValue("title", offer.title);
      setValue("description", offer.description);
      setValue("discountValue", offer.discountValue);
      setValue("validFrom", offer.validFrom?.slice(0, 10));
      setValue("validTill", offer.validTill?.slice(0, 10));
      setValue("couponCode", offer.couponCode);
      setValue("isActive", offer.isActive);
      setSelectedSubcategories(offer.applicableSubcategoryIds || []);

      document.getElementById("editOfferModal").showModal();
    },
  }));

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        applicableSubcategoryIds: selectedSubcategories.map((sub) => sub._id),
        discountValue: Number(data.discountValue),
      };
      console.log("data to be sent ", payload);
      await axios.patch(`${BASE_URL}/offer/${offerId}`, payload, {
        withCredentials: true,
      });

      toast.success("Offer updated successfully!");
      refreshOffers();
      reset();
    } catch (error) {
      toast.error("Failed to update offer");
      console.error("Error updating offer:", error);
    } finally {
      document.getElementById("editOfferModal").close();
    }
  };

  return (
    <dialog id="editOfferModal" className="modal">
      <div className="modal-box w-full max-w-md p-6 bg-white dark:bg-gray-800">
        <h3 className="font-bold text-xl mb-6 text-center text-gray-800 dark:text-white">
          Edit Offer
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full input input-bordered dark:bg-gray-700 dark:text-white"
              placeholder="Enter offer title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full input input-bordered dark:bg-gray-700 dark:text-white"
              placeholder="Enter offer description"
              rows="3"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Discount and Coupon */}
          <div className="flex gap-3">
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                Discount Value (%)
              </label>
              <input
                type="number"
                {...register("discountValue", {
                  required: "Discount value is required",
                  min: 0,
                  max: 100,
                })}
                className="w-full input input-bordered dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                Coupon Code
              </label>
              <input
                {...register("couponCode", {
                  required: "Coupon code is required",
                })}
                className="w-full input input-bordered dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Valid Dates */}
          <div className="flex gap-3">
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                Valid From
              </label>
              <input
                type="date"
                {...register("validFrom", { required: true })}
                className="w-full input input-bordered dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                Valid Till
              </label>
              <input
                type="date"
                {...register("validTill", {
                  required: true,
                  validate: (val, values) =>
                    new Date(val) >= new Date(values.validFrom) ||
                    "Valid till must be after valid from",
                })}
                className="w-full input input-bordered dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Subcategories */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
              Subcategories
            </label>
            <div className="flex items-center gap-2">
              <select
                className="w-full select select-bordered dark:bg-gray-700 dark:text-white"
                value={currentSubcategoryId}
                onChange={(e) => setCurrentSubcategoryId(e.target.value)}
              >
                <option value="">Select a subcategory</option>
                {subcategories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    disabled={selectedSubcategories.some(
                      (sub) => sub._id === cat._id
                    )}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const selected = subcategories.find(
                    (sc) => sc._id === currentSubcategoryId
                  );
                  if (
                    selected &&
                    !selectedSubcategories.some((s) => s._id === selected._id)
                  ) {
                    setSelectedSubcategories([
                      ...selectedSubcategories,
                      selected,
                    ]);
                    setCurrentSubcategoryId("");
                  }
                }}
              >
                Add
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSubcategories.map((sub) => (
                <div
                  key={sub._id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded flex items-center gap-1"
                >
                  {sub.name}
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() =>
                      setSelectedSubcategories(
                        selectedSubcategories.filter((s) => s._id !== sub._id)
                      )
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isActive")}
              className="checkbox checkbox-primary"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-white">
              Active
            </label>
          </div>

          {/* Buttons */}
          <div className="modal-action mt-6 flex justify-between">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                document.getElementById("editOfferModal").close();
                reset();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
});
