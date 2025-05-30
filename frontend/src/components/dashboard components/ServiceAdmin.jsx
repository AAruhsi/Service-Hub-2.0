import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import EditIcon from "@mui/icons-material/Edit";

const PAGE_SIZE = 8;

const ServiceAdmin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/service`, {
          withCredentials: true,
        });
        setServices(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const paginatedServices = services.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const hasMore = page * PAGE_SIZE < services.length;

  return (
    <div className="flex-2 overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Services</h2>
      {loading ? (
        <p className="p-4">Loading...</p>
      ) : services.length === 0 ? (
        <p className="p-4 text-sm opacity-60">No services found.</p>
      ) : (
        <>
          <table className="table">
            <thead className="text-center">
              <tr>
                <th>#</th>
                <th>Name</th>
                {/* <th>Category</th> */}
                <th>SubCategory</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedServices.map((service, index) => (
                <tr key={service._id}>
                  <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                  <td>{service.name}</td>
                  <td>{service.subcategoryId?.name}</td>
                  <td className="">
                    {service.isActive ? (
                      <div
                        className="status status-success status-xl"
                        aria-label="Active"
                      ></div>
                    ) : (
                      <div
                        className="status status-error status-xl "
                        aria-label="Inactive"
                      ></div>
                    )}
                  </td>
                  <td>
                    <button className="">
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* DaisyUI Pagination */}
          {services.length > PAGE_SIZE && (
            <div className="join  mt-2 flex justify-center">
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
    </div>
  );
};

export default ServiceAdmin;
