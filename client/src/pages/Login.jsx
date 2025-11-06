import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import Popup from "./components/Popup";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [popup, setPopup] = useState({ show: false, message: "", success: false });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success) {
        if (data?.token) {
          Cookies.set("access_token", data.token);
        }
        dispatch(loginSuccess(data?.user));
        setPopup({ show: true, message: data?.message, success: data?.success });
      } else {
        dispatch(loginFailure(data?.message));
        setPopup({ show: true, message: data?.message });
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.log(error);
    }
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col border border-black rounded-lg p-4 w-72 h-fit gap-5 sm:w-[320px] bg-white bg-opacity-60">
          <h1 className="text-3xl text-center font-semibold">Đăng nhập</h1>
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="p-3 rounded border border-black bg-white bg-opacity-80"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              className="p-3 rounded border border-black bg-white bg-opacity-80"
              onChange={handleChange}
            />
          </div>
          <p className="text-blue-700 text-sm hover:underline">
            <Link to={`/signup`}>Chưa có tài khoản? Đăng ký</Link>
          </p>
          <button
            disabled={loading}
            className="p-3 text-white bg-slate-700 rounded hover:opacity-95"
          >
            {loading ? "Đang tải..." : "Đăng nhập"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </form>
      {popup.show && (
        <Popup
          message={popup.message}
          onClose={() => {
            setPopup({ show: false, message: "", success: false });
            if (popup.success) navigate("/");
          }}
        />
      )}
    </div>
  );
};

export default Login;
