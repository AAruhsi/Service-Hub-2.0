import axios, { all } from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constants";
import toast from "react-hot-toast";

function ProvidersAdmin() {
  const [allProviders, setAllProviders] = useState([]);
  const [approvedProviders, setApprovedProviders] = useState([]);
  const [notApprovedProviders, setNotApprovedProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState([]);
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get(BASE_URL + "/admin/providers", {
          withCredentials: true,
        });
        if (res.status === 200) {
          const data = res.data.data;
          setAllProviders(data);

          const approved = data.filter((p) => p.approval === true);

          setApprovedProviders(approved);
          const Notapproved = data.filter((p) => p.approval === false);

          setNotApprovedProviders(Notapproved);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProviders();
  }, []);

  const handleApprove = async () => {
    try {
      const id = selectedProvider._id;
      const toggledApproval = !selectedProvider.approval;

      const res = await axios.patch(
        `${BASE_URL}/admin/provider/approval/${id}`,
        {}, // Or you can send `{ approval: toggledApproval }` if backend expects it
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success(
          toggledApproval ? "Provider Approved" : "Approval Revoked"
        );

        // Update provider approval status locally
        const updatedProvider = {
          ...selectedProvider,
          approval: toggledApproval,
        };

        // Remove from both lists, then reassign based on new approval status
        setApprovedProviders((prev) =>
          prev.filter((p) => p._id !== selectedProvider._id)
        );
        setNotApprovedProviders((prev) =>
          prev.filter((p) => p._id !== selectedProvider._id)
        );

        if (toggledApproval) {
          setApprovedProviders((prev) => [...prev, updatedProvider]);
        } else {
          setNotApprovedProviders((prev) => [...prev, updatedProvider]);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      document.getElementById("approval_modal").close();
    }
  };

  return (
    <div className="h-[80vh]">
      <h1 className="my-3 font-bold text-gray-800 dark:text-white">
        Approved Providers
      </h1>
      {!approvedProviders ? (
        <span className="loading loading-spinner loading-xl">Loading...</span>
      ) : approvedProviders.length === 0 ? (
        <div className="text-center text-lg font-semibold text-gray-500 dark:text-white">
          No Approved providers.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border dark:bg-gray-800 border-base-content/5 bg-base-100 mb-5 px-3 py-4">
          <table className="table table-xs">
            {/* head */}
            <thead className=" ">
              <tr className="text-gray-600 dark:text-gray-400">
                <th></th>
                <th>Name</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Phone No</th>
                <th>Email</th>
                <th>Date of joining</th>
                <th>Rating</th>
                <th>Approval</th>
                <th>View details</th>
              </tr>
            </thead>
            <tbody>
              {approvedProviders.map((provider) => (
                <tr key={provider._id}>
                  <td>
                    <div>
                      <img
                        className="size-10 rounded-box"
                        src={provider.photo}
                        alt="Provider"
                      />
                    </div>
                  </td>
                  <td>
                    {provider.firstName} {provider.lastName}
                  </td>

                  <td>{provider.gender}</td>
                  <td>{provider.address}</td>
                  <td>{provider.phoneNo}</td>
                  <td>{provider.email}</td>
                  <td>{provider.doj}</td>
                  <td>{provider.avgRating}</td>
                  <td>
                    <div
                      aria-label="success"
                      className="status status-success status-xl cursor-pointer "
                      onClick={() => {
                        setSelectedProvider(provider);
                        document.getElementById("approval_modal").showModal();
                      }}
                    ></div>
                  </td>
                  <td>
                    <button
                      className="btn btn-info text-white btn-sm"
                      onClick={() => {
                        setSelectedProvider(provider);
                        document
                          .getElementById("open_provider_modal")
                          .showModal();
                      }}
                    >
                      Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <h1 className="my-3 font-bold text-gray-800 dark:text-white">
        Not Approved Providers
      </h1>
      {!notApprovedProviders ? (
        <span className="loading loading-spinner loading-xl">Loading...</span>
      ) : notApprovedProviders.length === 0 ? (
        <div className="text-center text-lg font-semibold text-gray-500 mt-6 ">
          No new providers to approve.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box dark:bg-gray-800  border border-base-content/5 bg-base-100 mb-4 px-3 py-4">
          <table className="table table-xs">
            {/* head */}
            <thead className=" ">
              <tr className="text-gray-600 dark:text-gray-400">
                <th></th>
                <th>Name</th>
                <th>Gender</th>
                <th>Address</th>

                <th>Phone No</th>
                <th>Email</th>

                <th>Date of joining</th>

                <th>Rating</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {notApprovedProviders.map((provider) => (
                <tr key={provider._id}>
                  <td>
                    <div>
                      <img
                        className="size-10 rounded-box "
                        src={provider.photo}
                        alt="Provider"
                      />
                    </div>
                  </td>
                  <td>
                    {provider.firstName} {provider.lastName}
                  </td>

                  <td>{provider.gender}</td>
                  <td>{provider.address}</td>
                  <td>{provider.phoneNo}</td>
                  <td>{provider.email}</td>
                  <td>{provider.doj}</td>
                  <td>{provider.avgRating}</td>
                  <td>
                    <div
                      aria-label="error"
                      className="status status-error status-xl cursor-pointer tooltip"
                      data-tip="Active"
                      onClick={() => {
                        setSelectedProvider(provider);
                        document.getElementById("approval_modal").showModal();
                      }}
                    ></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <dialog
        id="approval_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box dark:bg-gray-800">
          <p className="py-4">Do you want to approve this provider</p>
          <div className="modal-action">
            <form method="dialog">
              <button
                type="button"
                className="btn btn-success mr-3"
                onClick={handleApprove}
              >
                Yes
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog
        id="open_provider_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box p-6 rounded-lg shadow-lg bg-white">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:text-black">
              ✕
            </button>
          </form>

          <div className="flex flex-col items-center space-y-4">
            {/* Provider Photo */}
            <figure className="w-32 h-32 overflow-hidden rounded-full border shadow-md">
              <img
                src={selectedProvider.photo}
                alt={`${selectedProvider.firstName} ${selectedProvider.lastName}`}
                className="object-cover w-full h-full"
              />
            </figure>

            {/* Provider Info */}
            <div className="text-center space-y-1">
              <div className="flex justify-center items-center gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedProvider.firstName} {selectedProvider.lastName}
                </h2>
                <div className="text-yellow-400 text-2xl font-medium flex justify-center items-center gap-1">
                  {selectedProvider.avgRating}
                  <div className="rating rating-sm">
                    <input
                      type="radio"
                      name="rating"
                      className="mask mask-star-2 bg-orange-400"
                      defaultChecked
                      aria-label="1 star"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-4">
                <p className="text-gray-500">{selectedProvider.gender}</p>
                <p className="text-sm text-gray-500">
                  Joined on:{" "}
                  {new Date(selectedProvider.doj).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <p className="text-gray-600">{selectedProvider.email}</p>
              <p className="text-gray-600">{selectedProvider.phoneNo}</p>
              <p className="text-gray-600">{selectedProvider.address}</p>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ProvidersAdmin;
