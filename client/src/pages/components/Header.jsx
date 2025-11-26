import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import defaultProfileImg from "../../assets/images/profile.png";
import Cookies from "js-cookie";
import { FaPhone, FaClock, FaFacebook, FaTwitter, FaPinterest, FaInstagram, FaShoppingCart, FaSearch as FaSearchIcon, FaCompass, FaTumblr, FaQuestion } from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [showSurvey, setShowSurvey] = useState(false);
  const [survey, setSurvey] = useState({
    destination: "",
    stayDurationDays: 1,
    transportation: "",
    numPersons: 1,
    travelType: "",
  });
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  const openSurvey = () => {
    // if (!currentUser) {
    //   navigate("/login");
    //   return;
    // }
    setShowSurvey(true);
  };

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
        showSuccessToast(data?.message);
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

  return (
    <>
      {/* Top Bar - Contact & Social */}
      <div className="bg-slate-700 text-white py-2 px-4 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaPhone className="text-xs" />
            <span>+84 123 456 7890</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-xs" />
            <span>6am - 11pm</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FaFacebook className="cursor-pointer hover:text-blue-400" />
          <FaTwitter className="cursor-pointer hover:text-blue-400" />
          <FaPinterest className="cursor-pointer hover:text-red-500" />
          <FaInstagram className="cursor-pointer hover:text-pink-500" />
          <FaTumblr className="cursor-pointer hover:text-blue-600" />
          <FaShoppingCart className="cursor-pointer hover:text-yellow-400" />
          <FaSearchIcon className="cursor-pointer hover:text-gray-300" />
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-slate-600 text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <FaCompass className="text-2xl" />
          <span className="text-xl font-semibold italic">The Travel</span>
        </Link>

        <div className="flex items-center gap-6 uppercase text-sm font-medium">
          <Link 
            to="/" 
            className={`relative transition-all duration-300 pb-1 ${
              location.pathname === "/" 
                ? "text-blue-300 border-b-2 border-blue-400" 
                : "hover:text-blue-300 hover:border-b-2 hover:border-blue-400"
            }`}
          >
            Trang chủ
          </Link>
          <Link 
            to="/search" 
            className={`relative transition-all duration-300 pb-1 ${
              location.pathname === "/search" 
                ? "text-blue-300 border-b-2 border-blue-400" 
                : "hover:text-blue-300 hover:border-b-2 hover:border-blue-400"
            }`}
          >
            Tours
          </Link>
          <Link
            to="/blog"
            className={`relative transition-all duration-300 pb-1 ${
              location.pathname === "/blog"
                ? "text-blue-300 border-b-2 border-blue-400"
                : "hover:text-blue-300 hover:border-b-2 hover:border-blue-400"
            }`}
          >
            Blog dữ liệu
          </Link>
          <Link 
            to="/about" 
            className={`relative transition-all duration-300 pb-1 ${
              location.pathname === "/about" 
                ? "text-blue-300 border-b-2 border-blue-400" 
                : "hover:text-blue-300 hover:border-b-2 hover:border-blue-400"
            }`}
          >
            Giới thiệu
          </Link>
          <button
            onClick={openSurvey}
            className="relative transition-all duration-300 pb-1 hover:text-blue-300 hover:border-b-2 hover:border-blue-400"
          >
            KHẢO SÁT
          </button>
          {!currentUser && (
            <Link 
              to="/login" 
              className={`relative transition-all duration-300 pb-1 ${
                location.pathname === "/login" 
                  ? "text-blue-300 border-b-2 border-blue-400" 
                  : "hover:text-blue-300 hover:border-b-2 hover:border-blue-400"
              }`}
            >
              Đăng nhập
            </Link>
          )}
          {currentUser && (
            <Link to={`${currentUser ? `/profile/${currentUser.user_role === 1 ? "admin" : "user"}` : "/login"}`}>
              <img
                src={currentUser?.avatar || defaultProfileImg}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white hover:border-blue-300 transition-all duration-300"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Modal Khảo sát */}
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
    </>
  );
};

export default Header;
