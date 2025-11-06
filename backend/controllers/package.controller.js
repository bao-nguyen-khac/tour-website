import Package from "../models/package.model.js";
import braintree from "braintree";
import dotenv from "dotenv";
import Booking from "../models/booking.model.js";
dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//create package
export const createPackage = async (req, res) => {
  try {
    const {
      packageName,
      packageDescription,
      packageDestination,
      packageDays,
      packageNights,
      packageAccommodation,
      packageTransportation,
      packageMeals,
      packageActivities,
      packagePrice,
      packageDiscountPrice,
      packageOffer,
      packageImages,
    } = req.body;

    if (
      !packageName ||
      !packageDescription ||
      !packageDestination ||
      !packageAccommodation ||
      !packageTransportation ||
      !packageMeals ||
      !packageActivities ||
      !packageOffer === "" ||
      !packageImages
    ) {
      return res.status(200).send({
        success: false,
        message: "Tất cả các trường đều bắt buộc!",
      });
    }
    if (packagePrice < packageDiscountPrice) {
      return res.status(200).send({
        success: false,
        message: "Giá thường phải lớn hơn giá khuyến mãi!",
      });
    }
    if (packagePrice <= 0 || packageDiscountPrice < 0) {
      return res.status(200).send({
        success: false,
        message: "Giá phải lớn hơn 0!",
      });
    }
    if (packageDays <= 0 && packageNights <= 0) {
      return res.status(200).send({
        success: false,
        message: "Vui lòng cung cấp số ngày và đêm!",
      });
    }

    const newPackage = await Package.create(req.body);
    if (newPackage) {
      return res.status(201).send({
        success: true,
        message: "Tạo tour du lịch thành công",
      });
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

//get all packages
export const getPackages = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const packages = await Package.find({
      $or: [
        { packageName: { $regex: searchTerm, $options: "i" } },
        { packageDestination: { $regex: searchTerm, $options: "i" } },
      ],
      packageOffer: offer,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    if (packages) {
      return res.status(200).send({
        success: true,
        packages,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Chưa có tour du lịch nào",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//get package data
export const getPackageData = async (req, res) => {
  try {
    const packageData = await Package.findById(req?.params?.id);
    if (!packageData) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy tour du lịch!",
      });
    }
    return res.status(200).send({
      success: true,
      packageData,
    });
  } catch (error) {
    console.log(error);
  }
};

// recommend packages
export const recommendPackages = async (req, res) => {
  try {
    const {
      destination,
      days,
      budgetMin,
      budgetMax,
      category,
      sort,
      order,
      limit,
      startIndex,
    } = req.body || {};

    const mongoQuery = {};
    if (destination) {
      mongoQuery.packageDestination = { $regex: destination, $options: "i" };
    }
    if (days) {
      mongoQuery.packageDays = { $lte: Number(days) };
    }
    const priceQuery = {};
    if (budgetMin) priceQuery.$gte = Number(budgetMin);
    if (budgetMax) priceQuery.$lte = Number(budgetMax);
    if (Object.keys(priceQuery).length) {
      mongoQuery.packagePrice = priceQuery;
    }
    // if (category) {
    //   mongoQuery.packageCategory = { $regex: category, $options: "i" };
    // }

    const sortField = sort || "packageRating";
    const sortOrder = order === "asc" ? 1 : -1;
    const parsedLimit = parseInt(limit) || 12;
    const parsedStartIndex = parseInt(startIndex) || 0;

    console.log('🤖 ~ recommendPackages ~ mongoQuery:', mongoQuery);
    const packages = await Package.find(mongoQuery)
      .sort({ [sortField]: sortOrder })
      .limit(parsedLimit)
      .skip(parsedStartIndex);

    return res.status(200).send({ success: true, packages });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

//update package
export const updatePackage = async (req, res) => {
  try {
    const findPackage = await Package.findById(req.params.id);
    if (!findPackage)
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy tour du lịch!",
      });

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Cập nhật tour du lịch thành công!",
      updatedPackage,
    });
  } catch (error) {
    console.log(error);
  }
};

//delete package
export const deletePackage = async (req, res) => {
  try {
    const deletePackage = await Package.findByIdAndDelete(req?.params?.id);
    return res.status(200).send({
      success: true,
      message: "Đã xóa tour du lịch!",
    });
  } catch (error) {
    cnsole.log(error);
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
