import express from "express";
import { getBlogByDestination } from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/destination/:destination", getBlogByDestination);

export default router;

