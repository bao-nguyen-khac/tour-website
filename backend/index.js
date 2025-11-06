import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import packageRoute from "./routes/package.route.js";
import ratingRoute from "./routes/rating.route.js";
import bookingRoute from "./routes/booking.route.js";
import surveyRoute from "./routes/survey.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

const app = express();
dotenv.config();

const __dirname = path.resolve();

console.log('🤖 ~ process.env.MONGO_URL:', process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

app.use(cors('*'));

app.use(express.json());
app.use(cookieParser());

// Serve static files from /static
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/package", packageRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/survey", surveyRoute);

if (process.env.NODE_ENV_CUSTOM === "production") {
  //static files
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
} else {
  // //rest api
  app.use("/", (req, res) => {
    res.send("Welcome to travel and tourism app");
  });
}

//port
app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
