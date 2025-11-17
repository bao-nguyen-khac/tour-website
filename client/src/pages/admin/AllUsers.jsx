import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import {
  FaTrash,
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
} from "react-icons/fa";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/user/getAllUsers?searchTerm=${search}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();

      if (data && data?.success === false) {
        setLoading(false);
        setError(data?.message);
      } else {
        setLoading(false);
        setAllUsers(data);
        setError(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
    if (search) getUsers();
  }, [search]);

  const handleUserDelete = async (userId) => {
    const CONFIRM = confirm(
      "Are you sure ? the account will be permenantly deleted!"
    );
    if (CONFIRM) {
      setLoading(true);
      try {
        const res2 = await fetch(`${apiUrl}/api/user/delete-user/${userId}`, {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res2.json();
        if (data?.success === false) {
          setLoading(false);
          showErrorToast(data?.message || "Có lỗi xảy ra!");
          return;
        }
        setLoading(false);
        showSuccessToast(data?.message);
        getUsers();
      } catch (error) {
        showErrorToast();
      }
    }
  };

  const stats = useMemo(() => {
    const total = allUser?.length || 0;
    const admins = allUser?.filter((user) => user?.user_role === 1).length || 0;
    const members = total - admins;
    const verified = allUser?.filter((user) => user?.emailVerified).length || 0;

    return [
      { label: "Tổng người dùng", value: total },
      { label: "Quản trị viên", value: admins },
      { label: "Khách hàng", value: members },
      { label: "Email xác thực", value: verified },
    ];
  }, [allUser]);

  return (
    <div className="w-full p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-xl border border-white/40 p-5 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-500">Quản lý người dùng</p>
              <h1 className="text-3xl font-bold text-slate-900">Danh sách người dùng</h1>
            </div>
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm tên, email, số điện thoại..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((item) => (
              <div key={item.label} className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {loading && <div className="text-center text-slate-500 py-8">Đang tải người dùng...</div>}

            {!loading && allUser?.length === 0 && (
              <div className="text-center text-slate-500 py-10 border border-dashed rounded-2xl">
                Không tìm thấy người dùng nào.
              </div>
            )}

            {allUser?.map((user) => (
              <div
                key={user._id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FaUser className="text-2xl" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{user.username}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <FaShieldAlt className="text-blue-500" />
                      {user?.user_role === 1 ? "Admin" : "Khách hàng"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 text-sm">
                  <p className="flex items-center gap-2 text-slate-600">
                    <FaEnvelope className="text-slate-400" />
                    {user.email}
                  </p>
                  <p className="flex items-center gap-2 text-slate-600">
                    <FaPhone className="text-slate-400" />
                    {user.phone || "Chưa cập nhật"}
                  </p>
                  <p className="flex items-center gap-2 text-slate-600 sm:col-span-2">
                    <FaMapMarkerAlt className="text-slate-400" />
                    {user.address || "Chưa cập nhật"}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    disabled={loading}
                    onClick={() => handleUserDelete(user._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                  >
                    <FaTrash />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
