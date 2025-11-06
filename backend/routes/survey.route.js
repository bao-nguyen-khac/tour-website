import express from "express";
import { createSurvey, listSurveys, getSurveyStats } from "../controllers/survey.controller.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", requireSignIn, createSurvey);
router.get("/", requireSignIn, isAdmin, listSurveys);
router.get("/stats", requireSignIn, isAdmin, getSurveyStats);

export default router;
