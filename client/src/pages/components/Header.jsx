import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import defaultProfileImg from "../../assets/images/profile.png";
import Cookies from "js-cookie";
import { FaPhone, FaClock, FaFacebook, FaTwitter, FaPinterest, FaInstagram, FaShoppingCart, FaSearch as FaSearchIcon, FaCompass, FaTumblr } from "react-icons/fa";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
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
        alert(data?.message);
        setSurvey({ destination: "", stayDurationDays: 1, transportation: "", numPersons: 1, travelType: "" });
        setShowSurvey(false);
      } else {
        alert(data?.message || "Đã xảy ra lỗi");
      }
    } catch (error) {
      console.log(error);
      alert("Đã xảy ra lỗi");
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
          <Link to="/" className="hover:text-blue-300 border-b-2 border-blue-400 pb-1">
            Trang chủ
          </Link>
          <Link to="/search" className="hover:text-blue-300">
            Tours
          </Link>
          <Link to="/search" className="hover:text-blue-300">
            Đặt chỗ
          </Link>
          <Link to="/about" className="hover:text-blue-300">
            Giới thiệu
          </Link>
          <button
            onClick={openSurvey}
            className="hover:text-blue-300"
          >
            Khảo sát
          </button>
          {!currentUser && (
            <Link to="/login" className="hover:text-blue-300">
              Đăng nhập
            </Link>
          )}
          {currentUser && (
            <Link to={`${currentUser ? `/profile/${currentUser.user_role === 1 ? "admin" : "user"}` : "/login"}`}>
              <img
                src={currentUser?.avatar || defaultProfileImg}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Modal Khảo sát */}
      {showSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-[95%] sm:w-[520px] rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-slate-400 text-white px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold">Khảo sát du lịch</h2>
              <button
                onClick={() => setShowSurvey(false)}
                className="text-white hover:opacity-90 text-xl leading-none"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>
            <div className="bg-white bg-opacity-90 p-4 sm:p-5">
              <form onSubmit={handleSurveySubmit} className="grid grid-cols-1 gap-3">
                <div className="flex flex-col">
                  <label htmlFor="destination" className="font-semibold text-slate-700">Địa điểm</label>
                  <select
                    id="destination"
                    className="p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
                    value={survey.destination}
                    onChange={handleSurveyChange}
                    required
                  >
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
                <div className="flex flex-col">
                  <label htmlFor="stayDurationDays" className="font-semibold text-slate-700">Thời gian ở lại (ngày)</label>
                  <input id="stayDurationDays" type="number" min="1" className="p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400" value={survey.stayDurationDays} onChange={handleSurveyChange} required />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="transportation" className="font-semibold text-slate-700">Phương tiện di chuyển</label>
                  <select
                    id="transportation"
                    className="p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
                    value={survey.transportation}
                    onChange={handleSurveyChange}
                    required
                  >
                    <option value="">Chọn</option>
                    <option>Ô tô</option>
                    <option>Máy bay</option>
                    <option>Tàu</option>
                    <option>Thuyền</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="numPersons" className="font-semibold text-slate-700">Số lượng người</label>
                  <input id="numPersons" type="number" min="1" className="p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400" value={survey.numPersons} onChange={handleSurveyChange} required />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="travelType" className="font-semibold text-slate-700">Thể loại du lịch</label>
                  <select
                    id="travelType"
                    className="p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
                    value={survey.travelType}
                    onChange={handleSurveyChange}
                    required
                  >
                    <option value="">Chọn</option>
                    <option>Biển</option>
                    <option>Núi</option>
                    <option>Nghỉ dưỡng</option>
                    <option>Khám phá</option>
                    <option>Văn hóa</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowSurvey(false)} className="flex-1 p-3 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50">Hủy</button>
                  <button className="flex-1 p-3 bg-slate-700 text-white rounded hover:opacity-90">Gửi khảo sát</button>
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
