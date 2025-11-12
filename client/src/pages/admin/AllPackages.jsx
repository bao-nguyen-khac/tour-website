import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

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

  return (
    <>
      <div className="shadow-xl rounded-lg w-full flex flex-col p-5 justify-center gap-2">
        {loading && <h1 className="text-center text-lg">Loading...</h1>}
        {packages && (
          <>
            <div>
              <input
                className="p-2 rounded border"
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            <div className="my-2 border-y-2 py-2">
              <ul className="w-full flex justify-around">
                <li
                  className={`cursor-pointer hover:scale-95 border rounded-xl p-2 transition-all duration-300 ${
                    filter === "all" && "bg-blue-500 text-white"
                  }`}
                  id="all"
                  onClick={(e) => {
                    setFilter(e.target.id);
                  }}
                >
                  All
                </li>
                <li
                  className={`cursor-pointer hover:scale-95 border rounded-xl p-2 transition-all duration-300 ${
                    filter === "offer" && "bg-blue-500 text-white"
                  }`}
                  id="offer"
                  onClick={(e) => {
                    setFilter(e.target.id);
                  }}
                >
                  Offer
                </li>
                <li
                  className={`cursor-pointer hover:scale-95 border rounded-xl p-2 transition-all duration-300 ${
                    filter === "latest" && "bg-blue-500 text-white"
                  }`}
                  id="latest"
                  onClick={(e) => {
                    setFilter(e.target.id);
                  }}
                >
                  Latest
                </li>
                <li
                  className={`cursor-pointer hover:scale-95 border rounded-xl p-2 transition-all duration-300 ${
                    filter === "top" && "bg-blue-500 text-white"
                  }`}
                  id="top"
                  onClick={(e) => {
                    setFilter(e.target.id);
                  }}
                >
                  Top
                </li>
              </ul>
            </div>
          </>
        )}
        {/* packages */}
        {packages ? (
          packages.map((pack, i) => {
            return (
              <div
                className="border rounded-lg w-full flex p-3 justify-between items-center hover:scale-[1.02] transition-all duration-300"
                key={i}
              >
                <Link to={`/package/${pack._id}`}>
                  <img
                    src={pack?.packageImages[0]}
                    alt="image"
                    className="w-20 h-20 rounded"
                  />
                </Link>
                <Link to={`/package/${pack._id}`}>
                  <p className="font-semibold hover:underline">
                    {pack?.packageName}
                  </p>
                </Link>
                <div className="flex flex-col">
                  <Link to={`/profile/admin/update-package/${pack._id}`}>
                    <button
                      disabled={loading}
                      className="text-blue-600 hover:underline"
                    >
                      {loading ? "Loading..." : "Chỉnh sửa"}
                    </button>
                  </Link>
                  <button
                    disabled={loading}
                    onClick={() => handleDelete(pack?._id)}
                    className="text-red-600 hover:underline"
                  >
                    {loading ? "Loading..." : "Xoá"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <h1 className="text-center text-2xl">Chưa có tour nào!</h1>
        )}
        {showMoreBtn && (
          <button
            onClick={onShowMoreSClick}
            className="text-sm bg-green-700 text-white hover:underline p-2 m-3 rounded text-center w-max"
          >
            Xem thêm
          </button>
        )}
      </div>
    </>
  );
};

export default AllPackages;
