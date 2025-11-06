import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
} from "../../redux/user/userSlice";
import Cookies from "js-cookie";

const AdminUpdateProfile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] =
    useState(true);
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phone: "",
    avatar: "",
  });
  const [updatePassword, setUpdatePassword] = useState({
    oldpassword: "",
    newpassword: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePass = (e) => {
    setUpdatePassword({
      ...updatePassword,
      [e.target.id]: e.target.value,
    });
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    if (
      currentUser.username === formData.username &&
      currentUser.address === formData.address &&
      currentUser.phone === formData.phone
    ) {
      alert("Thay đổi ít nhất 1 trường để cập nhật thông tin");
      return;
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${apiUrl}/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserSuccess());
        dispatch(updateUserFailure(data?.messsage));
        alert("Phiên đăng nhập đã kết thúc! Vui lòng đăng nhập lại");
        navigate("/login");
        return;
      }
      if (data.success && res.status === 201) {
        alert(data?.message);
        dispatch(updateUserSuccess(data?.user));
        return;
      }
      alert(data?.message);
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();
    if (
      updatePassword.oldpassword === "" ||
      updatePassword.newpassword === ""
    ) {
      alert("Nhập mật khẩu hợp lệ");
      return;
    }
    if (updatePassword.oldpassword === updatePassword.newpassword) {
      alert("Mật khẩu mới không được trùng với mật khẩu cũ!");
      return;
    }
    try {
      dispatch(updatePassStart());
      const res = await fetch(`${apiUrl}/api/user/update-password/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatePassword),
      });
      const data = await res.json();
      if (data.success === false && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserSuccess());
        dispatch(updatePassFailure(data?.message));
        alert("Phiên đăng nhập đã kết thúc! Vui lòng đăng nhập lại");
        navigate("/login");
        return;
      }
      dispatch(updatePassSuccess());
      alert(data?.message);
      setUpdatePassword({
        oldpassword: "",
        newpassword: "",
      });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`updateProfile w-full p-3 m-1 transition-all duration-300 flex justify-center`}
    >
      {updateProfileDetailsPanel === true ? (
        <div className="flex flex-col border self-center shadow-2xl border-gray-400 rounded-lg p-2 w-72 h-fit gap-2 sm:w-[320px]">
          <h1 className="text-2xl text-center font-semibold">Cập nhật hồ sơ</h1>
          <div className="flex flex-col">
            <label htmlFor="username" className="font-semibold">
              Tên người dùng:
            </label>
            <input
              type="text"
              id="username"
              className="p-1 rounded border border-black"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="address" className="font-semibold">
              Địa chỉ:
            </label>
            <textarea
              maxLength={200}
              type="text"
              id="address"
              className="p-2 rounded border border-black resize-none w-full min-h-[100px]"
              value={formData.address}
              onChange={handleChange}
              rows={5}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="font-semibold">
              Số điện thoại:
            </label>
            <input
              type="text"
              id="phone"
              className="p-1 rounded border border-black"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <button
            disabled={loading}
            onClick={updateUserDetails}
            className="p-2 text-white bg-slate-700 rounded hover:opacity-95"
          >
            {loading ? "Đang tải..." : "Cập nhật"}
          </button>
          <button
            disabled={loading}
            type="button"
            onClick={() => setUpdateProfileDetailsPanel(false)}
            className="p-2 text-white bg-red-700 rounded hover:opacity-95"
          >
            {loading ? "Đang tải..." : "Đổi mật khẩu"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col border shadow-2xl border-gray-400 rounded-lg p-2 w-72 h-fit gap-2 sm:w-[320px]">
          <h1 className="text-2xl text-center font-semibold">
            Đổi mật khẩu
          </h1>
          <div className="flex flex-col">
            <label htmlFor="username" className="font-semibold">
              Nhập mật khẩu cũ:
            </label>
            <input
              type="text"
              id="oldpassword"
              className="p-1 rounded border border-black"
              value={updatePassword.oldpassword}
              onChange={handlePass}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username" className="font-semibold">
              Nhập mật khẩu mới:
            </label>
            <input
              type="text"
              id="newpassword"
              className="p-1 rounded border border-black"
              value={updatePassword.newpassword}
              onChange={handlePass}
            />
          </div>
          <button
            disabled={loading}
            onClick={updateUserPassword}
            className="p-2 text-white bg-slate-700 rounded hover:opacity-95"
          >
            {loading ? "Đang tải..." : "Cập nhật mật khẩu"}
          </button>
          <button
            disabled={loading}
            onClick={() => {
              setUpdateProfileDetailsPanel(true);
              setUpdatePassword({
                oldpassword: "",
                newpassword: "",
              });
            }}
            type="button"
            className="p-2 text-white bg-red-700 rounded hover:opacity-95 w-24"
          >
            {loading ? "Đang tải..." : "Quay lại"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUpdateProfile;
