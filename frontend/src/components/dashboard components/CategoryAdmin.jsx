import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import EditIcon from "@mui/icons-material/Edit";
import { FixedSizeList as List } from "react-window";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const SubcategoryAdmin = lazy(() => import("./SubcategoryAdmin"));
const ServiceAdmin = lazy(() => import("./ServiceAdmin"));

const PAGE_SIZE = 5;

const CategoryAdmin = () => {
  const { isLoggedIn } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState();
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [modalMode, setModalMode] = useState("add");
  const navigate = useNavigate();
  const handleSave = async () => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", name);
      if (file) {
        form.append("iconUrl", file);
      }

      if (modalMode === "add") {
        const res = await axios.post(`${BASE_URL}/category`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        if (res.status === 200) {
          setCategories((prev) => [res.data.data, ...prev]);
          toast.success(res.data.message);
        }
      } else if (modalMode === "edit" && selectedCategory) {
        console.log(form);
        const res = await axios.patch(
          `${BASE_URL}/category/${selectedCategory._id}`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        console.log(res.data);
        // Replace the updated category in state
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === selectedCategory._id ? res.data.data : cat
          )
        );
        toast.success("Category updated!");
      }

      document.getElementById("my_modal_5").close();
    } catch (err) {
      console.error("Error saving category:", err);
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  });
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/category?page=${page}&limit=${PAGE_SIZE}`,
          {
            withCredentials: true,
          }
        );
        const newCategories = res.data.data;
        setCategories((prev) => {
          const existingIds = new Set(prev.map((c) => c._id));
          const filtered = newCategories.filter((c) => !existingIds.has(c._id));
          return [...prev, ...filtered];
        });

        setHasMore(newCategories.length === PAGE_SIZE);
        if (page === 1 && newCategories.length > 0 && !selectedCategory) {
          setSelectedCategory(newCategories[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [page]);

  const handleScroll = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
      hasMore &&
      !loading
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const Row = ({ index, style }) => {
    const category = categories[index];
    return (
      <li
        className={`list-row border-b-1 border-gray-200 px-5 cursor-pointer ${
          selectedCategory?._id === category._id ? "bg-gray-100" : ""
        }`}
        style={style}
        key={category._id}
        onClick={() => setSelectedCategory(category)}
      >
        <div>
          <img
            className="size-10 rounded-box"
            src={category.iconUrl}
            alt="category"
          />
        </div>
        <div className="mt-3 text-gray-900">{category.name}</div>
        <div className="flex justify-center items-center gap-5 mr-3">
          <span
            className="tooltip cursor-pointer "
            data-tip="edit"
            onClick={() => {
              setModalMode("edit");
              setName(category.name);
              setIsActive(category.isActive);
              setFile(null);
              setSelectedCategory(category);
              document.getElementById("my_modal_5").showModal();
            }}
          >
            <EditIcon />
          </span>
          {category.isActive ? (
            <div
              aria-label="success"
              className="status status-success status-xl cursor-pointer tooltip"
              data-tip="Active"
            ></div>
          ) : (
            <div
              aria-label="error"
              data-tip="inActive"
              className="status status-error status-xl cursor-pointer tooltip"
            ></div>
          )}
        </div>
      </li>
    );
  };

  return (
    <>
      <div className="flex pb-4 gap-10 my-3 w-full">
        <div className="flex flex-col flex-[1.2]">
          <div>
            <ul
              className="list bg-base-100 rounded-box shadow-md mb-10"
              onScroll={handleScroll}
              style={{ height: "250px", overflowY: "auto" }}
            >
              <li className="p-4 pb-2  opacity-60 tracking-wide flex justify-between items-center">
                <h1 className="">Catgeories</h1>
                <span
                  className="text-white cursor-pointer bg-green-700 px-2 text-center py-1 rounded-md"
                  onClick={() => {
                    setModalMode("add");
                    setName("");
                    setFile(null);
                    document.getElementById("my_modal_5").showModal();
                  }}
                >
                  Add +{" "}
                </span>
              </li>
              {!loading && categories.length > 0 ? (
                <List
                  height={340}
                  itemCount={categories.length}
                  itemSize={70}
                  width={"100%"}
                >
                  {Row}
                </List>
              ) : (
                <li className="list-row p-10">
                  <div className="skeleton h-32 w-32"></div>
                </li>
              )}
            </ul>
          </div>

          <Suspense fallback={<div>Loading Subcategories...</div>}>
            {selectedCategory && (
              <SubcategoryAdmin category={selectedCategory} />
            )}
          </Suspense>
        </div>

        <Suspense fallback={<div>Loading Services...</div>}>
          {selectedCategory && <ServiceAdmin category={selectedCategory} />}
        </Suspense>
      </div>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {modalMode === "add" ? "Add Category" : "Edit Category"}
          </h3>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="input input-bordered w-full"
          />

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
    </>
  );
};

export default CategoryAdmin;
