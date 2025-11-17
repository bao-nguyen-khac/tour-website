import { Rating } from "@mui/material";
import React, { useState } from "react";
import defaultProfileImg from "../assets/images/profile.png";

const RatingCard = ({ packageRatings = [] }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!packageRatings.length) {
    return (
      <div className="text-center text-slate-500 py-8">
        Chưa có đánh giá nào được hiển thị.
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {packageRatings.map((rating) => {
        const reviewText = rating?.review || "";
        const isLongReview = reviewText.length > 180;
        const isExpanded = expandedId === rating?._id;
        const displayedReview =
          reviewText === ""
            ? rating?.rating < 3
              ? "Trải nghiệm chưa tốt, cần cải thiện."
              : "Chuyến đi tuyệt vời!"
            : isExpanded || !isLongReview
            ? reviewText
            : `${reviewText.substring(0, 180)}...`;

        return (
          <div
            key={rating?._id || rating?.createdAt}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={rating?.userProfileImg || defaultProfileImg}
                alt={rating?.username || "Người dùng"}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="font-semibold text-slate-900">{rating?.username || "Ẩn danh"}</p>
                <p className="text-xs text-slate-500">{rating?.createdAt ? new Date(rating.createdAt).toLocaleDateString("vi-VN") : ""}</p>
              </div>
            </div>

            <Rating value={rating?.rating || 0} readOnly size="small" precision={0.1} />

            <p className="text-sm text-slate-600 leading-relaxed">{displayedReview}</p>

            {isLongReview && (
              <button
                type="button"
                onClick={() => toggleExpand(rating?._id)}
                className="self-start text-sm font-semibold text-blue-600 hover:text-blue-500"
              >
                {isExpanded ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>
        );
      })}
    </>
  );
};

export default RatingCard;
