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
      alert("You already submittd your rating!");
      return;
    }
    if (ratingsData.rating === 0 && ratingsData.review === "") {
      alert("Atleast 1 field is required!");
      return;
    }
    if (
      ratingsData.rating === 0 &&
      ratingsData.review === "" &&
      !ratingsData.userRef
    ) {
      alert("All fields are required!");
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
        alert(data?.message);
        getPackageData();
        getRatings();
        checkRatingGiven();
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
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

  return (
    <div className="w-full">
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
                      {packageData?.packagePrice} VNĐ
                    </span>
                  )}
                  <span className="font-bold text-lg">
                    {packageData?.packageOffer
                      ? packageData?.packageDiscountPrice
                      : packageData?.packagePrice} VNĐ
                  </span>
                </div>
              </div>
          </div>
          </div>
          {/* Info section */}
          <section className="max-w-6xl mx-auto px-5 -mt-10 relative z-10">
            {/* fake tabs */}
            <div className="rounded-t-xl bg-white/90 backdrop-blur border-b p-2 flex flex-wrap gap-2">
              {['DETAILS','ITINERARY','LOCATION','PHOTOS'].map((t, i) => (
                <span key={i} className={`px-4 py-2 rounded-lg text-sm font-semibold ${i===0? 'bg-blue-600 text-white':'text-slate-600 hover:bg-slate-100'}`}>{t}</span>
              ))}
            </div>

            <div className="bg-white/95 backdrop-blur rounded-b-xl shadow p-5">
              {/* top line: destination + cta */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-2 text-green-700 text-lg capitalize">
                  <FaMapMarkerAlt />
                  {packageData?.packageDestination}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) {
                      navigate(`/booking/${params?.id}`);
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="w-full md:w-auto px-5 py-3 bg-green-700 text-white rounded-lg hover:opacity-95"
                >
                  Đặt ngay
                </button>
              </div>

              {/* badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {packageData?.packageOffer && (
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Ưu đãi</span>
                )}
                {packageData?.packageMeals && (
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">Bao gồm bữa ăn</span>
                )}
                {packageData?.packageTransportation && (
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">{packageData?.packageTransportation}</span>
                )}
              </div>

              {/* quick facts grid */}
              <div className="mt-5 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-white">
                  <p className="text-slate-500 text-sm">Thời lượng</p>
                  <p className="mt-1 font-semibold flex items-center gap-2"><FaClock />{(+packageData?.packageDays>0?`${packageData?.packageDays} ngày`:``)}{(+packageData?.packageNights>0?` ${packageData?.packageNights} đêm`:``)}</p>
                </div>
                <div className="p-4 rounded-xl border bg-white">
                  <p className="text-slate-500 text-sm">Độ khó</p>
                  <p className="mt-1 font-semibold flex items-center gap-2"><FaUser />10/10</p>
                </div>
                <div className="p-4 rounded-xl border bg-white">
                  <p className="text-slate-500 text-sm">Địa điểm</p>
                  <p className="mt-1 font-semibold flex items-center gap-2"><FaMapMarkerAlt />{packageData?.packageDestination}</p>
                </div>
                <div className="p-4 rounded-xl border bg-white">
                  <p className="text-slate-500 text-sm">Độ tuổi</p>
                  <p className="mt-1 font-semibold flex items-center gap-2"><FaUser />16+</p>
                </div>
                <div className="p-4 rounded-xl border bg-white">
                  <p className="text-slate-500 text-sm">Thời gian</p>
                  <p className="mt-1 font-semibold flex items-center gap-2"><FaCalendarAlt />Oct-Apr</p>
                </div>
              </div>

              {/* description */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Mô tả</h3>
                <p className="break-all flex flex-col font-medium">
                  {packageData?.packageDescription.length > 280 ? (
                    <>
                      <span id="desc">
                        {packageData?.packageDescription.substring(0, 150)}...
                      </span>
                      <button
                        id="moreBtn"
                        onClick={() => {
                          document.getElementById('desc').innerText = packageData?.packageDescription;
                          document.getElementById('moreBtn').style.display = 'none';
                          document.getElementById('lessBtn').style.display = 'flex';
                        }}
                        className="w-max font-semibold flex items-center gap-2 text-gray-600 hover:underline"
                      >
                        Xem thêm <FaArrowDown />
                      </button>
                      <button
                        id="lessBtn"
                        onClick={() => {
                          document.getElementById('desc').innerText = packageData?.packageDescription.substring(0, 150) + '...';
                          document.getElementById('lessBtn').style.display = 'none';
                          document.getElementById('moreBtn').style.display = 'flex';
                        }}
                        className="w-max font-semibold ml-2 hidden items-center gap-2 text-gray-600 hover:underline"
                      >
                        Thu gọn <FaArrowUp />
                      </button>
                    </>
                  ) : (
                    <>{packageData?.packageDescription}</>
                  )}
                </p>
              </div>

              {/* cards: accommodation, activities, meals, transportation */}
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-white">
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><FaHotel />Nơi ở</h4>
                  <p>{packageData?.packageAccommodation}</p>
                </div>
                <div className="p-4 rounded-xl border bg-white">
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><FaUtensils />Bữa ăn</h4>
                  <p>{packageData?.packageMeals}</p>
                </div>
                <div className="p-4 rounded-xl border bg-white md:col-span-2">
                  <h4 className="text-lg font-semibold mb-2">Hoạt động</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                    {packageData?.packageActivities.split('-').map((activity, index) => {
                      if (activity.trim() === '') return null;
                      return (
                        <div key={index} className="flex items-start mb-2 last:mb-0">
                          <span className="text-green-600 mr-2 mt-1">•</span>
                          <p className="text-gray-700 flex-1">{activity.trim()}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 rounded-xl border bg-white md:col-span-2">
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2"><FaBus />Phương tiện</h4>
                  <p>{packageData?.packageTransportation}</p>
                </div>
              </div>
            </div>
            <div className="mb-4 text-center">
                  <h3 className="text-2xl font-bold section-title inline-block">TOUR REVIEWS</h3>
                </div>
                {packageData?.packageTotalRatings > 0 && (
                  <div className="flex items-center gap-2 text-slate-700 mb-6">
                    <Rating value={packageData?.packageRating || 0} readOnly precision={0.1} />
                    <span className="text-sm font-medium">
                      {Number(packageData?.packageRating || 0).toFixed(2)} based on {packageData?.packageTotalRatings} reviews
                    </span>
                  </div>
                )}

                {/* Write review card */}
                <div
                  className={`mb-6 ${!currentUser || ratingGiven ? 'hidden' : 'block'}`}
                >
                  <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm">
                    <h4 className="font-semibold mb-2">Leave a Review</h4>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                      <Rating
                        name="rating-input"
                        value={ratingsData?.rating}
                        onChange={(e, newValue) => setRatingsData({ ...ratingsData, rating: newValue })}
                      />
                      <span className="text-sm text-slate-500 mt-1 md:mt-0">Rating</span>
                    </div>
                    <textarea
                      className="w-full resize-none p-3 border rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      rows={4}
                      placeholder="Your Review"
                      value={ratingsData?.review}
                      onChange={(e) => setRatingsData({ ...ratingsData, review: e.target.value })}
                    ></textarea>
                    <div className="mt-3 flex justify-end">
                      <button
                        disabled={(ratingsData.rating === 0 && ratingsData.review === '') || loading}
                        type="button"
                        onClick={(e) => { e.preventDefault(); giveRating(); }}
                        className="px-5 py-2 bg-green-700 text-white rounded-lg disabled:opacity-70 hover:opacity-95"
                      >
                        {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
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
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 bg-slate-800 text-white rounded-lg"
                    >
                      Đăng nhập để đánh giá
                    </button>
                  </div>
                )}
          </section>
            <hr />
              {/* Reviews */}
              <section className="mt-10">
                
              </section>
        </div>
      )}
    </div>
  );
};

export default Package;
