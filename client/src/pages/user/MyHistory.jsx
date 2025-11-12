import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const MyHistory = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${apiUrl}/api/booking/get-allUserBookings/${currentUser?._id}?searchTerm=${search}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const data = await res.json();
      if (data?.success) {
        setAllBookings(data?.bookings);
        setLoading(false);
        setError(false);
      } else {
        setLoading(false);
        setError(data?.message);
        showErrorToast(data?.message);
      }
    } catch (error) {
      console.log(error);
      showErrorToast();
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [search]);

  const handleHistoryDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${apiUrl}/api/booking/delete-booking-history/${id}/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        showSuccessToast(data?.message);
        getAllBookings();
      } else {
        setLoading(false);
        showErrorToast(data?.message);
      }
    } catch (error) {
      console.log(error);
      showErrorToast();
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] shadow-xl rounded-lg p-3 flex flex-col gap-2">
        <h1 className="text-center text-2xl">Lịch sử</h1>
        {loading && <h1 className="text-center text-2xl">Đang tải...</h1>}
        {error && <h1 className="text-center text-2xl">{error}</h1>}
        <div className="w-full border-b-4">
          <input
            className="border rounded-lg p-2 mb-2"
            type="text"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        {!loading &&
          allBookings &&
          allBookings.map((booking, i) => {
            return (
              <div
                className="w-full border-y-2 p-3 flex flex-wrap overflow-auto gap-3 items-center justify-between"
                key={i}
              >
                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <img
                    className="w-12 h-12"
                    src={booking?.packageDetails?.packageImages[0]}
                    alt="Hình ảnh tour du lịch"
                  />
                </Link>
                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <p className="hover:underline">
                    {booking?.packageDetails?.packageName}
                  </p>
                </Link>
                <p>{booking?.buyer?.username}</p>
                <p>{booking?.buyer?.email}</p>
                <p>{booking?.date}</p>
                {(new Date(booking?.date).getTime() < new Date().getTime() ||
                  booking?.status === "Cancelled") && (
                  <button
                    onClick={() => {
                      handleHistoryDelete(booking._id);
                    }}
                    className="p-2 rounded bg-red-600 text-white hover:opacity-95"
                  >
                    Xóa
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyHistory;
