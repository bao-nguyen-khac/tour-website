import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "./models/user.model.js";
import Package from "./models/package.model.js";
import Booking from "./models/booking.model.js";
import RatingReview from "./models/ratings_reviews.model.js";
import Survey from "./models/Survey.model.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ MONGO_URL is not defined in environment variables.");
  process.exit(1);
}

// Miền Trung Việt Nam – chỉ tập trung các điểm này
const CENTRAL_DESTINATIONS = [
  'Đà Nẵng',
  'Huế',
  'Quảng Nam',
  'Hội An',
  'Nha Trang',
  'Quảng Ngãi'
];

const ACCOMMODATIONS = [
  "Khách sạn 3 sao",
  "Khách sạn 4 sao",
  "Khách sạn 5 sao",
  "Resort cao cấp",
  "Homestay view biển",
  "Villa nguyên căn"
];

const TRANSPORTATIONS = [
  "Máy bay + ô tô",
  "Ô tô giường nằm",
  "Xe limousine",
  "Tàu hỏa",
  "Máy bay khứ hồi"
];

const MEALS = [
  "Sáng buffet, trưa tối set menu",
  "Bao gồm 2 bữa/ngày",
  "Buffet sáng + 1 bữa chính",
  "Tự túc ăn uống"
];

const ACTIVITIES = [
  // Lịch trình Đà Nẵng – Ngũ Hành Sơn – Chùa Linh Ứng
  `- 07:30 – 08:00: Đón khách tại khách sạn trung tâm Đà Nẵng
- 08:15 – 10:00: Tham quan NGŨ HÀNH SƠN, khám phá các hang động và chùa chiền
- 10:00 – 11:00: Di chuyển đến Chùa Linh Ứng – Bãi Bụt
- 11:00 – 12:00: Tham quan tượng Phật Bà Quan Âm, ngắm toàn cảnh biển Sơn Trà
- 12:30 – 13:30: Ăn trưa hải sản / cơm gia đình tại nhà hàng địa phương
- 14:00 – 16:00: CHÙA LINH ỨNG – BÁN ĐẢO SƠN TRÀ, chụp hình lưu niệm
- 16:00 – 16:30: Về lại khách sạn, nghỉ ngơi tự do`,

  // Lịch trình Đà Nẵng – Bà Nà Hills
  `- 07:00 – 07:30: Đón khách tại khách sạn Đà Nẵng
- 08:30 – 09:00: Di chuyển đến khu du lịch Bà Nà Hills
- 09:00 – 11:30: Đi cáp treo, tham quan Cầu Vàng và Làng Pháp
- 11:30 – 13:00: Ăn trưa buffet tại nhà hàng trên Bà Nà
- 13:00 – 15:30: Vui chơi tại Fantasy Park, tham gia các trò chơi mạo hiểm
- 15:30 – 16:30: Tự do chụp hình, thưởng thức cà phê trên đỉnh núi
- 16:30 – 18:00: Xuống cáp treo, quay về lại khách sạn`,

  // Lịch trình Huế – Đại Nội – Chùa Thiên Mụ – Sông Hương
  `- 07:30 – 08:00: Đón khách tại khách sạn trung tâm Huế
- 08:15 – 10:30: Tham quan ĐẠI NỘI HUẾ, Ngọ Môn, Tử Cấm Thành
- 10:30 – 11:30: Ghé thăm Chùa Thiên Mụ, check-in tháp Phước Duyên
- 12:00 – 13:00: Ăn trưa với đặc sản bún bò Huế, bánh bèo - nậm - lọc
- 13:30 – 15:00: Tham quan Lăng Khải Định / Lăng Minh Mạng
- 15:30 – 17:00: Du thuyền nghe ca Huế trên sông Hương, thả đèn hoa đăng
- 17:00: Trả khách về lại khách sạn`,

  // Lịch trình Hội An – Phố cổ – Chùa Cầu – Thuyền trên sông Hoài
  `- 15:00 – 15:30: Đón khách tại khách sạn Đà Nẵng / Hội An
- 16:00 – 17:30: Tham quan PHỐ CỔ HỘI AN, check-in Chùa Cầu, nhà cổ
- 17:30 – 18:30: Thưởng thức cơm gà Hội An / cao lầu / mì Quảng
- 18:30 – 19:30: Đi thuyền trên sông Hoài, thả hoa đăng, chụp ảnh đèn lồng
- 19:30 – 21:00: Tự do dạo phố, mua sắm, thưởng thức cà phê / chè Hội An
- 21:00: Tập trung và di chuyển về khách sạn`,

  // Lịch trình Nha Trang – Đảo – Tắm biển – Hải sản
  `- 08:00 – 08:30: Đón khách tại khách sạn trung tâm Nha Trang
- 09:00 – 11:30: Di chuyển cano tham quan các đảo, tắm biển và lặn ngắm san hô
- 11:30 – 13:00: Ăn trưa hải sản trên đảo / nhà bè
- 13:30 – 15:00: Tự do tắm biển, chơi moto nước / dù bay (chi phí tự túc)
- 15:30 – 16:30: Về lại đất liền, ghé tham quan Tháp Bà Ponagar
- 17:00: Trả khách về khách sạn, kết thúc chương trình`,

  // Lịch trình Quảng Nam – Mỹ Sơn – Làng nghề – Ẩm thực
  `- 07:30 – 08:00: Đón khách tại Đà Nẵng / Hội An
- 09:00 – 11:00: Tham quan THÁNH ĐỊA MỸ SƠN, tìm hiểu văn hóa Chăm Pa
- 11:30 – 12:30: Ăn trưa tại nhà hàng địa phương với đặc sản Quảng Nam
- 13:00 – 14:30: Ghé làng gốm Thanh Hà / làng mộc Kim Bồng (tùy tuyến)
- 15:00 – 16:30: Tự do mua sắm quà lưu niệm, thưởng thức cà phê
- 17:00: Trở về lại điểm đón ban đầu`,
];

