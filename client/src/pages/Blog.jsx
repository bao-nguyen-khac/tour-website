import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaStar,
  FaChartLine,
  FaUsers,
  FaGlobeAmericas,
  FaPlaneDeparture,
  FaTag,
  FaArrowRight,
  FaRoute,
} from "react-icons/fa";
import { formatCurrency } from "../utils/formatCurrency";
import { showErrorToast } from "../utils/toast";

const EmptyState = ({ title, subtitle }) => (
  <div className="text-center py-16 px-4 bg-white/70 rounded-2xl border border-slate-200 shadow-inner">
    <p className="text-lg font-semibold text-slate-800">{title}</p>
    <p className="text-sm text-slate-500 mt-2">{subtitle}</p>
  </div>
);

const InfoPill = ({ label, value }) => (
  <div className="px-4 py-2 bg-white rounded-full border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2">
    <FaTag className="text-blue-500" />
    <span className="uppercase tracking-wide">{label}</span>
    <span className="text-slate-900">{value}</span>
  </div>
);

const Blog = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [blogData, setBlogData] = useState(null);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (selectedDestination) {
      fetchBlogData(selectedDestination);
    }
  }, [selectedDestination]);

  const fetchDestinations = async () => {
    try {
      setLoadingDestinations(true);
      const res = await fetch(`${apiUrl}/api/package/get-packages?limit=200&order=asc`);
      const data = await res.json();
      if (data?.success && Array.isArray(data?.packages)) {
        const uniqueDestinations = [
          ...new Set(
            data.packages
              .map((pkg) => pkg.packageDestination)
              .filter(Boolean)
          ),
        ].sort((a, b) => a.localeCompare(b, "vi"));
        setDestinations(uniqueDestinations);
        if (!selectedDestination && uniqueDestinations.length) {
          setSelectedDestination(uniqueDestinations[0]);
        }
      } else {
        showErrorToast(data?.message || "Không thể tải danh sách địa điểm!");
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Không thể tải danh sách địa điểm!");
    } finally {
      setLoadingDestinations(false);
    }
  };

  const fetchBlogData = async (destination) => {
    try {
      setLoadingBlog(true);
      setBlogData(null);
      const res = await fetch(
        `${apiUrl}/api/blog/destination/${encodeURIComponent(destination)}`
      );
      const data = await res.json();
      if (data?.success) {
        setBlogData(data?.data);
      } else {
        showErrorToast(data?.message || "Không thể tải dữ liệu blog!");
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Không thể tải dữ liệu blog!");
    } finally {
      setLoadingBlog(false);
    }
  };

  const filteredDestinations = useMemo(() => {
    if (!searchKeyword.trim()) return destinations;
    return destinations.filter((dest) =>
      dest.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [destinations, searchKeyword]);

  const summary = blogData?.summary;
  const comparison = blogData?.comparison;
  const itineraryInsights = blogData?.itineraryInsights;
  const packages = blogData?.packages || [];

  const highlightCards = useMemo(() => {
    if (!summary) return [];
    return [
      {
        id: summary.cheapestPackage?.id,
        title: "Giá tốt nhất",
        description: summary.cheapestPackage?.name,
        value: formatCurrency(
          summary.cheapestPackage?.discountPrice ||
            summary.cheapestPackage?.price ||
            0
        ),
        meta: `${summary.cheapestPackage?.days || 0}N${
          summary.cheapestPackage?.nights || 0
        }Đ`,
      },
      {
        id: summary.premiumPackage?.id,
        title: "Cao cấp",
        description: summary.premiumPackage?.name,
        value: formatCurrency(
          summary.premiumPackage?.discountPrice ||
            summary.premiumPackage?.price ||
            0
        ),
        meta: `${summary.premiumPackage?.days || 0}N${
          summary.premiumPackage?.nights || 0
        }Đ`,
      },
      {
        id: summary.topRated?.id,
        title: "Đánh giá cao",
        description: summary.topRated?.name,
        value: `${summary.topRated?.avgRating || 0} ★`,
        meta: `${summary.topRated?.reviewCount || 0} đánh giá`,
      },
      {
        id: summary.mostPopular?.id,
        title: "Phổ biến",
        description: summary.mostPopular?.name,
        value: `${summary.mostPopular?.bookingCount || 0} booking`,
        meta: "Được khách yêu thích",
      },
    ];
  }, [summary]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="uppercase text-xs tracking-[0.3em] text-white/70 mb-4">
            Travel Data Stories
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Blog so sánh tour theo dữ liệu thực tế
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/80 max-w-3xl">
            Khám phá những bài viết tự động dựa trên dữ liệu thực tế: giá, đánh giá, mức độ phổ biến và những góc nhìn chuyên sâu của đội ngũ data analyst giúp bạn chọn tour phù hợp nhất.
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none opacity-20 bg-[radial-gradient(circle,_rgba(255,255,255,0.35),_transparent_60%)]" />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 -mt-20 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2 mb-2">
                <FaMapMarkerAlt className="text-blue-500" />
                Chọn địa điểm cần phân tích
              </label>
              <div className="relative">
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold text-slate-800"
                  value={selectedDestination}
                  onChange={(event) => setSelectedDestination(event.target.value)}
                  disabled={loadingDestinations || !destinations.length}
                >
                  <option value="">
                    {loadingDestinations ? "Đang tải..." : "Chọn địa điểm"}
                  </option>
                  {destinations.map((destination) => (
                    <option value={destination} key={destination}>
                      {destination}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2 mb-2">
                <FaGlobeAmericas className="text-blue-500" />
                Tìm nhanh địa điểm
              </label>
              <input
                type="text"
                placeholder="Nhập tên thành phố, khu vực..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold text-slate-800"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
              />
              {searchKeyword && (
                <div className="mt-2 text-xs text-slate-500">
                  {filteredDestinations.length} địa điểm phù hợp
                </div>
              )}
            </div>
          </div>

          {filteredDestinations.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {filteredDestinations.slice(0, 12).map((destination) => (
                <button
                  key={destination}
                  onClick={() => setSelectedDestination(destination)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    selectedDestination === destination
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {destination}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16 space-y-10">
        {loadingBlog && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-6" />
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-32 bg-slate-100 rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        {!loadingBlog && selectedDestination && !blogData && (
          <EmptyState
            title="Chưa có dữ liệu cho địa điểm này"
            subtitle="Hãy thử chọn địa điểm khác hoặc thêm tour mới cho khu vực này."
          />
        )}

        {!selectedDestination && !loadingDestinations && (
          <EmptyState
            title="Hãy chọn một địa điểm"
            subtitle="Trang blog sẽ tự động phân tích khi bạn chọn thành phố mong muốn."
          />
        )}

        {blogData && (
          <>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <InfoPill label="Địa điểm" value={blogData.destination} />
                  <InfoPill label="Số tour" value={blogData.totalPackages} />
                  <InfoPill
                    label="Khoảng giá"
                    value={`${formatCurrency(
                      comparison?.priceRange?.min || 0
                    )} - ${formatCurrency(comparison?.priceRange?.max || 0)}`}
                  />
                  <InfoPill
                    label="Thời lượng"
                    value={`${comparison?.durationRange?.minDays || 0} - ${
                      comparison?.durationRange?.maxDays || 0
                    } ngày`}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow">
                        <FaChartLine />
                      </div>
                      <p className="text-sm text-blue-700 font-semibold uppercase tracking-wide">
                        Giá trung bình
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">
                      {formatCurrency(summary?.averagePrice || 0)}
                    </p>
                    <p className="text-sm text-blue-700 mt-2">
                      Dựa trên tất cả các tour có sẵn
                    </p>
                  </div>

                  <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow">
                        <FaStar />
                      </div>
                      <p className="text-sm text-indigo-700 font-semibold uppercase tracking-wide">
                        Điểm trung bình
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-indigo-900">
                      {summary?.averageRating || 0} ★
                    </p>
                    <p className="text-sm text-indigo-700 mt-2">
                      {summary?.totalReviews || 0} lượt đánh giá
                    </p>
                  </div>

                  <div className="rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-purple-600 shadow">
                        <FaUsers />
                      </div>
                      <p className="text-sm text-purple-700 font-semibold uppercase tracking-wide">
                        Mức độ phổ biến
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-purple-900">
                      {packages.reduce((sum, pkg) => sum + (pkg.bookingCount || 0), 0)}
                    </p>
                    <p className="text-sm text-purple-700 mt-2">
                      Tổng số booking đã ghi nhận
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {highlightCards
                .filter((card) => card.description)
                .map((card) => (
                  <div
                    key={card.title}
                    className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                        {card.title}
                      </p>
                      <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full font-semibold">
                        Insight
                      </span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">
                      {card.description}
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {card.value}
                    </p>
                    <p className="text-sm text-slate-500">{card.meta}</p>
                    {card.id && (
                      <Link
                        to={`/package/${card.id}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Xem tour chi tiết
                        <FaArrowRight className="text-xs" />
                      </Link>
                    )}
                  </div>
                ))}
            </div>

            {itineraryInsights && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-8">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-2">
                    <FaRoute /> Lịch trình nổi bật
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    So sánh trải nghiệm chi tiết giữa các tour
                  </h2>
                  <p className="text-sm text-slate-500">
                    Dựa trên mô tả hoạt động/lịch trình trong từng tour, chúng tôi tổng hợp những điểm nhấn xuất hiện nhiều nhất và tour nào có lịch trình phong phú nhất.
                  </p>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/60">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-4">
                      Hoạt động thường gặp
                    </p>
                    <div className="space-y-3">
                      {itineraryInsights.topHighlights?.length ? (
                        itineraryInsights.topHighlights.map((item) => (
                          <div key={item.highlight}>
                            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                              <span>{item.highlight}</span>
                              <span className="text-blue-600">
                                {item.coverage}% tour
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-200 mt-2">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                style={{ width: `${item.coverage}%` }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400">
                          Chưa đủ dữ liệu hoạt động.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/60 flex flex-col gap-4">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 uppercase">
                        Lịch trình phong phú
                      </p>
                      {itineraryInsights.richestItinerary ? (
                        <div className="mt-2">
                          <p className="text-lg font-semibold text-slate-900">
                            {itineraryInsights.richestItinerary.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {itineraryInsights.richestItinerary.itineraryHighlights.length} hoạt động được mô tả
                          </p>
                          <Link
                            to={`/package/${itineraryInsights.richestItinerary.id}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 mt-2"
                          >
                            Xem lịch trình
                            <FaArrowRight className="text-xs" />
                          </Link>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">Chưa có dữ liệu.</p>
                      )}
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-xs font-semibold text-rose-500 uppercase">
                        Tối giản
                      </p>
                      {itineraryInsights.minimalistItinerary ? (
                        <div className="mt-2">
                          <p className="text-lg font-semibold text-slate-900">
                            {itineraryInsights.minimalistItinerary.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {itineraryInsights.minimalistItinerary.itineraryHighlights.length} hoạt động chính • phù hợp người bận rộn
                          </p>
                          <Link
                            to={`/package/${itineraryInsights.minimalistItinerary.id}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 mt-2"
                          >
                            Xem lịch trình
                            <FaArrowRight className="text-xs" />
                          </Link>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">Chưa có dữ liệu.</p>
                      )}
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/60">
                    <p className="text-xs font-semibold text-indigo-600 uppercase mb-4">
                      Chỉ số tổng quan
                    </p>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500">Số điểm dừng trung bình</p>
                        <p className="text-2xl font-bold text-indigo-700">
                          {itineraryInsights.averageStops || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Hoạt động khác nhau</p>
                        <p className="text-2xl font-bold text-indigo-700">
                          {itineraryInsights.uniqueActivities || 0}
                          <span className="text-base text-slate-400 font-medium">
                            {" "}
                            hoạt động
                          </span>
                        </p>
                      </div>
                      <div className="text-sm text-slate-500">
                        Lịch trình được tổng hợp trực tiếp từ mô tả tour của bạn và sẽ tự động làm mới khi nội dung thay đổi.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-[0.3em]">
                    So sánh nhanh
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    Thông số quan trọng giữa các tour
                  </h2>
                  <p className="text-sm text-slate-500">
                    Sắp xếp theo giá hiệu dụng từ thấp đến cao
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaPlaneDeparture className="text-blue-500" />
                  {comparison?.transportOptions?.join(" • ")}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="pb-4 font-semibold">Tour</th>
                      <th className="pb-4 font-semibold">Giá</th>
                      <th className="pb-4 font-semibold">Điểm</th>
                      <th className="pb-4 font-semibold">Booking</th>
                      <th className="pb-4 font-semibold">Ngày</th>
                      <th className="pb-4 font-semibold">Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages
                      .slice()
                      .sort(
                        (a, b) =>
                          (a.discountPrice || a.price) -
                          (b.discountPrice || b.price)
                      )
                      .map((pkg) => (
                        <tr
                          key={pkg.id}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="py-4">
                            <Link
                              to={`/package/${pkg.id}`}
                              className="text-slate-900 font-semibold hover:text-blue-600"
                            >
                              {pkg.name}
                            </Link>
                          </td>
                          <td className="py-4 font-semibold text-blue-600">
                            {formatCurrency(pkg.discountPrice || pkg.price || 0)}
                          </td>
                          <td className="py-4">{pkg.avgRating || 0} ★</td>
                          <td className="py-4">{pkg.bookingCount || 0}</td>
                          <td className="py-4">
                            {pkg.days}N{pkg.nights}Đ
                          </td>
                          <td className="py-4">
                            <div className="flex flex-wrap gap-2">
                              {pkg.tags?.length ? (
                                pkg.tags.map((tag) => (
                                  <span
                                    key={`${pkg.id}-${tag}`}
                                    className="px-2 py-1 bg-slate-100 text-xs rounded-full text-slate-600 font-semibold"
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-slate-400">
                                  Đang phân tích...
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-[0.3em]">
                    Trải nghiệm nổi bật
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2 mb-4">
                    Chi tiết từng tour theo góc nhìn data
                  </h2>
                  <p className="text-sm text-slate-500">
                    Danh sách này tự động cập nhật khi dữ liệu tour hoặc đánh giá thay đổi. Bạn có thể chuyển sang trang tour để đặt ngay.
                  </p>
                  <div className="mt-6 grid gap-4">
                    {packages.map((pkg) => (
                      <div
                        key={`card-${pkg.id}`}
                        className="flex flex-col md:flex-row gap-4 p-4 border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all"
                      >
                        <div className="w-full md:w-32 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                          {pkg.images?.[0] ? (
                            <img
                              src={pkg.images[0]}
                              alt={pkg.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-3">
                            <Link
                              to={`/package/${pkg.id}`}
                              className="text-lg font-semibold text-slate-900 hover:text-blue-600"
                            >
                              {pkg.name}
                            </Link>
                            <span className="text-sm font-semibold text-blue-600">
                              {formatCurrency(pkg.discountPrice || pkg.price || 0)}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {pkg.days} ngày • {pkg.transportation} •{" "}
                            {pkg.accommodation}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                              {pkg.avgRating || 0} ★ ({pkg.reviewCount || 0})
                            </span>
                            <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold">
                              {pkg.bookingCount || 0} booking
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                pkg.sentimentScore >= 0
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-rose-50 text-rose-600"
                              }`}
                            >
                              Sentiment {pkg.sentimentScore}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {pkg.tags?.map((tag) => (
                              <span
                                key={`card-${pkg.id}-${tag}`}
                                className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-semibold uppercase tracking-wider text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3">
                            <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-widest">
                              Lịch trình tóm tắt
                            </p>
                            {pkg.itineraryHighlights?.length ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {pkg.itineraryHighlights.slice(0, 4).map((step) => (
                                  <span
                                    key={`itinerary-${pkg.id}-${step}`}
                                    className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-blue-50 text-[11px] font-semibold text-slate-600 rounded-full border border-slate-100"
                                  >
                                    {step}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400 mt-1">
                                Chưa có mô tả lịch trình chi tiết.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Blog;

