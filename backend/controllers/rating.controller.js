import Package from "../models/package.model.js";
import RatingReview from "../models/ratings_reviews.model.js";

export const giveRating = async (req, res) => {
  if (req.user.id !== req.body.userRef) {
    return res.status(401).send({
      success: false,
      message: "Bạn chỉ có thể đánh giá trên tài khoản của mình!",
    });
  }
  try {
    const newRating = await RatingReview.create(req.body);
    if (newRating) {
      const ratings = await RatingReview.find({
        packageId: req.body.packageId,
      });

      let totalRatings = ratings.length;
      let totalStars = 0;
      ratings.map((rating) => {
        totalStars += rating.rating;
      });
      let average_rating =
        (Math.round((totalStars / totalRatings) * 10)) / 10;
      // console.log("total ratings: " + totalRatings);
      // console.log("total stars: " + totalStars);
      // console.log("average: " + average_rating);

      const setPackageRatings = await Package.findByIdAndUpdate(
        req.body.packageId,
        {
          $set: {
            packageRating: average_rating,
            packageTotalRatings: totalRatings,
          },
        },
        { new: true }
      );

      // console.log(setPackageRatings);

      if (setPackageRatings) {
        return res.status(201).send({
          success: true,
          message: "Cảm ơn phản hồi của bạn!",
        });
      } else {
        return res.status(500).send({
          success: false,
          message: "Đã xảy ra lỗi khi đánh giá tour du lịch!",
        });
      }
    } else {
      return res.status(500).send({
        success: false,
        message: "Đã xảy ra lỗi",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const ratingGiven = async (req, res) => {
  try {
    const rating_given = await RatingReview.findOne({
      userRef: req?.params?.userId,
      packageId: req?.params?.packageId,
    });
    if (rating_given) {
      return res.status(200).send({
        given: true,
      });
    } else {
      return res.status(200).send({
        given: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const averageRating = async (req, res) => {
  try {
    const ratings = await RatingReview.find({ packageId: req?.params?.id });
    let totalStars = 0;
    ratings.map((rating) => {
      totalStars += rating.rating;
    });
    let average = Math.round((totalStars / ratings.length) * 10) / 10;
    if (ratings.length) {
      res.status(200).send({
        rating: average,
        totalRatings: ratings.length,
      });
    } else {
      res.status(200).send({
        rating: 0,
        totalRatings: 0,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllRatings = async (req, res) => {
  try {
    const ratings = await RatingReview.find({
      packageId: req?.params?.id,
    })
      .limit(req?.params?.limit)
      .sort({ createdAt: -1 });
    if (ratings) {
      return res.send(ratings);
    } else {
      return res.send("N/A");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getLatestRatings = async (req, res) => {
  try {
    const limit = parseInt(req?.query?.limit) || 10;
    const ratings = await RatingReview.find({})
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
    
    // Lấy thông tin package để có tên tour
    const ratingsWithPackage = await Promise.all(
      ratings.map(async (rating) => {
        try {
          const packageInfo = await Package.findById(rating.packageId).select("packageName packageDestination").lean();
          return {
            ...rating,
            packageName: packageInfo?.packageName || "Tour không xác định",
            packageDestination: packageInfo?.packageDestination || "",
          };
        } catch (err) {
          // Nếu không tìm thấy package, vẫn trả về rating nhưng không có package info
          return {
            ...rating,
            packageName: "Tour không xác định",
            packageDestination: "",
          };
        }
      })
    );

    return res.status(200).send({
      success: true,
      ratings: ratingsWithPackage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Đã xảy ra lỗi khi lấy đánh giá!",
    });
  }
};
