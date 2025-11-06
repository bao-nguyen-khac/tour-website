import aboutImg from "../assets/images/about_img.png";
import { FaExternalLinkAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[90%] max-w-2xl rounded-xl shadow-xl p-3 flex flex-col gap-3">
        <h1 className="text-4xl text-center font-semibold">Giới thiệu</h1>
        <div className="w-max flex flex-col">
          <img src={aboutImg} className="w-40 h-40" alt="Hình ảnh" />
          <h1 className="text-xl font-semibold text-center">BaoNK</h1>
        </div>
        <ul className="list-disc w-max mx-5">
          <li className="hover:underline hover:text-blue-600 cursor-pointer">
            <a
              className="flex items-center gap-2"
              href=""
              target="_blank"
            >
              Git-Hub <FaExternalLinkAlt />
            </a>
          </li>
          <li className="hover:underline hover:text-blue-600 cursor-pointer">
            <a
              className="flex items-center gap-2"
              href=""
              target="_blank"
            >
              LinkedIn <FaExternalLinkAlt />
            </a>
          </li>
        </ul>
        <p>
          Đây là dự án du lịch giúp bạn tìm kiếm, đặt tour và quản lý chuyến đi một cách dễ dàng. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
        </p>
      </div>
    </div>
  );
};

export default About;
