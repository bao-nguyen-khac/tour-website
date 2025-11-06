import React, { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Cookies from "js-cookie";

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
      alert("Tất cả các trường đều bắt buộc!");
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
        alert(data?.message);
        navigate(`/profile/${currentUser?.user_role === 1 ? "admin" : "user"}`);
      } else {
        setLoading(false);
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
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

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[95%] flex flex-col items-center p-6 rounded shadow-2xl gap-3">
        <h1 className="text-center font-bold text-2xl">Đặt tour du lịch</h1>
        {/* user info */}
        <div className="w-full flex flex-wrap justify-center gap-2">
          <div className="pr-3 md:border-r md:pr-6">
            <div className="flex flex-col p-2 w-64 xsm:w-72 h-fit gap-2">
              <div className="flex flex-col">
                <label htmlFor="username" className="font-semibold">
                  Tên người dùng:
                </label>
                <input
                  type="text"
                  id="username"
                  className="p-1 rounded border border-black"
                  value={currentUser.username}
                  disabled
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
                  value={currentUser.email}
                  disabled
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
                  value={currentUser.address}
                  disabled
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
                  value={currentUser.phone}
                  disabled
                />
              </div>
            </div>
          </div>
          {/* package info */}
          <div className="pl-3 md:border-l md:pl-6">
            <div className="flex flex-col p-2 w-64 xsm:w-72 h-fit gap-2">
              <div className="flex flex-col">
                <label htmlFor="packageName" className="font-semibold">
                  Tên tour:
                </label>
                <input
                  type="text"
                  id="packageName"
                  className="p-1 rounded border border-black"
                  value={packageData.packageName}
                  disabled
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="packageDestination" className="font-semibold">
                  Điểm đến:
                </label>
                <input
                  type="text"
                  id="packageDestination"
                  className="p-1 rounded border border-black"
                  value={packageData.packageDestination}
                  disabled
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="packagePrice" className="font-semibold">
                  Giá:
                </label>
                <input
                  type="text"
                  id="packagePrice"
                  className="p-1 rounded border border-black"
                  value={
                    packageData.packageOffer
                      ? `${packageData.packageDiscountPrice} VNĐ`
                      : `${packageData.packagePrice} VNĐ`
                  }
                  disabled
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="persons" className="font-semibold">
                  Số người:
                </label>
                <input
                  type="number"
                  id="persons"
                  className="p-1 rounded border border-black"
                  min="1"
                  value={bookingData.persons}
                  onChange={(e) => {
                    setBookingData({
                      ...bookingData,
                      persons: e.target.value,
                      totalPrice:
                        (packageData.packageDiscountPrice
                          ? packageData.packageDiscountPrice
                          : packageData.packagePrice) * e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="date" className="font-semibold">
                  Ngày đi:
                </label>
                <input
                  type="date"
                  id="date"
                  className="p-1 rounded border border-black"
                  min={currentDate}
                  value={bookingData.date}
                  onChange={(e) => {
                    setBookingData({
                      ...bookingData,
                      date: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="totalPrice" className="font-semibold">
                  Tổng tiền:
                </label>
                <input
                  type="text"
                  id="totalPrice"
                  className="p-1 rounded border border-black"
                  value={`${bookingData.totalPrice} VNĐ`}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        {/* submit button */}
        <div className="w-full flex flex-col items-center gap-2">
          <button
            onClick={handleBookPackage}
            disabled={loading}
            className="w-full bg-green-700 text-white p-3 rounded hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đặt tour"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
