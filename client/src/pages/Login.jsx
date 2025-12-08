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
import heroImage from "../assets/images/best_offers.jpg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    phone: "",
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
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Travel background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col-reverse gap-8 px-6 py-16 lg:flex-row lg:items-center lg:gap-14">
        <section className="flex-1 text-white">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-cyan-200">
            Khám phá thế giới cùng TravelGo
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            Chào mừng trở lại! <br />
            <span className="text-cyan-300">
              Đặt tour mơ ước chỉ với vài bước.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-200 md:text-lg">
            Đăng nhập để tiếp tục quản lý hành trình, lưu tour yêu thích và
            nhận ưu đãi độc quyền cho thành viên. Chúng tôi sẽ đưa bạn đến những
            trải nghiệm đáng nhớ nhất.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-bold text-cyan-300">+120</p>
              <p className="mt-2 text-sm uppercase tracking-wide text-slate-200">
                Điểm đến mới mỗi năm
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-bold text-cyan-300">98%</p>
              <p className="mt-2 text-sm uppercase tracking-wide text-slate-200">
                Khách hàng hài lòng
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-bold text-cyan-300">24/7</p>
              <p className="mt-2 text-sm uppercase tracking-wide text-slate-200">
                Hỗ trợ đồng hành
              </p>
            </div>
          </div>
        </section>

        <section className="flex-1">
          <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-slate-900">
                Đăng nhập tài khoản
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                Chúng tôi rất vui khi được đồng hành cùng bạn trong chuyến đi
                tiếp theo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-semibold uppercase tracking-wide text-slate-600"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  placeholder="0123456789"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold uppercase tracking-wide text-slate-600"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>
                  Quên mật khẩu?{" "}
                  <a
                    href="#"
                    className="font-semibold text-cyan-600 hover:text-cyan-500"
                  >
                    Đặt lại
                  </a>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-cyan-600/40 transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}
            </form>

            <div className="mt-8 text-center text-sm text-slate-600">
              <span className="text-slate-500">
                Chưa có tài khoản?
              </span>{" "}
              <Link
                to="/signup"
                className="font-semibold text-cyan-600 hover:text-cyan-500"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </section>
      </div>

      {popup.show && (
        <Popup
          message={popup.message}
          onClose={() => {
            setPopup({ show: false, message: "", success: false });
            if (popup.success) navigate("/");
          }}
        />
      )}
    </main>
  );
};

export default Login;
