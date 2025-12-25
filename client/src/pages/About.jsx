import aboutImg from "../assets/images/about_img.png";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaSearch,
  FaCalendarCheck,
  FaStar,
  FaUsers,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

const About = () => {
  const features = [
    {
      icon: <FaSearch className="text-3xl" />,
      title: "Tìm kiếm Tour",
      description: "Khám phá hàng ngàn tour du lịch với bộ lọc thông minh",
    },
    {
      icon: <FaCalendarCheck className="text-3xl" />,
      title: "Đặt Tour Dễ Dàng",
      description: "Quy trình đặt tour đơn giản, nhanh chóng và an toàn",
    },
    {
      icon: <FaStar className="text-3xl" />,
      title: "Đánh Giá Thực Tế",
      description: "Xem đánh giá từ khách hàng đã trải nghiệm tour",
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: "Quản Lý Tài Khoản",
      description: "Theo dõi lịch sử đặt tour và quản lý thông tin cá nhân",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Giới thiệu
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Nền tảng du lịch hiện đại giúp bạn khám phá thế giới một cách dễ dàng
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 -mt-10 relative z-10">
        {/* About Project Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                Về Dự Án
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Đây là dự án du lịch được xây dựng với công nghệ MERN Stack, giúp bạn
                tìm kiếm, đặt tour và quản lý chuyến đi một cách dễ dàng và thuận tiện.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho khách hàng với
                giao diện thân thiện, thông tin chi tiết và dịch vụ chuyên nghiệp.
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <FaHeart className="text-red-500" />
                <span>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-2xl opacity-30" />
                <img
                  src={aboutImg}
                  alt="About"
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl object-cover shadow-xl border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
            Tính Năng Nổi Bật
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
              >
                <div className="flex justify-center mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nhà Phát Triển</h2>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl" />
                <img
                  src={aboutImg}
                  alt="Developer"
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-white/50 shadow-xl"
                />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Bach Tien Nguyen</h3>
            <p className="text-blue-100 text-lg">Developer</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold border border-white/30 hover:scale-105"
            >
              <FaGithub className="text-2xl" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold border border-white/30 hover:scale-105"
            >
              <FaLinkedin className="text-2xl" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://portfolio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold border border-white/30 hover:scale-105"
            >
              <FaGlobe className="text-2xl" />
              <span>Portfolio</span>
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-100">
            <FaMapMarkerAlt className="text-4xl text-blue-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-800 mb-1">50+</h3>
            <p className="text-slate-600">Điểm đến</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-100">
            <FaUsers className="text-4xl text-green-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-800 mb-1">1000+</h3>
            <p className="text-slate-600">Khách hàng</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-100">
            <FaStar className="text-4xl text-yellow-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-800 mb-1">4.8</h3>
            <p className="text-slate-600">Đánh giá</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-100">
            <FaCalendarCheck className="text-4xl text-purple-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-800 mb-1">500+</h3>
            <p className="text-slate-600">Tour đã đặt</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
