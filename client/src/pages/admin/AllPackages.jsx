import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { formatCurrency } from "../../utils/formatCurrency";
import { FaSearch, FaMapMarkerAlt, FaDollarSign, FaChevronDown } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;
const token = Cookies.get("access_token");

const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const getPackages = async () => {
    setPackages([]);
    try {
      setLoading(true);
      let url =
        filter === "offer" //offer
          ? `${apiUrl}/api/package/get-packages?searchTerm=${search}&offer=true`
          : filter === "latest" //latest
          ? `${apiUrl}/api/package/get-packages?searchTerm=${search}&sort=createdAt`
          : filter === "top" //top rated
          ? `${apiUrl}/api/package/get-packages?searchTerm=${search}&sort=packageRating`
          : `${apiUrl}/api/package/get-packages?searchTerm=${search}`; //all
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        showErrorToast(data?.message);
      }
      if (data?.packages?.length > 8) {
        setShowMoreBtn(true);
      } else {
        setShowMoreBtn(false);
      }
    } catch (error) {
      console.log(error);
      showErrorToast();
    }
  };

  const onShowMoreSClick = async () => {
    const numberOfPackages = packages.length;
    const startIndex = numberOfPackages;
    let url =
      filter === "offer" //offer
        ? `${apiUrl}/api/package/get-packages?searchTerm=${search}&offer=true&startIndex=${startIndex}`
        : filter === "latest" //latest
        ? `${apiUrl}/api/package/get-packages?searchTerm=${search}&sort=createdAt&startIndex=${startIndex}`
        : filter === "top" //top rated
        ? `${apiUrl}/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`
        : `${apiUrl}/api/package/get-packages?searchTerm=${search}&startIndex=${startIndex}`; //all
    const res = await fetch(url);
    const data = await res.json();
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setPackages([...packages, ...data?.packages]);
  };

  useEffect(() => {
    getPackages();
  }, [filter, search]);

  const handleDelete = async (packageId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/package/delete-package/${packageId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data?.success) {
        showErrorToast(data?.message);
        setLoading(false);
        return;
      }
      showSuccessToast(data?.message);
      getPackages();
      setLoading(false);
    } catch (error) {
      console.log(error);
      showErrorToast();
      setLoading(false);
    }
  };

  const filterOptions = [
    { id: "all", label: "All" },
    { id: "offer", label: "Offer" },
    { id: "latest", label: "Latest" },
    { id: "top", label: "Top" },
  ];

  return (
    <div className="w-full p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-xl border border-white/40 p-4 md:p-6 space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 pl-11 pr-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm kiếm tour theo tên hoặc điểm đến..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  id={option.id}
                  onClick={(e) => setFilter(e.target.id)}
                  className={`px-5 py-2 rounded-2xl border transition-all ${
                    filter === option.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                      : "border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loading && (
              <div className="text-center py-8 text-slate-500">Đang tải dữ liệu...</div>
            )}

            {!loading && packages?.length === 0 && (
              <div className="text-center py-10 text-slate-500 border border-dashed rounded-2xl">
                Không tìm thấy tour nào phù hợp.
              </div>
            )}

            {packages?.map((pack) => (
              <div
                key={pack._id}
                className="flex flex-col gap-4 md:flex-row md:items-center p-4 rounded-2xl border border-slate-200 bg-white/80 shadow-sm hover:shadow-lg hover:border-blue-200 transition"
              >
                <Link to={`/package/${pack._id}`} className="flex-shrink-0">
                  <img
                    src={pack?.packageImages[0]}
                    alt={pack?.packageName}
                    className="w-full md:w-28 h-28 object-cover rounded-xl"
                  />
                </Link>
                <div className="flex-1 space-y-2">
                  <Link to={`/package/${pack._id}`}>
                    <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition">
                      {pack?.packageName}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" />
                    {pack?.packageDestination}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <FaDollarSign className="text-green-500" />
                    {pack?.packageOffer && pack?.packageDiscountPrice
                      ? `${formatCurrency(pack?.packageDiscountPrice)} · `
                      : ""}
                    <span className={pack?.packageOffer ? "line-through text-slate-400" : ""}>
                      {formatCurrency(pack?.packagePrice)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Link
                    to={`/profile/admin/update-package/${pack._id}`}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                  >
                    <span>Chỉnh sửa</span>
                  </Link>
                  <button
                    disabled={loading}
                    onClick={() => handleDelete(pack?._id)}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showMoreBtn && (
            <div className="flex justify-center">
              <button
                onClick={onShowMoreSClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl"
              >
                Xem thêm
                <FaChevronDown className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPackages;
