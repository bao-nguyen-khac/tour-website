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
} from "../redux/user/userSlice";
import MyBookings from "./user/MyBookings";
import UpdateProfile from "./user/UpdateProfile";
import MyHistory from "./user/MyHistory";
import Cookies from "js-cookie";
import defaultProfileImg from "../assets/images/profile.png";
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
  const [popup, setPopup] = useState({ show: false, message: "", success: false });

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
        alert(uploadData.message || "Lỗi upload ảnh");
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
        alert(data?.message);
        setFormData({ ...formData, avatar: uploadData.url });
        dispatch(updateUserSuccess(data?.user));
        setProfilePhoto(null);
        return;
      } else {
        dispatch(updateUserFailure(data?.message));
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
      dispatch(updateUserFailure("Lỗi upload ảnh"));
      alert("Lỗi upload ảnh");
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
      alert(data?.message);
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
          alert("Đã xảy ra lỗi!");
          return;
        }
        dispatch(deleteUserAccountSuccess());
        alert(data?.message);
      } catch (error) {}
    }
  };

  console.log('🤖 ~ Profile ~ profilePhoto:', profilePhoto);
  return (
    <div className="flex w-full flex-wrap max-sm:flex-col p-2">
      {currentUser ? (
        <>
          <div className="w-[40%] p-3 max-sm:w-full">
            <div className="flex flex-col items-center gap-4 p-3">
              <div className="w-full flex flex-col items-center relative">
                <img
                  src={
                    (profilePhoto && URL.createObjectURL(profilePhoto)) ||
                    formData.avatar && apiUrl + formData.avatar || defaultProfileImg
                  }
                  alt="Profile photo"
                  className="w-64 min-h-52 max-h-64 rounded-lg"
                  onClick={() => fileRef.current.click()}
                  onMouseOver={() => {
                    document
                      .getElementById("photoLabel")
                      .classList.add("block");
                  }}
                  onMouseOut={() => {
                    document
                      .getElementById("photoLabel")
                      .classList.remove("block");
                  }}
                />
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  hidden
                  ref={fileRef}
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                />
                <label
                  htmlFor="photo"
                  id="photoLabel"
                  className="w-64 bg-slate-300 absolute bottom-0 p-2 text-center text-lg text-white font-semibold rounded-b-lg"
                  hidden
                >
                  Chọn ảnh
                </label>
              </div>
              {profilePhoto && (
                <div className="flex w-full justify-between gap-1">
                  <button
                    onClick={() => handleProfilePhoto(profilePhoto)}
                    className="bg-green-700 p-2 text-white mt-3 flex-1 hover:opacity-90"
                  >
                    {loading ? `Đang tải lên...(${photoPercentage}%)` : "Tải lên"}
                  </button>
                </div>
              )}
              <p
                style={{
                  width: "100%",
                  borderBottom: "1px solid black",
                  lineHeight: "0.1em",
                  margin: "10px",
                }}
              >
                <span className="font-semibold" style={{ background: "#fff" }}>
                  Chi tiết
                </span>
              </p>
              <div className="w-full flex justify-between px-1">
                <button
                  onClick={handleLogout}
                  className="text-red-600 text-lg font-semibold self-start border border-red-600 p-1 rounded-lg hover:bg-red-600 hover:text-white"
                >
                  Đăng xuất
                </button>
                <button
                  onClick={() => setActivePanelId(3)}
                  className="text-white text-lg self-end bg-gray-500 p-1 rounded-lg hover:bg-gray-700"
                >
                  Chỉnh sửa hồ sơ
                </button>
              </div>
              <div className="w-full shadow-2xl rounded-lg p-3 break-all">
                <p className="text-3xl font-semibold m-1">
                  Xin chào {currentUser.username} !
                </p>
                <p className="text-lg font-semibold">
                  Email:{currentUser.email}
                </p>
                <p className="text-lg font-semibold">
                  Số điện thoại:{currentUser.phone}
                </p>
                <p className="text-lg font-semibold">
                  Địa chỉ:{currentUser.address}
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="text-red-600 hover:underline"
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
          {/* ---------------------------------------------------------------------------------------- */}
          <div className="w-[60%] max-sm:w-full">
            <div>
              <nav className="w-full border-blue-500 border-b-4">
                <div className="w-full flex gap-2">
                  <button
                    className={
                      activePanelId === 1
                        ? "p-1 rounded-t transition-all duration-300 bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300"
                    }
                    id="bookings"
                    onClick={() => setActivePanelId(1)}
                  >
                    Đặt chỗ
                  </button>
                  <button
                    className={
                      activePanelId === 2
                        ? "p-1 rounded-t transition-all duration-300 bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300"
                    }
                    id="updateProfile"
                    onClick={() => setActivePanelId(2)}
                  >
                    Lịch sử
                  </button>
                </div>
              </nav>
              {/* bookings */}
              <div className="main flex flex-wrap">
                {activePanelId === 1 && <MyBookings />}
                {/* History */}
                {activePanelId === 2 && <MyHistory />}
                {/* Update profile */}
                {activePanelId === 3 && <UpdateProfile />}
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

export default Profile;
