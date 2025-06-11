import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const ProviderSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingInfo = location.state;
  const serviceId = bookingInfo?.service._id;
  const service = bookingInfo?.service;
  const date = bookingInfo?.date;
  const time = bookingInfo?.timeOfDay;
  const timeOfDay = bookingInfo?.time;

  const [data, setData] = useState([]);

  const fetchServiceProvider = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/serviceOffered/${serviceId}/${date}/${time}`
      );
      setData(res.data.serviceOffered || []);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    }
  };

  useEffect(() => {
    fetchServiceProvider();
  }, []);

  const handleBooking = async (provider, item) => {
    const location = {
      service: service,
      provider: provider,
      date: date,
      time: time,
      price: item.price,
      timeOfDay: timeOfDay,
    };
    navigate("/orderDetails", { state: location });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-2">
          <button
            className="btn btn-sm btn-outline mb-15"
            onClick={() => navigate(-1)}
          >
            ⬅ Back
          </button>
          <h2 className="text-2xl font-bold text-center flex-1 mb-15">
            Choose a Provider
          </h2>
          <div className="w-16"></div> {/* Spacer to balance the layout */}
        </div>

        {data.length === 0 ? (
          <div className="text-center text-gray-500">
            No providers available at this time slot.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {data.map((item, index) => {
              const provider = item.providerId;
              console.log(service);
              return (
                <div
                  className="mx-auto bg-white rounded-3xl shadow-xl max-w-[270px] select-none"
                  key={index}
                >
                  <img
                    src={
                      provider.photo || "https://via.placeholder.com/270x224"
                    }
                    className="rounded-t-3xl h-56 object-cover"
                    width="270"
                    alt={`${provider.firstName} ${provider.lastName}`}
                  />
                  <div className="group px-5 py-3 grid">
                    <div className="flex justify-between items-center">
                      <span className="group-hover:text-cyan-700 font-bold md:text-2xl line-clamp-2">
                        {provider.firstName} {provider.lastName}
                      </span>
                      <span className="text-3xl flex gap-x-1 font-black items-center group-hover:text-yellow-600">
                        {provider.avgRating}
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <g id="SVGRepo_iconCarrier">
                            <path
                              d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
                              fill="#eab308"
                            />
                          </g>
                        </svg>
                      </span>
                    </div>

                    <span className="text-slate-400 font-semibold text-sm">
                      {provider.gender}
                    </span>
                    <div className="h-14">
                      <span className="line-clamp-3 py-2 h-14 leading-6 text-sm font-light">
                        {service.name}
                      </span>
                    </div>
                    <div className="grid-cols-2 flex group justify-between">
                      <div className="font-black flex flex-col items-start">
                        <span className="text-3xl font-bold gap-x-2 text-slate-300">
                          Rs.{item.price}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleBooking(provider, item)}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ProviderSelection;
