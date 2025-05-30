import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import EditIcon from "@mui/icons-material/Edit";
import { FixedSizeList as List } from "react-window";

const SubcategoryAdmin = lazy(() => import("./SubcategoryAdmin"));
const ServiceAdmin = lazy(() => import("./ServiceAdmin"));

const PAGE_SIZE = 5;

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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

  const firstCategory = useMemo(() => categories[0], [categories]);

  const Row = ({ index, style }) => {
    const category = categories[index];
    return (
      <li
        className="list-row border-b-1 border-gray-200 px-5"
        style={style}
        key={category._id}
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
          <span className="cursor-pointer">
            <EditIcon />
          </span>
          {category.isActive ? (
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
    );
  };

  return (
    <div className="flex pb-4 gap-10 my-3 w-full">
      <div className="flex flex-col flex-[1.2]">
        <div>
          <ul
            className="list bg-base-100 rounded-box shadow-md mb-10"
            onScroll={handleScroll}
            style={{ height: "250px", overflowY: "auto" }}
          >
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide ">
              Categories
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
          {firstCategory && <SubcategoryAdmin category={firstCategory} />}
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading Services...</div>}>
        <ServiceAdmin />
      </Suspense>
    </div>
  );
};

export default CategoryAdmin;
