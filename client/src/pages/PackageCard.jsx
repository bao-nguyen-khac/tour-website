import React from "react";
import { FaClock, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

const PackageCard = ({ packageData }) => {
  const hasDaysOrNights = (+packageData.packageDays > 0 || +packageData.packageNights > 0);
  const showOffer = packageData.packageOffer && packageData.packageDiscountPrice > 0;

  return (
    <Link to={`/package/${packageData._id}`} className="w-full">
      <div className="w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
        {/* Image area */}
        <div className="relative w-full h-[230px] overflow-hidden">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={packageData.packageImages[0]}
            alt="Hình ảnh tour du lịch"
          />
          {/* Rating Stars overlay */}
          {packageData.packageRating > 0 && (
            <div className="absolute left-3 top-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 text-xs">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">{packageData.packageRating.toFixed(1)}</span>
              <span className="text-slate-500">({packageData.packageTotalRatings})</span>
            </div>
          )}
          {/* Price badge */}
          <div className="absolute right-0 bottom-0">
            {showOffer ? (
              <div className="bg-blue-600 text-white px-4 py-2 rounded-tl-xl">
                <span className="line-through opacity-80 mr-2 text-sm">
                  {formatCurrency(packageData.packagePrice)}
                </span>
                <span className="font-bold">
                  {formatCurrency(packageData.packageDiscountPrice)}
                </span>
              </div>
            ) : (
              <div className="bg-blue-600 text-white px-4 py-2 rounded-tl-xl font-bold">
                {formatCurrency(packageData.packagePrice)}
              </div>
            )}
          </div>
          {/* Offer ribbon */}
          {showOffer && (
            <div className="absolute -right-12 top-4 rotate-45 bg-pink-600 text-white text-xs font-semibold px-12 py-1 shadow-md">
              Ưu đãi
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="font-semibold text-lg capitalize truncate">
            {packageData.packageName}
          </p>
          <p className="text-slate-500 capitalize">{packageData.packageDestination}</p>

          {hasDaysOrNights && (
            <p className="flex items-center gap-2 mt-2 text-slate-700">
              <FaClock />
              {+packageData.packageDays > 0 && `${packageData.packageDays} Ngày`}
              {+packageData.packageDays > 0 && +packageData.packageNights > 0 && " - "}
              {+packageData.packageNights > 0 && `${packageData.packageNights} Đêm`}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
