import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
} from "../redux/user/userSlice";
import MyBookings from "./user/MyBookings";
import UpdateProfile from "./user/UpdateProfile";
import MyHistory from "./user/MyHistory";
import Cookies from "js-cookie";
import defaultProfileImg from "../assets/images/profile.png";
import {
  FaCalendarCheck,
  FaHistory,
  FaUserEdit,
  FaSignOutAlt,
  FaTrashAlt,
  FaCamera,
} from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "../utils/toast";

const InfoLine = ({ label, value }) => (
  <div className="flex flex-col rounded-xl bg-white/10 px-4 py-3">
    <span className="text-xs uppercase tracking-[0.3em] text-slate-200/80">
      {label}
    </span>
    <span className="mt-1 text-sm font-semibold text-white">{value}</span>
  </div>
);

const Profile = () => {
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

  const tabList = [
    { id: 1, label: "Đặt chỗ", icon: <FaCalendarCheck className="text-sm" /> },
    { id: 2, label: "Lịch sử", icon: <FaHistory className="text-sm" /> },
    { id: 3, label: "Cập nhật hồ sơ", icon: <FaUserEdit className="text-sm" /> },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 py-12">
      <div className="absolute inset-0 -z-0">
        <div className="absolute top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      </div>
      {currentUser ? (
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 lg:flex-row">
          <div className="w-full lg:w-[38%]">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 text-white shadow-2xl">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-lg group cursor-pointer border border-white/30"
                    onClick={() => fileRef.current.click()}
                  >
                    <img
                      src={displayAvatar}
                      alt="Ảnh đại diện"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 text-white opacity-0 transition duration-300 group-hover:opacity-100">
                      <FaCamera className="mb-2 text-xl" />
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
                      className="w-full rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-white/25"
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
                  <p className="mt-4 text-sm text-slate-100/90">
                    Cập nhật thông tin cá nhân, quản lý đặt chỗ và xem lại lịch sử
                    hành trình của bạn trong cùng một nơi.
                  </p>
                </div>

                <div className="grid gap-3 rounded-2xl bg-white/10 p-4 shadow-inner backdrop-blur">
                  <InfoLine label="Email" value={currentUser.email || "Chưa cập nhật"} />
                  <InfoLine
                    label="Số điện thoại"
                    value={currentUser.phone || "Chưa cập nhật"}
                  />
                  <InfoLine
                    label="Địa chỉ"
                    value={currentUser.address || "Chưa cập nhật"}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-500/80"
                  >
                    <FaSignOutAlt />
                    Đăng xuất
                  </button>
                  <button
                    onClick={() => setActivePanelId(3)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white text-blue-700 px-4 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-blue-50"
                  >
                    <FaUserEdit />
                    Chỉnh sửa hồ sơ
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

          <div className="w-full lg:flex-1">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl backdrop-blur">
              <nav className="mb-6 flex flex-wrap gap-3">
                {tabList.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActivePanelId(tab.id)}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                      activePanelId === tab.id
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "bg-white text-slate-600 border border-transparent hover:border-slate-200 hover:text-blue-600"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="rounded-2xl border border-slate-100 bg-white/60 p-4 shadow-inner backdrop-blur">
                {activePanelId === 1 && <MyBookings />}
                {activePanelId === 2 && <MyHistory />}
                {activePanelId === 3 && <UpdateProfile />}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-red-700">Vui lòng đăng nhập trước</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
