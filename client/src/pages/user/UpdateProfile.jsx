import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
} from "../../redux/user/userSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const UpdateProfile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] =
    useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });
  const [updatePassword, setUpdatePassword] = useState({
    oldpassword: "",
    newpassword: "",
  });

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
      currentUser.email === formData.email &&
      currentUser.address === formData.address &&
      currentUser.phone === formData.phone
    ) {
      showErrorToast("Vui lòng thay đổi ít nhất 1 thông tin trước khi cập nhật!");
      return;
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserSuccess());
        dispatch(updateUserFailure(data?.message));
        showErrorToast("Phiên đăng nhập đã kết thúc! Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }
      if (data.success && res.status === 201) {
        showSuccessToast(data?.message);
        dispatch(updateUserSuccess(data?.user));
        return;
      }
      showErrorToast(data?.message);
      return;
    } catch (error) {
      console.log(error);
      showErrorToast("Cập nhật thất bại! Vui lòng thử lại.");
    }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();
    if (
      updatePassword.oldpassword === "" ||
      updatePassword.newpassword === ""
    ) {
      showErrorToast("Vui lòng nhập đầy đủ mật khẩu cũ và mới!");
      return;
    }
    if (updatePassword.oldpassword === updatePassword.newpassword) {
      showErrorToast("Mật khẩu mới không được trùng với mật khẩu cũ!");
      return;
    }
    try {
      dispatch(updatePassStart());
      const res = await fetch(`/api/user/update-password/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePassword),
      });
      const data = await res.json();
      if (data.success === false && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserSuccess());
        dispatch(updatePassFailure(data?.message));
        showErrorToast("Phiên đăng nhập đã kết thúc! Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }
      dispatch(updatePassSuccess());
      showSuccessToast(data?.message);
      setUpdatePassword({
        oldpassword: "",
        newpassword: "",
      });
      return;
    } catch (error) {
      console.log(error);
      showErrorToast("Có lỗi xảy ra khi cập nhật mật khẩu!");
    }
  };

  return (
    <div
      className={`updateProfile w-full p-3 m-1 transition-all duration-300 flex justify-center`}
    >
      {updateProfileDetailsPanel === true ? (
        <div className="flex flex-col border self-center border-black rounded-lg p-2 w-72 h-fit gap-2 sm:w-[320px]">
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
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="p-1 rounded border border-black"
              value={formData.email}
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
            onClick={() => setUpdateProfileDetailsPanel(false)}
            className="p-2 text-white bg-slate-700 rounded hover:opacity-95"
          >
            Đổi mật khẩu
          </button>
        </div>
      ) : (
        <div className="flex flex-col border self-center border-black rounded-lg p-2 w-72 h-fit gap-2 sm:w-[320px]">
          <h1 className="text-2xl text-center font-semibold">Đổi mật khẩu</h1>
          <div className="flex flex-col">
            <label htmlFor="oldpassword" className="font-semibold">
              Mật khẩu cũ:
            </label>
            <input
              type="password"
              id="oldpassword"
              className="p-1 rounded border border-black"
              value={updatePassword.oldpassword}
              onChange={handlePass}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="newpassword" className="font-semibold">
              Mật khẩu mới:
            </label>
            <input
              type="password"
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
            {loading ? "Đang tải..." : "Cập nhật"}
          </button>
          <button
            onClick={() => setUpdateProfileDetailsPanel(true)}
            className="p-2 text-white bg-slate-700 rounded hover:opacity-95"
          >
            Cập nhật hồ sơ
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
