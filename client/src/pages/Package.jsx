import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaClock,
  FaMapMarkerAlt,
  FaShare,
  FaUser,
  FaCalendarAlt,
  FaUtensils,
  FaHotel,
  FaBus,
} from "react-icons/fa";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import RatingCard from "./RatingCard";
import Cookies from "js-cookie";
import { formatCurrency } from "../utils/formatCurrency";
import { showErrorToast, showInfoToast, showSuccessToast } from "../utils/toast";

const Package = () => {
  SwiperCore.use([Navigation, Autoplay]);
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
  const [copied, setCopied] = useState(false);
  const [ratingsData, setRatingsData] = useState({
    rating: 0,
    review: "",
    packageId: params?.id,
    userRef: currentUser?._id,
    username: currentUser?.username,
    userProfileImg: currentUser?.avatar,
  });
  const [packageRatings, setPackageRatings] = useState([]);
  const [ratingGiven, setRatingGiven] = useState(false);
  const [activeTab, setActiveTab] = useState("DETAILS");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/package/get-package-data/${params?.id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
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
        setError(data?.message || "Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const giveRating = async () => {
    checkRatingGiven();
    if (ratingGiven) {
      showInfoToast("Bạn đã gửi đánh giá cho tour này rồi!");
      return;
    }
    if (ratingsData.rating === 0 && ratingsData.review === "") {
      showErrorToast("Vui lòng đánh giá sao hoặc viết nhận xét!");
      return;
    }
    if (
      ratingsData.rating === 0 &&
      ratingsData.review === "" &&
      !ratingsData.userRef
    ) {
      showErrorToast("Hãy đăng nhập và điền đầy đủ thông tin đánh giá!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/rating/give-rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(ratingsData),
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        showSuccessToast(data?.message);
        getPackageData();
        getRatings();
        checkRatingGiven();
      } else {
        setLoading(false);
        showErrorToast(data?.message);
      }
    } catch (error) {
      console.log(error);
      showErrorToast();
    }
  };

  const getRatings = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/rating/get-ratings/${params.id}/4`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data) {
        setPackageRatings(data);
      } else {
        setPackageRatings("No ratings yet!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkRatingGiven = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/rating/rating-given/${currentUser?._id}/${params?.id}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      const data = await res.json();
      setRatingGiven(data?.given);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      getPackageData();
      getRatings();
    }
    if (currentUser) {
      checkRatingGiven();
    }
  }, [params.id, currentUser]);

  const tabList = [
    { id: "DETAILS", label: "DETAILS" },
    { id: "ITINERARY", label: "ITINERARY" },
    { id: "LOCATION", label: "LOCATION" },
    { id: "PHOTOS", label: "PHOTOS" },
  ];

  const handleBookingClick = () => {
    if (currentUser) {
      navigate(`/booking/${params?.id}`);
    } else {
      navigate("/login");
    }
  };

  const renderBookingButton = (className = "w-full md:w-auto") => (
    <button
      type="button"
      onClick={handleBookingClick}
      className={`px-5 py-3 bg-green-700 text-white rounded-lg hover:opacity-95 ${className}`}
    >
      Đặt ngay
    </button>
  );

  const activitiesList =
    packageData?.packageActivities
      ?.split("-")
      .map((activity) => activity.trim())
      .filter((activity) => activity.length > 0) || [];

  const totalDays =
    packageData?.packageDays && packageData?.packageDays > 0
      ? packageData.packageDays
      : activitiesList.length || 1;

  const itineraryDays = Array.from({ length: totalDays }, (_, index) => {
    const activity = activitiesList[index];
    return {
      day: index + 1,
      title: activity || "Thời gian tự do khám phá",
      description: activity
        ? `Trải nghiệm ${activity.toLowerCase()} với hướng dẫn viên bản địa và tận hưởng vẻ đẹp của ${packageData?.packageDestination}.`
        : "Tự do trải nghiệm, khám phá ẩm thực và nghỉ ngơi theo sở thích của bạn.",
    };
  });

  const mapUrl = packageData?.packageDestination
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        packageData.packageDestination
      )}&output=embed`
    : null;

  const shouldTruncateDescription =
    packageData?.packageDescription?.length > 280;
  const displayedDescription =
    shouldTruncateDescription && !showFullDescription
      ? `${packageData?.packageDescription.substring(0, 200)}...`
      : packageData?.packageDescription;

  const renderTabContent = () => {
    switch (activeTab) {
      case "DETAILS":
        return (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-2 text-green-700 text-lg capitalize">
                <FaMapMarkerAlt />
                {packageData?.packageDestination}
              </div>
              {renderBookingButton()}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {packageData?.packageOffer && (
                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                  Ưu đãi
                </span>
              )}
              {packageData?.packageMeals && (
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  Bao gồm bữa ăn
                </span>
              )}
              {packageData?.packageTransportation && (
                <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                  {packageData?.packageTransportation}
                </span>
              )}
            </div>

            <div className="mt-5 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-white">
                <p className="text-slate-500 text-sm">Thời lượng</p>
                <p className="mt-1 font-semibold flex items-center gap-2">
                  <FaClock />
                  {+packageData?.packageDays > 0
                    ? `${packageData?.packageDays} ngày`
                    : ""}
                  {+packageData?.packageNights > 0
                    ? ` ${packageData?.packageNights} đêm`
                    : ""}
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-white">
                <p className="text-slate-500 text-sm">Độ khó</p>
                <p className="mt-1 font-semibold flex items-center gap-2">
                  <FaUser />
                  10/10
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-white">
                <p className="text-slate-500 text-sm">Địa điểm</p>
                <p className="mt-1 font-semibold flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {packageData?.packageDestination}
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-white">
                <p className="text-slate-500 text-sm">Độ tuổi</p>
                <p className="mt-1 font-semibold flex items-center gap-2">
                  <FaUser />
                  16+
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-white">
                <p className="text-slate-500 text-sm">Thời gian</p>
                <p className="mt-1 font-semibold flex items-center gap-2">
                  <FaCalendarAlt />
                  Oct-Apr
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Mô tả</h3>
              <p className="text-slate-700 leading-relaxed">
                {displayedDescription}
              </p>
              {shouldTruncateDescription && (
                <button
                  type="button"
                  onClick={() => setShowFullDescription((prev) => !prev)}
                  className="mt-3 w-max font-semibold flex items-center gap-2 text-gray-600 hover:underline"
                >
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                  {showFullDescription ? <FaArrowUp /> : <FaArrowDown />}
                </button>
              )}
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-white">
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FaHotel />
                  Nơi ở
                </h4>
                <p>
                  {packageData?.packageAccommodation || "Đang cập nhật thông tin"}
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-white">
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FaUtensils />
                  Bữa ăn
                </h4>
                <p>{packageData?.packageMeals || "Đang cập nhật thông tin"}</p>
              </div>
              <div className="p-4 rounded-xl border bg-white md:col-span-2">
                <h4 className="text-lg font-semibold mb-2">Hoạt động</h4>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  {activitiesList.length > 0 ? (
                    activitiesList.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start mb-2 last:mb-0"
                      >
                        <span className="text-green-600 mr-2 mt-1">•</span>
                        <p className="text-gray-700 flex-1">{activity}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">
                      Hoạt động sẽ được cập nhật sớm.
                    </p>
                  )}
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-white md:col-span-2">
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FaBus />
                  Phương tiện
                </h4>
                <p>
                  {packageData?.packageTransportation || "Đang cập nhật thông tin"}
                </p>
              </div>
            </div>
          </>
        );
      case "ITINERARY":
        return (
          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Hành trình gợi ý</h3>
              <p className="text-sm text-slate-500 mb-5">
                Lịch trình được thiết kế cân bằng giữa khám phá, nghỉ ngơi và trải
                nghiệm văn hóa bản địa. Bạn có thể linh hoạt thay đổi theo sở thích
                của mình.
              </p>
              <div className="space-y-4">
                {itineraryDays.map((item) => (
                  <div
                    key={item.day}
                    className="flex flex-col md:flex-row md:items-start gap-3 border-l-4 border-blue-500 pl-4 py-2 bg-white rounded-md shadow-sm"
                  >
                    <div className="min-w-[110px]">
                      <span className="text-xs uppercase tracking-wide text-blue-600">
                        Ngày {item.day}
                      </span>
                      <p className="text-base font-semibold text-slate-800">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-slate-600 flex-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Gợi ý chuẩn bị</h4>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  Kiểm tra thời tiết trước chuyến đi và chuẩn bị trang phục phù hợp.
                </li>
                <li>
                  Đem theo giấy tờ tùy thân, bảo hiểm du lịch và thông tin đặt dịch vụ.
                </li>
                <li>
                  Luôn mang theo nước, đồ ăn nhẹ và một ít tiền mặt cho các hoạt động
                  phát sinh.
                </li>
              </ul>
            </div>
            <div className="flex justify-end">{renderBookingButton()}</div>
          </div>
        );
      case "LOCATION":
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Khám phá {packageData?.packageDestination}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {packageData?.packageDestination} là điểm đến lý tưởng dành cho
                  những ai yêu thích thiên nhiên và văn hóa địa phương. Hành trình
                  trải dài qua các thắng cảnh nổi bật, kết hợp hoạt động trải nghiệm
                  đặc sắc giúp bạn cảm nhận trọn vẹn vẻ đẹp nơi đây.
                </p>
              </div>
              <div className="rounded-xl border bg-white p-4">
                <h4 className="font-semibold mb-2">Điểm nhấn địa phương</h4>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                  <li>Thưởng thức ẩm thực đặc trưng và các món ăn đường phố hấp dẫn.</li>
                  <li>Gặp gỡ người dân bản địa, tìm hiểu phong tục và câu chuyện văn hóa.</li>
                  <li>Tham gia hoạt động ngoài trời: trekking, chèo thuyền hoặc dạo biển.</li>
                </ul>
              </div>
              <div className="flex md:justify-start">{renderBookingButton()}</div>
            </div>
            <div className="rounded-xl overflow-hidden border bg-white">
              {mapUrl ? (
                <iframe
                  title={`Bản đồ ${packageData?.packageDestination}`}
                  src={mapUrl}
                  className="w-full h-full min-h-[320px]"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="p-6 text-center text-slate-500">
                  Địa điểm sẽ được cập nhật sớm.
                </div>
              )}
            </div>
          </div>
        );
      case "PHOTOS":
        return (
          <div className="space-y-6">
            {packageData?.packageImages?.length ? (
              <>
                <Swiper
                  spaceBetween={12}
                  slidesPerView={1}
                  navigation
                  autoplay={{ delay: 3500 }}
                  className="rounded-xl overflow-hidden"
                >
                  {packageData.packageImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative w-full h-[500px] md:h-[600px]">
                        <img
                          src={image}
                          alt={`${packageData?.packageName || "tour"} - ảnh ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                {packageData.packageImages.length > 1 && (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {packageData.packageImages.slice(0, 6).map((image, index) => (
                      <div
                        key={`thumb-${index}`}
                        className="overflow-hidden rounded-lg border bg-white h-48 sm:h-52 md:h-56" // tôi muốn ảnh có độ cao cao hơn nữa 
                      >
                        <img
                          src={image}
                          alt={`${packageData?.packageName || "tour"} - hình ${
                            index + 1
                          }`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-6 text-center text-slate-500 border rounded-xl bg-white">
                Chưa có hình ảnh cho tour này. Vui lòng quay lại sau.
              </div>
            )}
            <div className="flex justify-end">{renderBookingButton()}</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen">
      {loading && (
        <p className="text-center font-semibold" id="loading">
          Đang tải...
        </p>
      )}
      {error && (
        <div className="flex flex-col w-full items-center gap-2">
          <p className="text-center text-red-700">Đã xảy ra lỗi!</p>
          <Link
            className="bg-slate-600 text-white p-3 py-2 rounded-lg w-min"
            to="/"
          >
            Quay lại
          </Link>
        </div>
      )}
      {packageData && !loading && !error && (
        <div className="w-full">
          {/* Hero image banner */}
          <div
            className="relative w-full h-[520px] md:h-[600px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${packageData?.packageImages?.[0] || ""})`,
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
            {/* Back & Share */}
            <div className="absolute top-6 left-6 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white/90 cursor-pointer">
              <FaArrowLeft
                className="text-slate-600"
                onClick={() => {
                  navigate("/");
                }}
              />
            </div>
            <div className="absolute top-6 right-6 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white/90 cursor-pointer">
              <FaShare
                className="text-slate-600"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
            {copied && (
              <p className="absolute top-20 right-6 z-10 rounded-md bg-white/90 p-2 text-slate-700">
                Đã sao chép liên kết!
              </p>
            )}

            {/* Center title & rating */}
            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow">
                {packageData?.packageName}
              </h1>
              {packageData?.packageTotalRatings > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <Rating
                    value={packageData?.packageRating || 0}
                    readOnly
                    precision={0.1}
                  />
                  <span className="opacity-90">
                    ({packageData?.packageTotalRatings} reviews)
                  </span>
                </div>
              )}
              {/* Price ribbon */}
              <div className="absolute right-6 bottom-6">
                <div className="bg-blue-600 text-white rounded-full px-5 py-2 shadow-lg flex items-center gap-3">
                  {packageData?.packageOffer && (
                    <span className="line-through opacity-80">
                      {formatCurrency(packageData?.packagePrice)}
                    </span>
                  )}
                  <span className="font-bold text-lg">
                    {formatCurrency(
                      packageData?.packageOffer
                        ? packageData?.packageDiscountPrice
                        : packageData?.packagePrice
                    )}
                  </span>
                </div>
              </div>
          </div>
          </div>
          {/* Info section */}
          <section className="max-w-6xl mx-auto px-5 -mt-10 relative z-10">
            <div className="rounded-t-xl bg-white/90 backdrop-blur border-b p-2 flex flex-wrap gap-2">
              {tabList.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white/95 backdrop-blur rounded-b-xl shadow p-5">
              {renderTabContent()}
            </div>
          </section>

          {/* Reviews */}
          <section className="max-w-5xl mx-auto px-5 mt-12">
            <div className="mb-4 text-center">
              <h3 className="text-2xl font-bold section-title inline-block">
                TOUR REVIEWS
              </h3>
            </div>
            {packageData?.packageTotalRatings > 0 && (
              <div className="flex items-center gap-2 text-slate-700 mb-6 justify-center md:justify-start">
                <Rating
                  value={packageData?.packageRating || 0}
                  readOnly
                  precision={0.1}
                />
                <span className="text-sm font-medium">
                  {Number(packageData?.packageRating || 0).toFixed(2)} dựa trên{" "}
                  {packageData?.packageTotalRatings} đánh giá
                </span>
              </div>
            )}

            {/* Write review card */}
            <div
              className={`mb-6 ${
                !currentUser || ratingGiven ? "hidden" : "block"
              }`}
            >
              <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm">
                <h4 className="font-semibold mb-2">Để lại đánh giá</h4>
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <Rating
                    name="rating-input"
                    value={ratingsData?.rating}
                    onChange={(e, newValue) =>
                      setRatingsData({ ...ratingsData, rating: newValue })
                    }
                  />
                  <span className="text-sm text-slate-500 mt-1 md:mt-0">
                    Điểm đánh giá
                  </span>
                </div>
                <textarea
                  className="w-full resize-none p-3 border rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  rows={4}
                  placeholder="Chia sẻ trải nghiệm của bạn"
                  value={ratingsData?.review}
                  onChange={(e) =>
                    setRatingsData({ ...ratingsData, review: e.target.value })
                  }
                ></textarea>
                <div className="mt-3 flex justify-end">
                  <button
                    disabled={
                      (ratingsData.rating === 0 && ratingsData.review === "") ||
                      loading
                    }
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      giveRating();
                    }}
                    className="px-5 py-2 bg-green-700 text-white rounded-lg disabled:opacity-70 hover:opacity-95"
                  >
                    {loading ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </div>
              </div>
            </div>

            {/* List reviews */}
            <div className="space-y-4">
              <RatingCard packageRatings={packageRatings} />
            </div>

            {(!currentUser || currentUser === null) && (
              <div className="mt-6">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg"
                >
                  Đăng nhập để đánh giá
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Package;
