import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../utils/constants";
import EditIcon from "@mui/icons-material/Edit";

const SubcategoryAdmin = ({ category }) => {
  const [allSubcategories, setAllSubCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState("add");
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const PAGE_SIZE = 5;
  const [active, setActive] = useState();
  const handleSave = async () => {
    try {
      setLoading(true);
      if (modalMode === "add") {
        const res = await axios.post(
          `${BASE_URL}/subcategory`,
          { name, categoryId: category._id },
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setFilteredSubCategories((prev) => [res.data.data, ...prev]);
          toast.success(res.data.message);
        }
      } else if (modalMode === "edit" && selectedCategory) {
        const res = await axios.patch(
          `${BASE_URL}/subcategory/${selectedCategory._id}`,
          { name },
          { withCredentials: true }
        );

        setFilteredSubCategories((prev) =>
          prev.map((cat) =>
            cat._id === selectedCategory._id ? res.data.data : cat
          )
        );
        toast.success("SubCategory updated!");
      }

      document.getElementById("my_modal_6").close();
    } catch (err) {
      console.error("Error saving subcategory:", err);
      toast.error("Failed to save subcategory");
    } finally {
      setLoading(false);
    }
  };

  const handleActive = async () => {
    try {
      if (!selectedSubcategory) return;

      const updatedStatus = !selectedSubcategory.isActive;
      const res = await axios.post(
        BASE_URL + "/toggle-subcategory",
        { _id: selectedSubcategory._id, isActive: updatedStatus },
        { withCredentials: true }
      );
      if (res.status == 200) {
        toast.success("Subcategory status updated!");
      }

      setSelectedSubcategory(null); // reset
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status.");
    } finally {
      document.getElementById("isActive_modal").close();
    }
  };

  useEffect(() => {
    const fetchAllSubCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/subcategory`, {
          withCredentials: true,
        });
        setAllSubCategories(res.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSubCategories();
  }, []);

  // Filter and paginate based on selected category
  useEffect(() => {
    if (!category?._id) return;
    const filtered = allSubcategories.filter(
      (sub) => sub.categoryId?._id === category._id
    );
    setFilteredSubCategories(filtered);
    setPage(1); // reset to first page on category change
  }, [category, allSubcategories]);

  // Pagination logic
  const paginatedData = filteredSubcategories.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const hasMore = page * PAGE_SIZE < filteredSubcategories.length;

  return (
    <div>
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2  opacity-60 tracking-wide flex justify-between items-center">
          <h1 className="">Subcatgeories</h1>
          <span
            className="text-white cursor-pointer bg-green-700 px-2 text-center py-1 rounded-md"
            onClick={() => {
              setModalMode("add");
              setName("");
              document.getElementById("my_modal_6").showModal();
            }}
          >
            Add +{" "}
          </span>
        </li>

        {loading ? (
          <li className="p-4 text-sm">Loading...</li>
        ) : paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <li
              className="list-row flex justify-between items-center p-4 border-b border-base-200"
              key={item._id}
            >
              <div>
                <div>{item.name}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {item.categoryId?.name}
                </div>
              </div>
              <div className="flex justify-center items-center gap-5 mr-3">
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setModalMode("edit");
                    setName(item.name);
                    setSelectedCategory(item);
                    document.getElementById("my_modal_6").showModal();
                  }}
                >
                  <EditIcon />
                </span>
                {item.isActive ? (
                  <div
                    onClick={() => {
                      setSelectedSubcategory(item);
                      document.getElementById("isActive_modal").showModal();
                    }}
                    aria-label="success"
                    className="status status-success status-xl cursor-pointer"
                  ></div>
                ) : (
                  <div
                    onClick={() => {
                      setSelectedSubcategory(item);
                      document.getElementById("isActive_modal").showModal();
                    }}
                    aria-label="error"
                    className="status status-error status-xl cursor-pointer"
                  ></div>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-sm opacity-60">No subcategories found.</li>
        )}
      </ul>

      {/* DaisyUI Pagination Controls */}
      {!loading && filteredSubcategories.length > PAGE_SIZE && (
        <div className="join mt-4 flex justify-center">
          <button
            className="join-item btn"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <button className="join-item btn btn-disabled">{page}</button>
          <button
            className="join-item btn"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasMore}
          >
            Next
          </button>
        </div>
      )}

      <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {modalMode === "add" ? "Add Category" : "Edit Category"}
          </h3>
          <label className="floating-label my-3">
            <span>Subcategory Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>
          <label className="floating-label mt-5">
            <span>Category Name</span>
            <input
              type="text"
              value={category.name}
              disabled
              className="input input-bordered w-full"
            />
          </label>
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

      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <dialog
        id="isActive_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Do you really want to perform this action</p>
          <div className="modal-action">
            <form method="dialog">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleActive}
              >
                Yes
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SubcategoryAdmin;
