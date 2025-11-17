import { Rating } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RatingCard from "./RatingCard";
import Cookies from "js-cookie";
import { FaArrowLeft } from "react-icons/fa";

const RatingsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [packageRatings, setPackageRatings] = useState([]);
  const [showRatingStars, setShowRatingStars] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  const getRatings = async () => {
    try {
      setLoading(true);
      const [res, res2] = await Promise.all([
        fetch(`${apiUrl}/api/rating/get-ratings/${params.id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }),
        fetch(`${apiUrl}/api/rating/average-rating/${params.id}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }),
      ]);
      const [data, data2] = await Promise.all([res.json(), res2.json()]);

      setPackageRatings(Array.isArray(data) ? data : []);
      setShowRatingStars(data2?.rating || 0);
      setTotalRatings(data2?.totalRatings || (Array.isArray(data) ? data.length : 0));
    } catch (error) {
      console.log(error);
      setPackageRatings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) getRatings();
  }, [params.id]);

  const averageLabel = useMemo(() => {
    if (totalRatings === 0) return "Chưa có đánh giá";
    if (showRatingStars >= 4.5) return "Xuất sắc";
    if (showRatingStars >= 3.5) return "Rất tốt";
    if (showRatingStars >= 2.5) return "Khá";
    return "Cần cải thiện";
  }, [showRatingStars, totalRatings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/package/${params?.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <FaArrowLeft />
            Quay lại tour
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-white/40 p-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-500">Đánh giá từ khách hàng</p>
              <h1 className="text-3xl font-bold text-slate-900 mt-2">Tổng quan đánh giá</h1>
            </div>
            <div className="flex items-center gap-3">
              <Rating value={showRatingStars || 0} readOnly precision={0.1} size="large" />
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {Number(showRatingStars || 0).toFixed(1)}
                </p>
                <p className="text-sm text-slate-500">{averageLabel}</p>
              </div>
              <div className="text-sm text-slate-500 ml-4">{totalRatings} đánh giá</div>
            </div>
          </div>

          {loading && <div className="text-center text-slate-500 py-10">Đang tải đánh giá...</div>}

          {!loading && packageRatings.length === 0 && (
            <div className="text-center text-slate-500 py-10 border border-dashed rounded-2xl">
              Chưa có đánh giá nào cho tour này.
            </div>
          )}

          {!loading && packageRatings.length > 0 && (
            <div className="grid gap-4">
              <RatingCard packageRatings={packageRatings} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingsPage;
