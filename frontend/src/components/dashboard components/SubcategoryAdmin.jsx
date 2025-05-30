import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import EditIcon from "@mui/icons-material/Edit";

const SubcategoryAdmin = ({ category }) => {
  const [allSubcategories, setAllSubCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

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
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Subcategories
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
                <span className="cursor-pointer">
                  <EditIcon />
                </span>
                {category?.isActive ? (
                  <div
                    aria-label="success"
                    className="status status-success status-xl cursor-pointer"
                  ></div>
                ) : (
                  <div
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
    </div>
  );
};

export default SubcategoryAdmin;
