import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PackageCard from "./PackageCard";
import Cookies from "js-cookie";

const Search = () => {
  const navigate = useNavigate();
  const [sideBarSearchData, setSideBarSearchData] = useState({
    searchTerm: "",
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  //   console.log(listings);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (searchTermFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSideBarSearchData({
        searchTerm: searchTermFromUrl || "",
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
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
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

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

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Tìm kiếm:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Tìm kiếm"
              className="border rounded-lg p-3 w-full"
              value={sideBarSearchData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Loại:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sideBarSearchData.offer}
                onChange={handleChange}
              />
              <span>Ưu đãi</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sắp xếp:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="p-3 border rounded-lg"
            >
              <option value="packagePrice_desc">Giá cao đến thấp</option>
              <option value="packagePrice_asc">Giá thấp đến cao</option>
              <option value="packageRating_desc">Đánh giá cao nhất</option>
              <option value="packageTotalRatings_desc">Được đánh giá nhiều nhất</option>
              <option value="createdAt_desc">Mới nhất</option>
              <option value="createdAt_asc">Cũ nhất</option>
            </select>
          </div>
          <button className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95">
            Tìm kiếm
          </button>
        </form>
      </div>
      {/* ------------------------------------------------------------------------------- */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold border-b p-3 text-slate-700 mt-5">
          Kết quả tour du lịch:
        </h1>
        <div className="w-full p-5 grid 2xl:grid-cols-4 xlplus:grid-cols-3 lg:grid-cols-2 gap-2">
          {!loading && allPackages.length === 0 && (
            <p className="text-xl text-slate-700">Không tìm thấy tour du lịch nào!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Đang tải...
            </p>
          )}
          {!loading &&
            allPackages &&
            allPackages.map((packageData, i) => (
              <PackageCard key={i} packageData={packageData} />
            ))}
        </div>
        {showMoreBtn && (
          <button
            onClick={onShowMoreSClick}
            className="text-sm bg-green-700 text-white hover:underline p-2 m-3 rounded text-center w-max"
          >
            Xem thêm
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
