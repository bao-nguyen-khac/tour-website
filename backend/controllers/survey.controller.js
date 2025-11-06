import Survey from "../models/Survey.model.js";

export const createSurvey = async (req, res) => {
  try {
    const { destination, stayDurationDays, transportation, numPersons, travelType } = req.body;
    if (!destination || !stayDurationDays || !transportation || !numPersons || !travelType) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin khảo sát" });
    }
    const survey = await Survey.create({
      destination,
      stayDurationDays,
      transportation,
      numPersons,
      travelType,
      userRef: req.user?._id,
    });
    return res.status(201).json({ success: true, message: "Gửi khảo sát thành công", survey });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const listSurveys = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Survey.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Survey.countDocuments({}),
    ]);
    return res.status(200).json({ success: true, items, total, page, limit });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const getSurveyStats = async (req, res) => {
  try {
    const [byTransportation, byTravelType, byDestination, totals] = await Promise.all([
      Survey.aggregate([{ $group: { _id: "$transportation", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Survey.aggregate([{ $group: { _id: "$travelType", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Survey.aggregate([{ $group: { _id: "$destination", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Survey.aggregate([
        { $group: { _id: null, totalPersons: { $sum: "$numPersons" }, totalSurveys: { $sum: 1 }, avgStay: { $avg: "$stayDurationDays" } } },
      ]),
    ]);
    const summary = totals[0] || { totalPersons: 0, totalSurveys: 0, avgStay: 0 };
    return res.status(200).json({ success: true, byTransportation, byTravelType, byDestination, summary });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};
