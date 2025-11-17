import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  FaSearch,
  FaMoneyBillWave,
  FaReceipt,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";

const Payments = () => {
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
        `${apiUrl}/api/booking/get-allBookings?searchTerm=${search}`,
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [search]);

  const paymentStats = useMemo(() => {
    const totalPayments = allBookings?.length || 0;
    const totalRevenue = allBookings?.reduce((sum, item) => sum + (item?.totalPrice || 0), 0) || 0;
    const avgTicket = totalPayments ? totalRevenue / totalPayments : 0;

    return [
      { label: "Tổng giao dịch", value: totalPayments, icon: <FaReceipt className="text-indigo-500" /> },
      { label: "Doanh thu", value: formatCurrency(totalRevenue), icon: <FaMoneyBillWave className="text-green-500" /> },
      { label: "Số tiền trung bình", value: formatCurrency(avgTicket || 0), icon: <FaMoneyBillWave className="text-amber-500" /> },
    ];
  }, [allBookings]);

  return (
    <div className="w-full p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-xl border border-white/40 p-5 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-500">Quản lý thanh toán</p>
              <h1 className="text-3xl font-bold text-slate-900">Lịch sử thanh toán</h1>
            </div>
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo khách hàng hoặc email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentStats.map((item) => (
              <div key={item.label} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow">{item.icon}</div>
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="text-xl font-semibold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {loading && <div className="text-center text-slate-500 py-8">Đang tải giao dịch...</div>}

            {!loading && allBookings?.length === 0 && (
              <div className="text-center text-slate-500 py-10 border border-dashed rounded-2xl">
                Không có giao dịch nào.
              </div>
            )}

            {!loading &&
              allBookings?.map((booking) => (
                <div
                  key={booking?._id}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <Link to={`/package/${booking?.packageDetails?._id}`} className="flex items-center gap-3 flex-1">
                    <img
                      src={booking?.packageDetails?.packageImages[0]}
                      alt={booking?.packageDetails?.packageName}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{booking?.packageDetails?.packageName}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        {booking?.date}
                      </p>
                    </div>
                  </Link>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm flex-1">
                    <p className="flex items-center gap-2 text-slate-600">
                      <FaUser className="text-slate-400" />
                      {booking?.buyer?.username}
                    </p>
                    <p className="flex items-center gap-2 text-slate-600">
                      <FaEnvelope className="text-slate-400" />
                      {booking?.buyer?.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Tổng thanh toán</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(booking?.totalPrice)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
