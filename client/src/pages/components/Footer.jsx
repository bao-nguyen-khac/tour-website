import React from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full">
      {/* <div className="bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center">
        <div className="bg-sky-900/60">
          <div className="max-w-6xl mx-auto py-12 px-3 text-center text-white">
            <h3 className="text-3xl font-bold mb-2">JOIN THE NEWSLETTER</h3>
            <p className="italic mb-6">To receive our best monthly deals</p>
            <div className="flex gap-3 max-w-3xl mx-auto">
              <input className="flex-1 p-3 rounded-lg text-slate-800" placeholder="Your email address" />
              <button className="bg-green-500 hover:bg-green-600 text-white px-5 rounded-lg">SUBSCRIBE</button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="bg-slate-800 text-slate-200">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8 py-10 px-3">
          <div>
            <h4 className="uppercase tracking-wide text-sm text-slate-400 mb-3">Về chúng tôi</h4>
            <p className="text-sm text-slate-300">
              Chúng tôi là một nhóm nhỏ đam mê du lịch, mang đến những trải nghiệm tuyệt vời và đáng nhớ.
            </p>
          </div>
          <div>
            <h4 className="uppercase tracking-wide text-sm text-slate-400 mb-3">Bài viết mới nhất</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">Chuẩn bị trước khi đi</p>
                <p className="text-slate-400">17/07/2025</p>
              </div>
              <div>
                <p className="font-semibold">Tour Phú Quốc</p>
                <p className="text-slate-400">20/06/2025</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="uppercase tracking-wide text-sm text-slate-400 mb-3">Liên hệ chúng tôi</h4>
            <p className="text-sm text-slate-400">Vui lòng xác nhận cài đặt trong widget Twitter.</p>
          </div>
          <div>
            <h4 className="uppercase tracking-wide text-sm text-slate-400 mb-3">Liên hệ chúng tôi</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><FaMapMarkerAlt /> 123 Đường ABC, Thành phố XYZ</li>
              <li className="flex items-center gap-2"><FaPhone /> +84 123 456 789</li>
              <li className="flex items-center gap-2"><FaEnvelope /> contact@tourdulich.com</li>
              <li className="flex items-center gap-2"><FaGlobe /> tourdulich.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700">
          <div className="max-w-6xl mx-auto py-4 px-3 text-xs text-slate-400 flex flex-wrap gap-3 justify-between">
            <span>© Tour Du Lịch, 2025.</span>
            <div className="flex gap-4">
              <a className="hover:text-slate-300" href="#">Điều khoản và điều kiện</a>
              <a className="hover:text-slate-300" href="#">Quyền riêng tư</a>
              <a className="hover:text-slate-300" href="#">Chính sách bảo mật</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


