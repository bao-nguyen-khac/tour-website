import React, { useCallback, useEffect, useState, useRef } from "react";
import "./styles/Home.css";
import { FaCalendar, FaQuestion, FaSearch, FaStar, FaEye, FaGlobe, FaDollarSign, FaCamera, FaComments, FaHeart, FaMapMarkerAlt, FaShare, FaPhone, FaEnvelope } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import PackageCard from "./PackageCard";
import OfferCard from "./OfferCard";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { showErrorToast, showSuccessToast } from "../utils/toast";

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
  const [showSurvey, setShowSurvey] = useState(false);
  const [survey, setSurvey] = useState({
    destination: "",
    stayDurationDays: 1,
    transportation: "",
    numPersons: 1,
    travelType: "",
  });
  const surveyShownRef = useRef(false);

  const destinations = [
    {
      name: "Hà Nội",
      img: "https://images.pexels.com/photos/34621330/pexels-photo-34621330.jpeg",
    },
    {
      name: "Đà Nẵng",
      img: "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20%C4%91%C3%A0%20n%E1%BA%B5ng/anh-dep-da-nang-thumb.jpg",
    },
    {
      name: "Nha Trang",
      img: "https://vcdn1-vnexpress.vnecdn.net/2021/03/22/NhaTrang-KhoaTran-27-1616120145.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=9BMNnjV_o665_kwWTgfOSQ",
    },
    {
      name: "Huế",
      img: "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20Hu%E1%BA%BF/anh-dep-hue-1.jpg",
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
        showErrorToast(data?.message);
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
        showErrorToast(data?.message);
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
        showErrorToast(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [apiUrl, token]);

  // remove survey form and related state/handlers

  const handleSurveyChange = (e) => {
    const { id, value } = e.target;
    setSurvey({ ...survey, [id]: value });
  };

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/survey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(survey),
      });
      const data = await res.json();
      if (data?.success) {
        // Lưu vào localStorage để không hiện lại
        localStorage.setItem("surveySubmitted", "true");
        showSuccessToast(data?.message || "Cảm ơn bạn đã tham gia khảo sát!");
        setSurvey({ destination: "", stayDurationDays: 1, transportation: "", numPersons: 1, travelType: "" });
        setShowSurvey(false);
      } else {
        showErrorToast(data?.message);
      }
    } catch (error) {
      console.log(error);
      showErrorToast();
    }
  };

  useEffect(() => {
    getTopPackages();
    getLatestPackages();
    getOfferPackages();
  }, []);

  // Scroll detection để hiển thị survey
  useEffect(() => {
    // Check xem user đã submit chưa
    const surveySubmitted = localStorage.getItem("surveySubmitted");
    if (surveySubmitted === "true" || surveyShownRef.current) {
      return; // Không hiển thị nếu đã submit hoặc đã hiển thị
    }

    const handleScroll = () => {
      if (surveyShownRef.current || showSurvey) return; // Đã hiển thị rồi thì không hiển thị lại

      // Tính toán khi scroll đến gần cuối trang (85% chiều cao)
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Hiển thị khi scroll đến 85% trang
      if (scrollPercentage >= 0.85) {
        surveyShownRef.current = true;
        setShowSurvey(true);
        // Remove listener sau khi đã hiển thị
        window.removeEventListener("scroll", handleScroll);
      }
    };

    // Thêm delay nhỏ để đảm bảo DOM đã render
    const timeoutId = setTimeout(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showSurvey]);

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
                <div className="text-3xl font-bold text-slate-800 mb-2">Bài viết mới nhất</div>
                <div className="w-16 h-1 bg-blue-400 mb-6" />
                <div className="rounded-xl overflow-hidden shadow">
                  <img
                    src="https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/7/10/hinh-anh-cac-loai-hinh-du-lich-3-1657423025597-1657423027180128362217.jpeg"
                    alt="Latest post"
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-slate-800 mb-3">Trước khi đi</h3>
                    <p className="text-slate-600 mb-5">
                      Một vài điều cần chuẩn bị trước chuyến đi: đồ dùng cá nhân, giấy tờ, kế hoạch thời gian
                      và danh sách các điểm đến yêu thích để chuyến đi trọn vẹn hơn.
                    </p>
                    <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm">
                      ĐỌC THÊM
                    </button>
                  </div>
                </div>
              </div>

              {/* Tour Reviews */}
              <div>
                <div className="text-3xl font-bold text-slate-800 mb-2">ĐÁNH GIÁ TOUR</div>
                <div className="w-16 h-1 bg-blue-400 mb-6" />

                {/* Review 1 */}
                <div className="flex gap-4 mb-8">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                    alt="Jessica"
                    className="w-16 h-16 rounded-full object-cover shadow"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-slate-800">Anna</h4>
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
                    <h4 className="text-xl font-semibold text-slate-800">Brian</h4>
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
                <h3 className="text-3xl font-bold mb-2">THAM GIA NHÓM</h3>
              <p className="italic mb-6">Nhận các ưu đãi tốt nhất hàng tháng</p>
              <div className="flex gap-3 max-w-3xl mx-auto">
                <input className="flex-1 p-3 rounded-lg text-slate-800" placeholder="Địa chỉ email của bạn" />
                <button className="bg-green-500 hover:bg-green-600 text-white px-5 rounded-lg">ĐĂNG KÝ</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Modal - Hiển thị khi scroll đến cuối trang */}
      {showSurvey && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FaQuestion className="text-xl" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold">Khảo sát du lịch</h2>
              </div>
              <button
                onClick={() => setShowSurvey(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition text-xl leading-none"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="p-6 md:p-8">
              <p className="text-slate-600 mb-6 text-center">
                Chúng tôi muốn biết sở thích du lịch của bạn để cải thiện dịch vụ tốt hơn
              </p>
              <form onSubmit={handleSurveySubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="destination" className="block text-sm font-semibold text-slate-700 mb-2">
                      Địa điểm mong muốn
                    </label>
                    <select
                      id="destination"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={survey.destination}
                      onChange={handleSurveyChange}
                      required
                    >
                      <option value="">Chọn địa điểm</option>
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

                  <div>
                    <label htmlFor="stayDurationDays" className="block text-sm font-semibold text-slate-700 mb-2">
                      Thời gian ở lại (ngày)
                    </label>
                    <input
                      id="stayDurationDays"
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={survey.stayDurationDays}
                      onChange={handleSurveyChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="transportation" className="block text-sm font-semibold text-slate-700 mb-2">
                      Phương tiện di chuyển
                    </label>
                    <select
                      id="transportation"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={survey.transportation}
                      onChange={handleSurveyChange}
                      required
                    >
                      <option value="">Chọn phương tiện</option>
                      <option value="Ô tô">Ô tô</option>
                      <option value="Máy bay">Máy bay</option>
                      <option value="Tàu">Tàu</option>
                      <option value="Thuyền">Thuyền</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="numPersons" className="block text-sm font-semibold text-slate-700 mb-2">
                      Số lượng người
                    </label>
                    <input
                      id="numPersons"
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={survey.numPersons}
                      onChange={handleSurveyChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="travelType" className="block text-sm font-semibold text-slate-700 mb-2">
                    Thể loại du lịch
                  </label>
                  <select
                    id="travelType"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={survey.travelType}
                    onChange={handleSurveyChange}
                    required
                  >
                    <option value="">Chọn thể loại</option>
                    <option value="Biển">Biển</option>
                    <option value="Núi">Núi</option>
                    <option value="Nghỉ dưỡng">Nghỉ dưỡng</option>
                    <option value="Khám phá">Khám phá</option>
                    <option value="Văn hóa">Văn hóa</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSurvey(false)}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition font-semibold"
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-lg"
                  >
                    Gửi khảo sát
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
