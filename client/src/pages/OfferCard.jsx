import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaClock } from "react-icons/fa";

const OfferCard = ({ pkg }) => {
  const hasDaysOrNights = (+pkg.packageDays > 0 || +pkg.packageNights > 0);
  const showOffer = pkg.packageOffer && pkg.packageDiscountPrice > 0;

  return (
    <Link to={`/package/${pkg._id}`} className="w-full">
      <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all">
        {/* Image */}
        <div className="relative h-48 w-full">
          <img src={pkg.packageImages?.[0]} alt={pkg.packageName} className="h-full w-full object-cover" />

          {/* rating small stars */}
          {pkg.packageRating > 0 && (
            <div className="absolute left-3 top-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 text-xs">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">{pkg.packageRating?.toFixed(1)}</span>
            </div>
          )}

          {/* circular price badge */}
          {showOffer ? (
            <div className="absolute right-3 top-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-pink-400 to-pink-600 text-white flex flex-col items-center justify-center shadow-lg">
                <span className="text-sm font-bold">{pkg.packageDiscountPrice}₫</span>
                <span className="text-[10px] line-through opacity-80">{pkg.packagePrice}₫</span>
              </div>
            </div>
          ) : (
            <div className="absolute right-3 top-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 text-white flex flex-col items-center justify-center shadow-lg">
                <span className="text-sm font-bold">{pkg.packagePrice}₫</span>
              </div>
            </div>
          )}
        </div>

        {/* body */}
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{pkg.packageName}</h3>
          <p className="text-slate-500 text-sm line-clamp-2 mt-1">{pkg.packageDescription}</p>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <FaClock />
            {hasDaysOrNights ? (
              <span>
                {+pkg.packageDays > 0 && `${pkg.packageDays} ngày`}
                {+pkg.packageDays > 0 && +pkg.packageNights > 0 && " • "}
                {+pkg.packageNights > 0 && `${pkg.packageNights} đêm`}
              </span>
            ) : (
              <span>Thời lượng linh hoạt</span>
            )}
          </div>
          {pkg.packageTotalRatings > 0 && (
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span>{pkg.packageRating?.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default OfferCard;


