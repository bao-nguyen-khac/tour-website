import express from "express";
import { getBookingHistory } from "../controllers/booking.controller.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/get-all-history", requireSignIn, isAdmin, getBookingHistory);

export default router;

