import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  braintreeTokenController,
  createPackage,
  deletePackage,
  getPackageData,
  getPackages,
  recommendPackages,
  updatePackage,
} from "../controllers/package.controller.js";
import upload from "../utils/multer.config.js";

const router = express.Router();

//create package
router.post("/create-package", requireSignIn, isAdmin, upload.single("image"), createPackage);

//update package by id
router.put("/update-package/:id", requireSignIn, isAdmin, upload.single("image"), updatePackage);

//delete package by id
router.delete("/delete-package/:id", requireSignIn, isAdmin, deletePackage);

//get all packages
router.get("/get-packages", getPackages);

//recommend packages
router.post("/recommend-packages", recommendPackages);

//get single package data by id
router.get("/get-package-data/:id", getPackageData);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

// Upload image API
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  // Trả về URL file static
  const url = `/static/uploads/${req.file.filename}`;
  res.json({ success: true, url });
});

export default router;
