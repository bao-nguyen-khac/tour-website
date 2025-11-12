import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PackageCard from "./PackageCard";
import Cookies from "js-cookie";
import {
  FaSearch,
  FaTag,
  FaSortAmountDown,
  FaSpinner,
  FaMapMarkerAlt,
  FaFilter,
} from "react-icons/fa";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sideBarSearchData, setSideBarSearchData] = useState({
    searchTerm: "",
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (searchTermFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      // Map sort field from URL to internal format
      const sortMap = {
        createdAt: "created_at",
        created_at: "created_at",
        packagePrice: "packagePrice",
        packageRating: "packageRating",
        packageTotalRatings: "packageTotalRatings",
      };
      const sort = sortMap[sortFromUrl] || sortFromUrl || "created_at";

      setSideBarSearchData({
        searchTerm: searchTermFromUrl || "",
        offer: offerFromUrl === "true" ? true : false,
        sort: sort,
        order: orderFromUrl || "desc",
      });
    }

    const fetchAllPackages = async () => {
      setLoading(true);
      setShowMoreBtn(false);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`${apiUrl}/api/package/get-packages?${searchQuery}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        setLoading(false);
        setAllPackages(data?.packages);
        if (data?.packages?.length > 8) {
          setShowMoreBtn(true);
        } else {
          setShowMoreBtn(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPackages();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSideBarSearchData({
        ...sideBarSearchData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "offer") {
      setSideBarSearchData({
        ...sideBarSearchData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const value = e.target.value.split("_");
      const sortField = value[0] || "createdAt";
      const order = value[1] || "desc";

      // Map back to internal sort field names
      const sortMap = {
        createdAt: "created_at",
        packagePrice: "packagePrice",
        packageRating: "packageRating",
        packageTotalRatings: "packageTotalRatings",
      };
      const sort = sortMap[sortField] || sortField;

      setSideBarSearchData({ ...sideBarSearchData, sort, order });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarSearchData.searchTerm);
    urlParams.set("offer", sideBarSearchData.offer);
    urlParams.set("sort", sideBarSearchData.sort);
    urlParams.set("order", sideBarSearchData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreSClick = async () => {
    const numberOfPackages = allPackages.length;
    const startIndex = numberOfPackages;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`${apiUrl}/api/package/get-packages?${searchQuery}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json();
    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }
    setAllPackages([...allPackages, ...data?.packages]);
  };

  // Fix sort field name mapping
  const getSortValue = () => {
    const sortMap = {
      created_at: "createdAt",
      packagePrice: "packagePrice",
      packageRating: "packageRating",
      packageTotalRatings: "packageTotalRatings",
    };
    const sortField = sortMap[sideBarSearchData.sort] || sideBarSearchData.sort;
    return `${sortField}_${sideBarSearchData.order}`;
  };

  const currentSortValue = getSortValue();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6">
        {/* Sidebar Filter */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <FaFilter className="text-blue-600 text-xl" />
              <h2 className="text-2xl font-bold text-slate-800">Bộ lọc</h2>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Search Input */}
              <div>
                <label
                  htmlFor="searchTerm"
                  className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
                >
                  <FaSearch className="text-blue-600" />
                  Tìm kiếm
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="searchTerm"
                    placeholder="Nhập tên tour, địa điểm..."
                    className="w-full px-4 py-3 pl-11 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={sideBarSearchData.searchTerm}
                    onChange={handleChange}
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Offer Checkbox */}
              <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="offer"
                    className="w-5 h-5 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                    checked={sideBarSearchData.offer}
                    onChange={handleChange}
                  />
                  <div className="flex items-center gap-2">
                    <FaTag className="text-orange-600" />
                    <span className="font-semibold text-slate-700">Chỉ hiển thị tour ưu đãi</span>
                  </div>
                </label>
              </div>

              {/* Sort Select */}
              <div>
                <label
                  htmlFor="sort_order"
                  className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
                >
                  <FaSortAmountDown className="text-blue-600" />
                  Sắp xếp theo
                </label>
                <select
                  onChange={handleChange}
                  value={currentSortValue}
                  id="sort_order"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  <option value="createdAt_desc">Mới nhất</option>
                  <option value="createdAt_asc">Cũ nhất</option>
                  <option value="packagePrice_desc">Giá: Cao → Thấp</option>
                  <option value="packagePrice_asc">Giá: Thấp → Cao</option>
                  <option value="packageRating_desc">Đánh giá cao nhất</option>
                  <option value="packageTotalRatings_desc">Được đánh giá nhiều nhất</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg flex items-center justify-center gap-2"
              >
                <FaSearch />
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-600" />
                  Kết quả tìm kiếm
                </h1>
                {!loading && (
                  <p className="text-slate-600">
                    Tìm thấy <span className="font-semibold text-blue-600">{allPackages.length}</span> tour
                    {sideBarSearchData.searchTerm && (
                      <span> cho "{sideBarSearchData.searchTerm}"</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
              <FaSpinner className="text-5xl text-blue-600 animate-spin mb-4" />
              <p className="text-xl text-slate-700 font-semibold">Đang tải...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && allPackages.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <FaSearch className="text-6xl text-slate-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  Không tìm thấy tour nào
                </h3>
                <p className="text-slate-600 mb-6">
                  Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn
                </p>
                <button
                  onClick={() => {
                    setSideBarSearchData({
                      searchTerm: "",
                      offer: false,
                      sort: "created_at",
                      order: "desc",
                    });
                    navigate("/search");
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {!loading && allPackages.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {allPackages.map((packageData, i) => (
                  <PackageCard key={i} packageData={packageData} />
                ))}
              </div>

              {/* Load More Button */}
              {showMoreBtn && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={onShowMoreSClick}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      "Xem thêm tour"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
