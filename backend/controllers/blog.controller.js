import Package from "../models/package.model.js";
import Booking from "../models/booking.model.js";
import RatingReview from "../models/ratings_reviews.model.js";

const buildRegex = (value) => {
  return new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
};

const extractItineraryHighlights = (text = "") => {
  if (!text) return [];
  return Array.from(
    new Set(
      text
        .split(/[\n\r•\-]+|,|;/)
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 2)
    )
  ).slice(0, 8);
};

export const getBlogByDestination = async (req, res) => {
  try {
    const { destination } = req.params;

    if (!destination) {
      return res.status(400).send({
        success: false,
        message: "Thiếu tham số điểm đến!",
      });
    }

    const normalizedDestination = decodeURIComponent(destination).trim();

    const packages = await Package.find({
      packageDestination: buildRegex(normalizedDestination),
    });

    if (!packages.length) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy tour cho địa điểm này!",
      });
    }

    const packageIds = packages.map((pkg) => pkg._id);
    const packageIdStrings = packageIds.map((id) => id.toString());

    const [bookingStats, ratingStats] = await Promise.all([
      Booking.aggregate([
        {
          $match: {
            packageDetails: {
              $in: packageIds,
            },
          },
        },
        {
          $group: {
            _id: "$packageDetails",
            totalBookings: { $sum: 1 },
          },
        },
      ]),
      RatingReview.aggregate([
        {
          $match: {
            packageId: { $in: packageIdStrings },
          },
        },
        {
          $group: {
            _id: "$packageId",
            avgRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
            positiveReviews: {
              $sum: {
                $cond: [{ $gte: ["$rating", 4] }, 1, 0],
              },
            },
            negativeReviews: {
              $sum: {
                $cond: [{ $lte: ["$rating", 2] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    const bookingMap = bookingStats.reduce((acc, item) => {
      acc[item._id.toString()] = item.totalBookings;
      return acc;
    }, {});

    const ratingMap = ratingStats.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});

    const effectivePrices = packages.map(
      (pkg) => pkg.packageDiscountPrice || pkg.packagePrice
    );
    const minEffectivePrice = Math.min(...effectivePrices);
    const maxEffectivePrice = Math.max(...effectivePrices);
    const minDays = Math.min(...packages.map((pkg) => pkg.packageDays));
    const maxDays = Math.max(...packages.map((pkg) => pkg.packageDays));

    const enrichedPackages = packages.map((pkg) => {
      const id = pkg._id.toString();
      const ratingInfo = ratingMap[id] || {};
      const bookingCount = bookingMap[id] || 0;
      const avgRating =
        ratingInfo?.avgRating ?? pkg.packageRating ?? 0;
      const reviewCount =
        ratingInfo?.reviewCount ?? pkg.packageTotalRatings ?? 0;
      const effectivePrice = pkg.packageDiscountPrice || pkg.packagePrice;
      const sentimentScore =
        reviewCount > 0
          ? (ratingInfo.positiveReviews - ratingInfo.negativeReviews) /
            reviewCount
          : 0;

      const tags = [];
      if (effectivePrice <= minEffectivePrice) {
        tags.push("Giá tốt");
      }
      if (avgRating >= 4.5) {
        tags.push("Đánh giá cao");
      }
      if (bookingCount > 5) {
        tags.push("Phổ biến");
      }

      let itineraryHighlights = extractItineraryHighlights(
        pkg.packageActivities
      );
      if (!itineraryHighlights.length) {
        itineraryHighlights = extractItineraryHighlights(
          pkg.packageDescription
        );
      }

      return {
        id,
        name: pkg.packageName,
        destination: pkg.packageDestination,
        accommodation: pkg.packageAccommodation,
        transportation: pkg.packageTransportation,
        activities: pkg.packageActivities,
        description: pkg.packageDescription,
        days: pkg.packageDays,
        nights: pkg.packageNights,
        price: pkg.packagePrice,
        discountPrice: pkg.packageDiscountPrice,
        offer: pkg.packageOffer,
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount,
        bookingCount,
        sentimentScore: Number(sentimentScore.toFixed(2)),
        images: pkg.packageImages?.slice(0, 3) || [],
        itineraryHighlights,
        tags,
      };
    });

    const itineraryFrequencyMap = {};
    enrichedPackages.forEach((pkg) => {
      pkg.itineraryHighlights.forEach((highlight) => {
        itineraryFrequencyMap[highlight] =
          (itineraryFrequencyMap[highlight] || 0) + 1;
      });
    });

    const itineraryHighlightsSorted = Object.entries(itineraryFrequencyMap)
      .map(([highlight, count]) => ({
        highlight,
        count,
        coverage: Number(((count / packages.length) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count);

    const richestItinerary = [...enrichedPackages]
      .sort((a, b) => b.itineraryHighlights.length - a.itineraryHighlights.length)
      .find((pkg) => pkg.itineraryHighlights.length);

    const minimalistItinerary = [...enrichedPackages]
      .filter((pkg) => pkg.itineraryHighlights.length)
      .sort((a, b) => a.itineraryHighlights.length - b.itineraryHighlights.length)[0];

    const averageStops =
      packages.length > 0
        ? Number(
            (
              enrichedPackages.reduce(
                (sum, pkg) => sum + pkg.itineraryHighlights.length,
                0
              ) / packages.length
            ).toFixed(1)
          )
        : 0;

    const sortedByPrice = [...enrichedPackages].sort(
      (a, b) =>
        (a.discountPrice || a.price) - (b.discountPrice || b.price)
    );
    const sortedByRating = [...enrichedPackages].sort(
      (a, b) => b.avgRating - a.avgRating
    );
    const sortedByBookings = [...enrichedPackages].sort(
      (a, b) => b.bookingCount - a.bookingCount
    );

    const totalEffectivePrice = enrichedPackages.reduce(
      (sum, pkg) => sum + (pkg.discountPrice || pkg.price),
      0
    );
    const totalRatings = enrichedPackages.reduce(
      (sum, pkg) => sum + pkg.avgRating,
      0
    );
    const totalReviews = enrichedPackages.reduce(
      (sum, pkg) => sum + pkg.reviewCount,
      0
    );

    const responsePayload = {
      destination: normalizedDestination,
      totalPackages: packages.length,
      summary: {
        averagePrice:
          packages.length > 0
            ? Math.round((totalEffectivePrice / packages.length) * 100) / 100
            : 0,
        averageRating:
          packages.length > 0
            ? Math.round((totalRatings / packages.length) * 10) / 10
            : 0,
        totalReviews,
        cheapestPackage: sortedByPrice[0],
        premiumPackage: sortedByPrice[sortedByPrice.length - 1],
        topRated: sortedByRating[0],
        mostPopular: sortedByBookings[0],
      },
      comparison: {
        priceRange: {
          min: minEffectivePrice,
          max: maxEffectivePrice,
        },
        durationRange: {
          minDays,
          maxDays,
        },
        transportOptions: [
          ...new Set(packages.map((pkg) => pkg.packageTransportation)),
        ],
      },
      packages: enrichedPackages,
      itineraryInsights: {
        topHighlights: itineraryHighlightsSorted.slice(0, 6),
        averageStops,
        richestItinerary: richestItinerary || null,
        minimalistItinerary: minimalistItinerary || null,
        uniqueActivities: itineraryHighlightsSorted.length,
      },
    };

    return res.status(200).send({
      success: true,
      data: responsePayload,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi tạo blog so sánh!",
    });
  }
};