const SURVEY_TRAVEL_TYPES = ["Biển", "Núi", "Nghỉ dưỡng", "Khám phá", "Văn hóa"];

const AVATAR_URL =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

// Map rating -> list câu review để random
const RATING_TEXTS = {
  5: [
    "Chuyến đi tuyệt vời vượt ngoài mong đợi, mọi thứ đều rất chuyên nghiệp.",
    "Hướng dẫn viên siêu dễ thương, lịch trình hợp lý, chắc chắn sẽ quay lại.",
    "Dịch vụ hoàn hảo, đồ ăn ngon, cảnh đẹp, trải nghiệm không thể quên.",
    "Rất hài lòng về chất lượng tour, xứng đáng 5 sao.",
  ],
  4: [
    "Chuyến đi rất vui, chỉ cần cải thiện thêm chút về thời gian di chuyển.",
    "Lịch trình hợp lý, giá tốt, đội ngũ hỗ trợ nhiệt tình.",
    "Một số điểm tham quan khá đông nhưng nhìn chung trải nghiệm rất ổn.",
    "Tour phù hợp gia đình, trẻ nhỏ cũng rất thích.",
  ],
  3: [
    "Chuyến đi ổn, một vài khâu tổ chức còn chậm nhưng vẫn chấp nhận được.",
    "Giá hợp lý, dịch vụ trung bình, có thể cân nhắc nếu không quá khắt khe.",
    "Một số hoạt động chưa đúng như mô tả, nhưng tổng thể vẫn được.",
  ],
};

// Dùng các ảnh đã có trong thư mục static/uploads
const PACKAGE_IMAGES = [
  "/static/uploads/1752070229236.png",
  "/static/uploads/1752070408882.png",
  "/static/uploads/1752070450425.jpg",
  "/static/uploads/1752399263322.jpeg",
  "/static/uploads/1752399928505.jpg",
  "/static/uploads/1752997850127.webp",
  "/static/uploads/1752999095273.jpeg",
  "/static/uploads/1763389553857.jpg",
  "/static/uploads/1764042277982.jpg"
];

