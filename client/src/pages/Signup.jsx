import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import {
  FaUser,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import heroImage from "../assets/images/best_offers.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.password || !formData.address || !formData.phone) {
      showErrorToast("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (formData.password.length < 6) {
      showErrorToast("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${apiUrl}/api/auth/signup`, formData);
      if (res?.data?.success) {
        showSuccessToast(res?.data?.message);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showErrorToast(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
      const message = error?.response?.data?.message || "Đăng ký thất bại!";
      showErrorToast(message);
    } finally {
      setLoading(false);
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/85 to-purple-900/90 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col-reverse gap-8 px-6 py-16 lg:flex-row lg:items-center lg:gap-14">
        {/* Left Section - Hero Content */}
        <section className="flex-1 text-white">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-cyan-200">
            Bắt đầu hành trình của bạn
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            Tạo tài khoản mới <br />
            <span className="text-cyan-300">
              và khám phá thế giới cùng chúng tôi.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-200 md:text-lg">
            Tham gia cộng đồng du lịch của chúng tôi để nhận được những ưu đãi
            độc quyền, lưu tour yêu thích và quản lý đặt chỗ dễ dàng. Hãy bắt
            đầu hành trình khám phá của bạn ngay hôm nay!
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold text-cyan-300">+120</p>
              <p className="mt-2 text-sm uppercase tracking-wide text-slate-200">
                Điểm đến
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold text-cyan-300">50K+</p>
              <p className="mt-2 text-sm uppercase tracking-wide text-slate-200">
                Khách hàng
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold text-cyan-300">98%</p>
              <p className="mt-2 text-sm uppercase tracking-wide text-slate-200">
                Hài lòng
              </p>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-200">
              <FaCheckCircle className="text-green-400" />
              <span className="text-sm">Ưu đãi độc quyền</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <FaCheckCircle className="text-green-400" />
              <span className="text-sm">Hỗ trợ 24/7</span>
            </div>
          </div>
        </section>

        {/* Right Section - Signup Form */}
        <section className="flex-1">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white">Đăng ký</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Tạo tài khoản để bắt đầu hành trình
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-white"
                  >
                    Tên người dùng
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaUser className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      required
                      placeholder="Nhập tên người dùng"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pl-12 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-white"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaLock className="text-slate-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      required
                      placeholder="Tối thiểu 6 ký tự"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pl-12 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold text-white"
                  >
                    Địa chỉ
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-3 left-0 flex items-start pl-4">
                      <FaMapMarkerAlt className="text-slate-400 mt-1" />
                    </div>
                    <textarea
                      maxLength={200}
                      id="address"
                      required
                      rows={3}
                      placeholder="Nhập địa chỉ của bạn"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pl-12 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-white"
                  >
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <FaPhone className="text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      required
                      placeholder="0123456789"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pl-12 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng ký</span>
                      <FaArrowRight />
                    </>
                  )}
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-slate-300">
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-cyan-300 hover:text-cyan-200 transition-colors underline"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Signup;
