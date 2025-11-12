import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../../redux/user/userSlice";
import AllBookings from "./AllBookings";
import AdminUpdateProfile from "./AdminUpdateProfile";
import AddPackages from "./AddPackages";
import "./styles/DashboardStyle.css";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";
import Cookies from "js-cookie";
import defaultProfileImg from "../../assets/images/profile.png";
import SurveyStats from "./SurveyStats";
import {
  FaBook,
  FaPlusCircle,
  FaList,
  FaUsers,
  FaCreditCard,
  FaStar,
  FaHistory,
  FaClipboardList,
  FaCamera,
  FaSignOutAlt,
  FaUserEdit,
  FaTrashAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const [photoPercentage, setPhotoPercentage] = useState(0);
  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleProfilePhoto = async (photo) => {
    try {
      dispatch(updateUserStart());
      
      // Upload ảnh lên server
      const form = new FormData();
      form.append("image", photo);
      
      const uploadRes = await fetch(`${apiUrl}/api/package/upload-image`, {
        method: "POST",
        body: form,
      });
      
      const uploadData = await uploadRes.json();
      
      if (!uploadRes.ok || !uploadData.url) {
        dispatch(updateUserFailure(uploadData.message || "Lỗi upload ảnh"));
        showErrorToast(uploadData.message || "Lỗi upload ảnh");
        return;
      }

      // Cập nhật avatar trong database
      const res = await fetch(
        `${apiUrl}/api/user/update-profile-photo/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ avatar: uploadData.url }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        showSuccessToast(data?.message);
        setFormData({ ...formData, avatar: uploadData.url });
        dispatch(updateUserSuccess(data?.user));
        setProfilePhoto(null);
        return;
      } else {
        dispatch(updateUserFailure(data?.message));
        showErrorToast(data?.message);
      }
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure("Lỗi upload ảnh"));
      showErrorToast("Lỗi upload ảnh");
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch(`${apiUrl}/api/auth/logout`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data?.success !== true) {
        dispatch(logOutFailure(data?.message));
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
      showSuccessToast(data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(
      "Bạn có chắc chắn muốn xóa tài khoản không? Tài khoản sẽ bị xóa vĩnh viễn!"
    );
    if (CONFIRM) {
      try {
        dispatch(deleteUserAccountStart());
        const res = await fetch(`${apiUrl}/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (data?.success === false) {
          dispatch(deleteUserAccountFailure(data?.message));
          showErrorToast(data?.message || "Đã xảy ra lỗi!");
          return;
        }
        dispatch(deleteUserAccountSuccess());
        showSuccessToast(data?.message);
      } catch (error) {
        showErrorToast();
      }
    }
  };

  const displayAvatar = profilePhoto
    ? URL.createObjectURL(profilePhoto)
    : formData.avatar
    ? formData.avatar.startsWith("http")
      ? formData.avatar
      : `${apiUrl}${formData.avatar}`
    : defaultProfileImg;

  const InfoLine = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
      <div className="flex-shrink-0 text-white/80">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-200/80">{label}</p>
        <p className="mt-1 text-sm font-semibold text-white truncate">{value || "Chưa cập nhật"}</p>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-wrap max-sm:flex-col p-2 gap-4">
      {currentUser ? (
        <>
          <div className="w-[30%] max-sm:w-full">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10 p-6 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-xl group cursor-pointer border-4 border-white/30"
                    onClick={() => fileRef.current.click()}
                  >
                    <img
                      src={displayAvatar}
                      alt="Ảnh đại diện"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/70 text-white opacity-0 transition duration-300 group-hover:opacity-100">
                      <FaCamera className="mb-2 text-2xl" />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Thay đổi ảnh
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    name="photo"
                    id="photo"
                    hidden
                    ref={fileRef}
                    accept="image/*"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                  />
                  {profilePhoto && (
                    <button
                      onClick={() => handleProfilePhoto(profilePhoto)}
                      className="w-full rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm transition hover:bg-white/30"
                    >
                      {loading
                        ? `Đang tải lên...${photoPercentage ? ` (${photoPercentage}%)` : ""}`
                        : "Xác nhận tải lên"}
                    </button>
                  )}
                </div>

                <div className="rounded-2xl bg-white/15 px-5 py-4 shadow-inner backdrop-blur-sm">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-200">
                    Xin chào,
                  </p>
                  <h2 className="mt-1 text-3xl font-bold">{currentUser.username}</h2>
                  <p className="mt-3 text-xs text-slate-100/90">
                    Quản trị viên hệ thống - Quản lý toàn bộ hoạt động của nền tảng du lịch
                  </p>
                </div>

                <div className="grid gap-3">
                  <InfoLine
                    icon={<FaEnvelope className="text-lg" />}
                    label="Email"
                    value={currentUser.email}
                  />
                  <InfoLine
                    icon={<FaPhone className="text-lg" />}
                    label="Số điện thoại"
                    value={currentUser.phone}
                  />
                  <InfoLine
                    icon={<FaMapMarkerAlt className="text-lg" />}
                    label="Địa chỉ"
                    value={currentUser.address}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-500/80 backdrop-blur-sm"
                  >
                    <FaSignOutAlt />
                    Đăng xuất
                  </button>
                  <button
                    onClick={() => setActivePanelId(8)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white text-indigo-700 px-4 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-indigo-50"
                  >
                    <FaUserEdit />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="sm:col-span-2 flex items-center justify-center gap-2 rounded-xl border border-white/40 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-600/90"
                  >
                    <FaTrashAlt />
                    Xóa tài khoản
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ---------------------------------------------------------------------------------------- */}
          <div className="w-[65%] max-sm:w-full">
            <div className="main-div">
              <nav className="w-full bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-300 shadow-sm overflow-x-auto navbar">
                <div className="w-full flex gap-1 p-1">
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                      activePanelId === 1
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "text-slate-700 hover:bg-slate-200 hover:text-blue-600"
                    }`}
                    onClick={() => setActivePanelId(1)}
                  >
                    <FaBook className="text-base" />
                    <span>Đặt chỗ</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                      activePanelId === 2
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "text-slate-700 hover:bg-slate-200 hover:text-blue-600"
                    }`}
                    onClick={() => setActivePanelId(2)}
                  >
                    <FaPlusCircle className="text-base" />
                    <span>Thêm tour</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                      activePanelId === 3
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "text-slate-700 hover:bg-slate-200 hover:text-blue-600"
                    }`}
                    onClick={() => setActivePanelId(3)}
                  >
                    <FaList className="text-base" />
                    <span>Tất cả tour</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                      activePanelId === 4
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "text-slate-700 hover:bg-slate-200 hover:text-blue-600"
                    }`}
                    onClick={() => setActivePanelId(4)}
                  >
                    <FaUsers className="text-base" />
                    <span>Người dùng</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                      activePanelId === 5
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "text-slate-700 hover:bg-slate-200 hover:text-blue-600"
                    }`}
                    onClick={() => setActivePanelId(5)}
                  >
                    <FaCreditCard className="text-base" />
                    <span>Thanh toán</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                      activePanelId === 6
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "text-slate-700 hover:bg-slate-200 hover:text-blue-600"
                    }`}
                    onClick={() => setActivePanelId(6)}
                  >
                    <FaStar className="text-base" />
                    <span>Đánh giá</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                      activePanelId === 7
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "text-slate-700 hover:bg-slate-200 hover:text-blue-600"
                    }`}
                    onClick={() => setActivePanelId(7)}
                  >
                    <FaHistory className="text-base" />
                    <span>Lịch sử</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                      activePanelId === 9
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "text-slate-700 hover:bg-slate-200 hover:text-blue-600"
                    }`}
                    onClick={() => setActivePanelId(9)}
                  >
                    <FaClipboardList className="text-base" />
                    <span>Khảo sát</span>
                  </button>
                </div>
              </nav>
              <div className="content-div flex flex-wrap">
                {activePanelId === 1 ? (
                  <AllBookings />
                ) : activePanelId === 2 ? (
                  <AddPackages />
                ) : activePanelId === 3 ? (
                  <AllPackages />
                ) : activePanelId === 4 ? (
                  <AllUsers />
                ) : activePanelId === 5 ? (
                  <Payments />
                ) : activePanelId === 6 ? (
                  <RatingsReviews />
                ) : activePanelId === 7 ? (
                  <History />
                ) : activePanelId === 8 ? (
                  <AdminUpdateProfile />
                ) : activePanelId === 9 ? (
                  <SurveyStats />
                ) : (
                  <div>Không tìm thấy trang!</div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>
          <p className="text-red-700">Vui lòng đăng nhập trước</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