// Ảnh gợi ý riêng cho từng điểm đến (fallback sang PACKAGE_IMAGES nếu thiếu)
const DESTINATION_IMAGES = {
  "Đà Nẵng": [
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20%C4%91%C3%A0%20n%E1%BA%B5ng/anh-dep-da-nang-thumb.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20%C4%91%C3%A0%20n%E1%BA%B5ng/anh-dep-da-nang-2.jpgg",
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20%C4%91%C3%A0%20n%E1%BA%B5ng/anh-dep-da-nang-3.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20%C4%91%C3%A0%20n%E1%BA%B5ng/anh-dep-da-nang-4.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20%C4%91%C3%A0%20n%E1%BA%B5ng/anh-dep-da-nang-5.jpg",
  ],
  "Huế": [
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20Hu%E1%BA%BF/anh-dep-hue-2.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20Hu%E1%BA%BF/anh-dep-hue-3.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20Hu%E1%BA%BF/anh-dep-hue-4.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20Hu%E1%BA%BF/anh-dep-hue-8.jpg",
  ],
  "Hội An": [
    "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/08/hoi-an-quang-nam-vntrip.jpg",
    "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/08/hoi-an-quang-nam-vntrip-1.jpg",
    "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/08/pho-co-hoi-an-vntrip-2-1.jpg",
    "https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/08/chua-cau-hoi-an-2.jpg",
  ],
  "Quảng Nam": [
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A2nh%20%C4%91%E1%BA%B9p%20Qu%E1%BA%A3ng%20Nam/anh-dep-quang-nam-4.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A2nh%20%C4%91%E1%BA%B9p%20Qu%E1%BA%A3ng%20Nam/anh-dep-quang-nam-9.jpg",
    "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A2nh%20%C4%91%E1%BA%B9p%20Qu%E1%BA%A3ng%20Nam/anh-dep-quang-nam-11.jpg",
  ],
  "Nha Trang": [
    "https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/012025/z6223362576777_15a21ef00a73b25851a3972d86795475_20250113104122.jpg",
    "https://www.vietnamairlines.com/~/media/SEO-images/2025%20SEO/Thay%20Anh%20Traffic%20Tieng%20Viet/nha%20trang%20co%20gi%20choi/toan-canh-vinwonders-nha-trang-voi-cac-khu-tro-choi-va-cap-treo-vuot-bien-nhin-tu-tren-cao",
    "https://vcdn1-dulich.vnecdn.net/2022/05/09/shutterstock-280926449-6744-15-3483-9174-1652070682.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=bGCo6Rv6DseMDE_07TT1Aw",
  ],
  "Quảng Ngãi": [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52ndEsMD0N5ki_KjadSBlo-MbICwuhaov5w&s",
    "https://www.vietnamairlines.com/~/media/SEO-images/du-lich-hue/lang-tu-duc.jpg"
  ]
};

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFutureDate() {
  const now = new Date();
  const future = new Date();
  future.setMonth(future.getMonth() + 6);
  const time =
    now.getTime() + Math.random() * (future.getTime() - now.getTime());
  return new Date(time);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function generateUsers(count = 100) {
  const users = [];
  const passwordHash = await bcrypt.hash("password123", 10);

  for (let i = 0; i <= count; i++) {
    const phoneNumber = `090${String(1000000 + i).slice(0, 7)}`;

    users.push({
      username: `User ${i}`,
      email: `user${i}@example.com`,
      password: passwordHash,
      address: randomItem(CENTRAL_DESTINATIONS),
      phone: phoneNumber,
      avatar: AVATAR_URL,
      user_role: 0
    });
  }

  const created = await User.insertMany(users);
  console.log(`✅ Đã tạo ${created.length} users giả.`);
  return created;
}

async function generatePackages(count = 100) {
  const packages = [];

  for (let i = 0; i <= count; i++) {
    const destination = randomItem(CENTRAL_DESTINATIONS);
    const days = randomInt(3, 7);
    const nights = Math.max(1, days - 1);
    const basePrice = randomInt(3000000, 12000000); // 3M - 12M
    const hasOffer = Math.random() < 0.6;
    const discountPrice = hasOffer
      ? Math.floor(basePrice * (0.8 + Math.random() * 0.15))
      : basePrice;

    // Chọn ảnh ưu tiên theo điểm đến, fallback sang danh sách chung
    const imagePool = DESTINATION_IMAGES[destination] || PACKAGE_IMAGES;
    const imagesCount = randomInt(1, 4);
    const images = [];
    for (let j = 0; j < imagesCount; j++) {
      images.push(randomItem(imagePool));
    }

    packages.push({
      packageName: `Tour ${destination} ${days}N${nights}Đ - Gói ${i}`,
      packageDescription: `Tour khám phá ${destination} ${days} ngày ${nights} đêm, trải nghiệm văn hóa và ẩm thực miền Trung.`,
      packageDestination: destination,
      packageDays: days,
      packageNights: nights,
      packageAccommodation: randomItem(ACCOMMODATIONS),
      packageTransportation: randomItem(TRANSPORTATIONS),
      packageMeals: randomItem(MEALS),
      packageActivities: randomItem(ACTIVITIES),
      packagePrice: basePrice,
      packageDiscountPrice: discountPrice,
      packageOffer: hasOffer,
      packageRating: 0,
      packageTotalRatings: 0,
      packageImages: images
    });
  }

  const created = await Package.insertMany(packages);
  console.log(`✅ Đã tạo ${created.length} tour (package) miền Trung.`);
  return created;
}

async function generateBookings(packages, users, count = 100) {
  const bookings = [];

  for (let i = 0; i < count; i++) {
    const pkg = randomItem(packages);
    const user = randomItem(users);
    const persons = randomInt(1, 5);
    const date = randomFutureDate();
    const totalPrice = pkg.packageDiscountPrice * persons;

    bookings.push({
      packageDetails: pkg._id,
      buyer: user._id,
      totalPrice,
      persons,
      date: formatDate(date),
      status: "Booked"
    });
  }

  const created = await Booking.insertMany(bookings);
  console.log(`✅ Đã tạo ${created.length} lượt đặt tour (booking).`);
  return created;
}

async function generateRatings(count = 20) {
  // Lấy toàn bộ user & package hiện có trong DB
  const users = await User.find({});
  const packages = await Package.find({});

  if (!users.length || !packages.length) {
    console.log("⚠️ Không có user hoặc package trong database, bỏ qua fake rating.");
    return [];
  }

  const ratings = [];

  for (let i = 0; i < count; i++) {
    const pkg = randomItem(packages);
    const user = randomItem(users);
    const ratingValue = randomInt(3, 5); // ưu tiên rating tốt

    const reviewOptions = RATING_TEXTS[ratingValue] || RATING_TEXTS[4];
    const reviewText = randomItem(reviewOptions);

    ratings.push({
      rating: ratingValue,
      review: reviewText,
      packageId: pkg._id.toString(),
      userRef: user._id.toString(),
      username: user.username,
      userProfileImg: user.avatar || AVATAR_URL
    });
  }

  const created = await RatingReview.insertMany(ratings);
  console.log(`✅ Đã tạo ${created.length} rating & review (fake) cho các tour hiện có.`);

  // Cập nhật lại điểm rating/tổng số rating cho các tour đã được fake
  const touchedPackageIds = [
    ...new Set(ratings.map((r) => r.packageId)),
  ];

  const agg = await RatingReview.aggregate([
    { $match: { packageId: { $in: touchedPackageIds } } },
    {
      $group: {
        _id: "$packageId",
        avgRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  const bulkOps = agg.map((item) => ({
    updateOne: {
      filter: { _id: item._id },
      update: {
        $set: {
          packageRating: Number(item.avgRating.toFixed(1)),
          packageTotalRatings: item.totalRatings,
        },
      },
    },
  }));

  if (bulkOps.length > 0) {
    await Package.bulkWrite(bulkOps);
    console.log("✅ Đã cập nhật lại điểm rating cho các tour đã được fake.");
  }

  return created;
}

async function generateSurveys(count = 100) {
  const surveys = [];

  for (let i = 0; i < count; i++) {
    const destination = randomItem(CENTRAL_DESTINATIONS);
    const stayDurationDays = randomInt(1, 7);
    const transportation = randomItem(TRANSPORTATIONS);
    const numPersons = randomInt(1, 10);
    const travelType = randomItem(SURVEY_TRAVEL_TYPES);

    // ~70% survey có userRef, còn lại là khách chưa đăng ký
    const hasUser = Math.random() > 0.3;
    // const user = hasUser ? randomItem(users) : null;

    surveys.push({
      destination,
      stayDurationDays,
      transportation,
      numPersons,
      travelType,
      userRef: null
    });
  }

  const created = await Survey.insertMany(surveys);
  console.log(`✅ Đã tạo ${created.length} survey giả (khảo sát).`);
  return created;
}

async function main() {
  try {
    console.log("🔌 Kết nối MongoDB...");
    await mongoose.connect(MONGO_URL);
    console.log("✅ Đã kết nối MongoDB.");

    console.log("⚠️ Xóa dữ liệu cũ liên quan đến fake data (user, package, booking, rating) sẽ KHÔNG được thực hiện tự động.");
    console.log("   Script này chỉ thêm mới 100 user, 100 tour, 100 booking, 100 rating, 100 survey.");

    // const users = await generateUsers(100);
    // const packages = await generatePackages(100);
    // await generateBookings(packages, users, 100);
    await generateRatings(20);
    // await generateSurveys(100);

    console.log("🎉 Hoàn tất seed dữ liệu giả.");
  } catch (err) {
    console.error("❌ Lỗi khi seed dữ liệu:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Đã ngắt kết nối MongoDB.");
    process.exit(0);
  }
}

main();

