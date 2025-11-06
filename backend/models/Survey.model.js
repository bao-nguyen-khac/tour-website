import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    destination: { type: String, required: true, trim: true },
    stayDurationDays: { type: Number, required: true, min: 1 },
    transportation: { type: String, required: true, trim: true },
    numPersons: { type: Number, required: true, min: 1 },
    travelType: { type: String, required: true, trim: true },
    userRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Survey", surveySchema);
