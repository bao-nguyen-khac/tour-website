import React, { useCallback, useEffect, useState } from "react";
import "./styles/Home.css";
import { FaCalendar, FaQuestion, FaSearch, FaStar, FaEye, FaGlobe, FaDollarSign, FaCamera, FaComments, FaHeart, FaMapMarkerAlt, FaShare, FaPhone, FaEnvelope } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import PackageCard from "./PackageCard";
import OfferCard from "./OfferCard";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

const Home = () => {
  const navigate = useNavigate();
  const [topPackages, setTopPackages] = useState([]);
  const [latestPackages, setLatestPackages] = useState([]);
  const [offerPackages, setOfferPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [quickSearch, setQuickSearch] = useState({
    searchTerm: "",
    option: "new", // new | offer | rating | popular
  });

  const destinations = [
    {
      name: "Hà Nội",
      img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1400&auto=format&fit=crop",
    },
    {
      name: "Đà Nẵng",
      img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1400&auto=format&fit=crop",
    },
    {
      name: "Nha Trang",
      img: "https://images.unsplash.com/photo-1526481280698-8fcc13fd9b7f?q=80&w=1400&auto=format&fit=crop",
    },
    {
      name: "Phú Quốc",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1400&auto=format&fit=crop",
    },
  ];
  // remove survey form and related state/handlers

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  const getTopPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/package/get-packages?sort=packageRating&limit=8`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data?.success) {
        setTopPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [apiUrl, token]);

  const getLatestPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/package/get-packages?sort=createdAt&limit=8`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data?.success) {
        setLatestPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [apiUrl, token]);

  const getOfferPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/package/get-packages?sort=createdAt&offer=true&limit=6`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data?.success) {
        setOfferPackages(data?.packages);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [apiUrl, token]);

  // remove survey form and related state/handlers

  useEffect(() => {
    getTopPackages();
    getLatestPackages();
    getOfferPackages();
  }, []);

  return (
    <div className="main w-full">
      <div className="w-full flex flex-col">
        {/* Hero Banner */}
        <div className="hero-banner relative w-full h-[600px] flex items-center justify-center">
          <div className="relative z-10 text-center text-white px-4">
            <p className="text-lg sm:text-xl mb-2 font-light">Tìm tour đặc biệt của bạn ngay hôm nay</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">Với The Travel</h1>
            <button
              onClick={() => navigate("/search")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white uppercase font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <FaEye className="text-sm" />
              Xem Tours
            </button>
          </div>
        </div>

        {/* Removed old search section */}

        {/* Why Choose Us & Search Tours Section */}
        <div className="w-full bg-slate-50 py-12 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Why Choose Us Section */}
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-bold text-slate-800 mb-8">TẠI SAO CHỌN CHÚNG TÔI?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1: Diverse Destinations */}
                <div className="flex flex-col items-start">
                  <div className="w-16 h-16 rounded-full bg-blue-200 border-2 border-dashed border-white flex items-center justify-center mb-4">
                    <FaGlobe className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Điểm Đến Đa Dạng</h3>
                  <p className="text-sm text-slate-600">
                    Khám phá hàng trăm điểm đến tuyệt vời trên khắp Việt Nam và thế giới với các tour được thiết kế đặc biệt cho bạn.
                  </p>
                </div>

                {/* Feature 2: Value for Money */}
                <div className="flex flex-col items-start">
                  <div className="w-16 h-16 rounded-full bg-blue-200 border-2 border-dashed border-white flex items-center justify-center mb-4">
                    <FaDollarSign className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Giá Trị Tốt Nhất</h3>
                  <p className="text-sm text-slate-600">
                    Chúng tôi cam kết mang đến cho bạn những tour du lịch chất lượng với mức giá hợp lý và nhiều ưu đãi hấp dẫn.
                  </p>
                </div>

                {/* Feature 3: Beautiful Places */}
                <div className="flex flex-col items-start">
                  <div className="w-16 h-16 rounded-full bg-blue-200 border-2 border-dashed border-white flex items-center justify-center mb-4">
                    <FaCamera className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Những Nơi Tuyệt Đẹp</h3>
                  <p className="text-sm text-slate-600">
                    Trải nghiệm những địa điểm đẹp nhất, từ bãi biển hoang sơ đến những ngọn núi hùng vĩ và các di tích lịch sử.
                  </p>
                </div>

                {/* Feature 4: Fast Booking */}
                <div className="flex flex-col items-start">
                  <div className="w-16 h-16 rounded-full bg-blue-200 border-2 border-dashed border-white flex items-center justify-center mb-4">
                    <FaCalendar className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Đặt Chỗ Nhanh Chóng</h3>
                  <p className="text-sm text-slate-600">
                    Hệ thống đặt chỗ đơn giản và nhanh chóng, chỉ vài cú click là bạn đã có thể đặt tour mơ ước của mình.
                  </p>
                </div>

                {/* Feature 5: Support Team */}
                <div className="flex flex-col items-start">
                  <div className="w-16 h-16 rounded-full bg-blue-200 border-2 border-dashed border-white flex items-center justify-center mb-4">
                    <FaComments className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Đội Ngũ Hỗ Trợ</h3>
                  <p className="text-sm text-slate-600">
                    Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng hỗ trợ bạn 24/7, đảm bảo chuyến đi của bạn diễn ra suôn sẻ.
                  </p>
                </div>

                {/* Feature 6: Passionate Travel */}
                <div className="flex flex-col items-start">
                  <div className="w-16 h-16 rounded-full bg-blue-200 border-2 border-dashed border-white flex items-center justify-center mb-4">
                    <FaHeart className="text-2xl text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Đam Mê Du Lịch</h3>
                  <p className="text-sm text-slate-600">
                    Chúng tôi đam mê tạo ra những trải nghiệm du lịch đáng nhớ, giúp bạn khám phá thế giới một cách tuyệt vời nhất.
                  </p>
                </div>
              </div>
            </div>

            {/* Search Tours Sidebar (redesigned) */}
            <div className="rounded-2xl p-[1px] bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-xl">
              <div className="rounded-2xl p-6 bg-white/90 backdrop-blur text-slate-800">
                <h2 className="text-2xl font-bold mb-1">Tìm Kiếm Tour</h2>
                <p className="text-sm mb-5 text-slate-500">Nhập từ khóa và chọn một tuỳ chọn nổi bật</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const params = new URLSearchParams();
                    if (quickSearch.searchTerm)
                      params.set("searchTerm", quickSearch.searchTerm);
                    if (quickSearch.option === "offer") {
                      params.set("offer", "true");
                    } else if (quickSearch.option === "rating") {
                      params.set("sort", "packageRating");
                      params.set("order", "desc");
                    } else if (quickSearch.option === "popular") {
                      params.set("sort", "packageTotalRatings");
                      params.set("order", "desc");
                    } else {
                      params.set("sort", "createdAt");
                      params.set("order", "desc");
                    }
                    navigate(`/search?${params.toString()}`);
                  }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={quickSearch.searchTerm}
                      onChange={(e) => setQuickSearch({ ...quickSearch, searchTerm: e.target.value })}
                      placeholder="Từ khóa (tên tour/điểm đến)"
                      className="w-full p-3 rounded-xl border border-slate-200 placeholder:text-slate-400 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                    <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "offer", label: "Ưu đãi tốt nhất" },
                      { id: "rating", label: "Đánh giá cao nhất" },
                      { id: "new", label: "Mới nhất" },
                      { id: "popular", label: "Nổi bật" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setQuickSearch({ ...quickSearch, option: opt.id })}
                        className={`text-sm px-3 py-2 rounded-lg border transition-all shadow-sm ${
                          quickSearch.option === opt.id
                            ? "bg-slate-800 text-white border-slate-800 scale-[1.02]"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:scale-[1.01]"
                        }`}
                        aria-pressed={quickSearch.option === opt.id}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <button
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white uppercase font-semibold py-3 rounded-xl transition-all mt-2 shadow-md hover:shadow-lg"
                  >
                    Tìm tour phù hợp
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* main page */}
        <div className="main p-6 flex flex-col gap-5">
          {loading && <h1 className="text-center text-2xl">Đang tải...</h1>}
          {!loading &&
            topPackages.length === 0 &&
            latestPackages.length === 0 &&
            offerPackages.length === 0 && (
              <h1 className="text-center text-2xl">Chưa có tour du lịch nào!</h1>
            )}
          {/* Top Rated */}
          {!loading && topPackages.length > 0 && (
            <div className="popular-section rounded-xl overflow-hidden">
              <div className="popular-inner py-10 px-4 text-center text-white">
                <h2 className="section-title text-3xl sm:text-4xl font-bold mb-8">Các Tour Phổ Biến</h2>
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                  {topPackages.slice(0, 6).map((packageData, i) => (
                    <PackageCard key={i} packageData={packageData} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Top Rated */}
          {/* latest - removed */}
          {/* Destination section - removed */}

          {/* offer - deals & discounts style */}
          {!loading && offerPackages.length > 0 && (
            <section className="w-full py-12 bg-gradient-to-b from-slate-50 to-white">
              <div className="max-w-6xl mx-auto px-3 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Ưu đãi và giảm giá</h2>
                <p className="text-slate-500 mb-6">Lựa chọn tour giá tốt với chất lượng đảm bảo</p>
                <div className="inline-flex mb-8">
                  <button
                    onClick={() => navigate('/search?offer=true')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm shadow"
                  >
                    Xem thêm
                  </button>
                </div>

                <div className="rounded-2xl p-[1px] bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200">
                  <div className="rounded-2xl bg-white p-5 md:p-6 shadow-sm">
                    <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 justify-items-stretch">
                      {offerPackages.slice(0, 4).map((p, i) => (
                        <OfferCard key={i} pkg={p} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Destination section (below offers) */}
          <section className="w-full py-10">
            <div className="text-center mb-8">
              <p className="text-slate-400 italic">Tìm tour theo</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 section-title inline-block">ĐỊA ĐIỂM</h2>
            </div>
            <div className="max-w-6xl mx-auto grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 px-3">
              {destinations.map((d) => (
                <button
                  key={d.name}
                  onClick={() => navigate(`/search?searchTerm=${encodeURIComponent(d.name)}`)}
                  className="relative h-56 rounded-xl overflow-hidden group text-left"
                >
                  <img src={d.img} alt={d.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <span className="absolute left-4 bottom-4 text-white text-2xl font-semibold drop-shadow">{d.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Latest Post & Tour Reviews (hardcoded) */}
          <section className="w-full py-12">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 px-3">
              {/* Latest Post */}
              <div>
                <div className="text-3xl font-bold text-slate-800 mb-2">LATEST POST</div>
                <div className="w-16 h-1 bg-blue-400 mb-6" />
                <div className="rounded-xl overflow-hidden shadow">
                  <img
                    src="https://images.unsplash.com/photo-1499946982491-6f23f69e08e4?q=80&w=1600&auto=format&fit=crop"
                    alt="Latest post"
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-slate-800 mb-3">Before You Go</h3>
                    <p className="text-slate-600 mb-5">
                      Một vài điều cần chuẩn bị trước chuyến đi: đồ dùng cá nhân, giấy tờ, kế hoạch thời gian
                      và danh sách các điểm đến yêu thích để chuyến đi trọn vẹn hơn.
                    </p>
                    <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm">
                      READ MORE
                    </button>
                  </div>
                </div>
              </div>

              {/* Tour Reviews */}
              <div>
                <div className="text-3xl font-bold text-slate-800 mb-2">TOUR REVIEWS</div>
                <div className="w-16 h-1 bg-blue-400 mb-6" />

                {/* Review 1 */}
                <div className="flex gap-4 mb-8">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                    alt="Jessica"
                    className="w-16 h-16 rounded-full object-cover shadow"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800">Canadian Rockies</h4>
                    <p className="text-slate-600 mt-1">
                      Những điểm tham quan và hoạt động còn tuyệt hơn mong đợi. Lịch trình hợp lý, không mệt mỏi
                      và chúng tôi sẽ quay lại lần nữa!
                    </p>
                    <div className="mt-2 text-yellow-400 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="flex gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
                    alt="John"
                    className="w-16 h-16 rounded-full object-cover shadow"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800">Lake Tahoe Adventure</h4>
                    <p className="text-slate-600 mt-1">
                      Hướng dẫn viên nhiệt tình, thân thiện và rất chu đáo. Chuyến đi tuyệt vời, chắc chắn sẽ
                      giới thiệu cho bạn bè và quay lại lần sau.
                    </p>
                    <div className="mt-2 text-yellow-400 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={`r2-${i}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center">
          <div className="bg-sky-900/60">
            <div className="max-w-6xl mx-auto py-12 px-3 text-center text-white">
              <h3 className="text-3xl font-bold mb-2">JOIN THE NEWSLETTER</h3>
              <p className="italic mb-6">To receive our best monthly deals</p>
              <div className="flex gap-3 max-w-3xl mx-auto">
                <input className="flex-1 p-3 rounded-lg text-slate-800" placeholder="Your email address" />
                <button className="bg-green-500 hover:bg-green-600 text-white px-5 rounded-lg">SUBSCRIBE</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* offer */}
    </div>
  );
};

export default Home;
