import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Cookies from "js-cookie";
import { formatCurrency } from "../../utils/formatCurrency";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const Booking = () => {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageRating: 0,
    packageTotalRatings: 0,
    packageImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [bookingData, setBookingData] = useState({
    totalPrice: 0,
    packageDetails: null,
    buyer: null,
    persons: 1,
    date: null,
  });
  const [currentDate, setCurrentDate] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${apiUrl}/api/package/get-package-data/${params?.packageId}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const data = await res.json();
      if (data?.success) {
        setPackageData({
          packageName: data?.packageData?.packageName,
          packageDescription: data?.packageData?.packageDescription,
          packageDestination: data?.packageData?.packageDestination,
          packageDays: data?.packageData?.packageDays,
          packageNights: data?.packageData?.packageNights,
          packageAccommodation: data?.packageData?.packageAccommodation,
          packageTransportation: data?.packageData?.packageTransportation,
          packageMeals: data?.packageData?.packageMeals,
          packageActivities: data?.packageData?.packageActivities,
          packagePrice: data?.packageData?.packagePrice,
          packageDiscountPrice: data?.packageData?.packageDiscountPrice,
          packageOffer: data?.packageData?.packageOffer,
          packageRating: data?.packageData?.packageRating,
          packageTotalRatings: data?.packageData?.packageTotalRatings,
          packageImages: data?.packageData?.packageImages,
        });
        setLoading(false);
      } else {
        setError(data?.message || "Đã xảy ra lỗi!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle booking package
  const handleBookPackage = async () => {
    if (
      bookingData.packageDetails === "" ||
      bookingData.buyer === "" ||
      bookingData.totalPrice <= 0 ||
      bookingData.persons <= 0 ||
      bookingData.date === ""
    ) {
      showErrorToast("Tất cả các trường đều bắt buộc!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/booking/book-package/${params?.packageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...bookingData, userId: currentUser._id }),
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        showSuccessToast(data?.message);
        navigate(`/profile/${currentUser?.user_role === 1 ? "admin" : "user"}`);
      } else {
        setLoading(false);
        showErrorToast(data?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      showErrorToast();
    }
  };

  useEffect(() => {
    if (params?.packageId) {
      getPackageData();
    }
    let date = new Date().toISOString().substring(0, 10);
    let d = date.substring(0, 8) + (parseInt(date.substring(8)) + 1);
    setCurrentDate(d);
  }, [params?.packageId]);

  useEffect(() => {
    if (packageData && params?.packageId) {
      setBookingData({
        ...bookingData,
        packageDetails: params?.packageId,
        buyer: currentUser?._id,
        totalPrice: packageData?.packageDiscountPrice
          ? packageData?.packageDiscountPrice * bookingData?.persons
          : packageData?.packagePrice * bookingData?.persons,
      });
    }
  }, [packageData, params]);

  if (loading && !packageData.packageName) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-700">Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Quay lại</span>
          </button>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-center mb-2">
            Đặt Tour Du Lịch
          </h1>
          <p className="text-center text-slate-600">Vui lòng kiểm tra và điền thông tin đặt tour</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <FaUser className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Thông Tin Khách Hàng</h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="username" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FaUser className="text-blue-600" />
                  Tên người dùng
                </label>
                <input
                  type="text"
                  id="username"
                  className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-slate-50 text-slate-700"
                  value={currentUser.username}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FaEnvelope className="text-blue-600" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-slate-50 text-slate-700"
                  value={currentUser.email}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="address" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FaMapMarkerAlt className="text-blue-600" />
                  Địa chỉ
                </label>
                <textarea
                  maxLength={200}
                  id="address"
                  className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none bg-slate-50 text-slate-700 min-h-[100px]"
                  value={currentUser.address}
                  disabled
                  rows={4}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FaPhone className="text-blue-600" />
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phone"
                  className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-slate-50 text-slate-700"
                  value={currentUser.phone}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Package Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <FaMapMarkerAlt className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Thông Tin Tour</h2>
            </div>

            {/* Package Image */}
            {packageData.packageImages && packageData.packageImages[0] && (
              <div className="mb-4 rounded-xl overflow-hidden">
                <img
                  src={packageData.packageImages[0]}
                  alt={packageData.packageName}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="packageName" className="text-sm font-semibold text-slate-700 mb-2">
                  Tên tour
                </label>
                <input
                  type="text"
                  id="packageName"
                  className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-slate-50 text-slate-700 font-semibold"
                  value={packageData.packageName}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="packageDestination" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FaMapMarkerAlt className="text-purple-600" />
                  Điểm đến
                </label>
                <input
                  type="text"
                  id="packageDestination"
                  className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-slate-50 text-slate-700"
                  value={packageData.packageDestination}
                  disabled
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="packagePrice" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FaDollarSign className="text-purple-600" />
                  Giá tour
                </label>
                <input
                  type="text"
                  id="packagePrice"
                  className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-slate-50 text-slate-700 font-bold text-lg"
                  value={
                    packageData.packageOffer
                      ? formatCurrency(packageData.packageDiscountPrice)
                      : formatCurrency(packageData.packagePrice)
                  }
                  disabled
                />
                {packageData.packageOffer && (
                  <p className="text-xs text-slate-500 mt-1">
                    Giá gốc: <span className="line-through">{formatCurrency(packageData.packagePrice)}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 mb-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Chi Tiết Đặt Tour</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label htmlFor="persons" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FaUsers className="text-green-600" />
                Số người <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="persons"
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-slate-700"
                min="1"
                value={bookingData.persons}
                onChange={(e) => {
                  const persons = Number(e.target.value) || 1;
                  setBookingData((prev) => ({
                    ...prev,
                    persons,
                    totalPrice:
                      (packageData.packageDiscountPrice
                        ? packageData.packageDiscountPrice
                        : packageData.packagePrice) * persons,
                  }));
                }}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FaCalendarAlt className="text-green-600" />
                Ngày đi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-slate-700"
                min={currentDate}
                value={bookingData.date || ""}
                onChange={(e) => {
                  setBookingData({
                    ...bookingData,
                    date: e.target.value,
                  });
                }}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="totalPrice" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FaDollarSign className="text-green-600" />
                Tổng tiền
              </label>
              <input
                type="text"
                id="totalPrice"
                className="px-4 py-3 rounded-xl border-2 border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50 text-slate-700 font-bold text-lg"
                value={formatCurrency(bookingData.totalPrice)}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleBookPackage}
            disabled={loading || !bookingData.date || bookingData.persons < 1}
            className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <FaCheckCircle />
                <span>Xác Nhận Đặt Tour</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
