import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import PackageCard from "./PackageCard";

const Recommendations = () => {
  const [filters, setFilters] = useState({
    destination: "",
    days: "",
    budgetMin: "",
    budgetMax: "",
    category: "",
    sort: "packageRating",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFilters((prev) => ({ ...prev, [id]: value }));
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const body = {};
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== "" && val !== null && val !== undefined) {
          body[key] = val;
        }
      });
      const res = await fetch(`${apiUrl}/api/package/recommend-packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setPackages(data?.packages || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecommendations();
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen w-full md:w-96">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Địa điểm:</label>
            <select id="destination" value={filters.destination} onChange={handleChange} className="p-3 border rounded-lg w-full">
              <option value="">Tất cả</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP Hồ Chí Minh">TP Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Nha Trang">Nha Trang</option>
              <option value="Đà Lạt">Đà Lạt</option>
              <option value="Huế">Huế</option>
              <option value="Hội An">Hội An</option>
              <option value="Phú Quốc">Phú Quốc</option>
              <option value="Vũng Tàu">Vũng Tàu</option>
              <option value="Sa Pa">Sa Pa</option>
              <option value="Hạ Long">Hạ Long</option>
              <option value="Quy Nhơn">Quy Nhơn</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Số ngày ở:</label>
            <input id="days" type="number" min="1" className="border rounded-lg p-3 w-full" value={filters.days} onChange={handleChange} />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Ngân sách:</label>
            <input id="budgetMin" type="number" min="0" className="border rounded-lg p-3 w-full" placeholder="Tối thiểu" value={filters.budgetMin} onChange={handleChange} />
            <span>-</span>
            <input id="budgetMax" type="number" min="0" className="border rounded-lg p-3 w-full" placeholder="Tối đa" value={filters.budgetMax} onChange={handleChange} />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Thể loại:</label>
            <select id="category" value={filters.category} onChange={handleChange} className="p-3 border rounded-lg w-full">
              <option value="">Tất cả</option>
              <option value="Biển">Biển</option>
              <option value="Núi">Núi</option>
              <option value="Nghỉ dưỡng">Nghỉ dưỡng</option>
              <option value="Khám phá">Khám phá</option>
              <option value="Văn hóa">Văn hóa</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sắp xếp:</label>
            <select id="sort" value={filters.sort} onChange={handleChange} className="p-3 border rounded-lg w-full">
              <option value="packageRating">Đánh giá</option>
              <option value="packagePrice">Giá</option>
              <option value="createdAt">Mới nhất</option>
            </select>
            <select id="order" value={filters.order} onChange={handleChange} className="p-3 border rounded-lg w-full">
              <option value="desc">Giảm dần</option>
              <option value="asc">Tăng dần</option>
            </select>
          </div>
          <button className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95">Tìm tour phù hợp</button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-xl font-semibold border-b p-3 text-slate-700 mt-5">Đề xuất tour phù hợp</h1>
        <div className="w-full p-5 grid 2xl:grid-cols-4 xlplus:grid-cols-3 lg:grid-cols-2 gap-2">
          {loading && <p className="text-xl text-slate-700 text-center w-full">Đang tải...</p>}
          {!loading && packages.length === 0 && (
            <p className="text-xl text-slate-700">Không tìm thấy tour phù hợp!</p>
          )}
          {!loading && packages.map((p, i) => <PackageCard key={i} packageData={p} />)}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;


