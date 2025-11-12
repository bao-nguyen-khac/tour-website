import React, { useState } from "react";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Cookies from "js-cookie";
import {
  FaImage,
  FaTrash,
  FaUpload,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHotel,
  FaBus,
  FaUtensils,
  FaHiking,
  FaDollarSign,
  FaTag,
  FaCheckCircle,
} from "react-icons/fa";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const apiUrl = import.meta.env.VITE_API_URL;
const token = Cookies.get("access_token");

const AddPackages = () => {
  const [formData, setFormData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageImages: [],
  });
  const [images, setImages] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadPercent, setImageUploadPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
  };

  const handleImageSubmit = async () => {
    if (!images || images.length === 0) {
      setImageUploadError("Bạn phải chọn 1 hình ảnh");
      return;
    }
    if (formData.packageImages.length >= 5) {
      setImageUploadError("Bạn chỉ có thể upload tối đa 5 hình ảnh");
      return;
    }
    setUploading(true);
    setImageUploadError(false);
    try {
      const form = new FormData();
      form.append("image", images[0]);
      const res = await fetch(`${apiUrl}/api/package/upload-image`, {
        method: "POST",
        body: form,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setImageUploadError(data.message || "Lỗi upload ảnh");
        setUploading(false);
        return;
      }
      data.url = apiUrl + data.url;
      setFormData({
        ...formData,
        packageImages: [...formData.packageImages, data.url],
      });
      setUploading(false);
      setImages([]);
    } catch (err) {
      setImageUploadError("Lỗi upload ảnh");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name.replace(/\s/g, "");
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadPercent(Math.floor(progress));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      packageImages: formData.packageImages.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.packageImages.length === 0) {
      showErrorToast("Bạn phải tải lên ít nhất 1 hình ảnh!");
      return;
    }
    if (
      formData.packageName === "" ||
      formData.packageDescription === "" ||
      formData.packageDestination === "" ||
      formData.packageAccommodation === "" ||
      formData.packageTransportation === "" ||
      formData.packageMeals === "" ||
      formData.packageActivities === "" ||
      formData.packagePrice === 0
    ) {
      showErrorToast("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    if (formData.packagePrice < 500) {
      showErrorToast("Giá tour phải lớn hơn hoặc bằng 500!");
      return;
    }
    console.log('🤖 ~ handleSubmit ~ formData.packageDiscountPrice:', formData.packageDiscountPrice);
    console.log('🤖 ~ handleSubmit ~ formData.packagePrice:', formData.packagePrice);
    if (formData.packageDiscountPrice >= formData.packagePrice) {
      showErrorToast("Giá khuyến mãi phải nhỏ hơn giá thường!");
      return;
    }
    if (formData.packageOffer === false) {
      setFormData({ ...formData, packageDiscountPrice: 0 });
    }
    // console.log(formData);
    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`${apiUrl}/api/package/create-package`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data?.success) {
        setError(data?.message);
        setLoading(false);
        showErrorToast(data?.message);
        return;
      }
      setLoading(false);
      setError(false);
      showSuccessToast(data?.message);
      setFormData({
        packageName: "",
        packageDescription: "",
        packageDestination: "",
        packageDays: 1,
        packageNights: 1,
        packageAccommodation: "",
        packageTransportation: "",
        packageMeals: "",
        packageActivities: "",
        packagePrice: 500,
        packageDiscountPrice: 0,
        packageOffer: false,
        packageImages: [],
      });
      setImages([]);
    } catch (err) {
      console.log(err);
      showErrorToast();
    }
  };

  return (
    <div className="w-full p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Thêm Tour Mới</h1>
          <p className="text-slate-600">Điền thông tin chi tiết về tour du lịch của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-blue-600" />
                Thông tin cơ bản
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="packageName" className="block text-sm font-medium text-slate-700 mb-2">
                    Tên Tour <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="packageName"
                    value={formData.packageName}
                    onChange={handleChange}
                    placeholder="Nhập tên tour du lịch"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="packageDescription" className="block text-sm font-medium text-slate-700 mb-2">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="packageDescription"
                    value={formData.packageDescription}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Mô tả chi tiết về tour..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="packageDestination" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    Điểm đến <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="packageDestination"
                    value={formData.packageDestination}
                    onChange={handleChange}
                    placeholder="Ví dụ: Hà Nội, Đà Nẵng..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="packageDays" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600" />
                      Số ngày <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="packageDays"
                      value={formData.packageDays}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="packageNights" className="block text-sm font-medium text-slate-700 mb-2">
                      Số đêm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="packageNights"
                      value={formData.packageNights}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Accommodation & Services Section */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FaHotel className="text-blue-600" />
                Dịch vụ & Tiện ích
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="packageAccommodation" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FaHotel className="text-blue-600" />
                    Khách sạn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="packageAccommodation"
                    value={formData.packageAccommodation}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Mô tả về khách sạn..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="packageTransportation" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FaBus className="text-blue-600" />
                    Phương tiện <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="packageTransportation"
                    value={formData.packageTransportation || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                    required
                  >
                    <option value="">Chọn phương tiện</option>
                    <option value="Ô tô">Ô tô</option>
                    <option value="Máy bay">Máy bay</option>
                    <option value="Tàu">Tàu</option>
                    <option value="Thuyền">Thuyền</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="packageMeals" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FaUtensils className="text-blue-600" />
                    Ăn uống <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="packageMeals"
                    value={formData.packageMeals}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Mô tả về bữa ăn..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="packageActivities" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <FaHiking className="text-blue-600" />
                    Hoạt động <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="packageActivities"
                    value={formData.packageActivities}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Liệt kê các hoạt động (mỗi hoạt động cách nhau bởi dấu -)"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FaDollarSign className="text-blue-600" />
                Giá cả
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="packagePrice" className="block text-sm font-medium text-slate-700 mb-2">
                    Giá gốc (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="packagePrice"
                    value={formData.packagePrice}
                    onChange={handleChange}
                    min="500"
                    placeholder="500000"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl w-full">
                    <input
                      type="checkbox"
                      id="packageOffer"
                      checked={formData.packageOffer}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="packageOffer" className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                      <FaTag className="text-orange-500" />
                      Áp dụng khuyến mãi
                    </label>
                  </div>
                </div>

                {formData.packageOffer && (
                  <div className="md:col-span-2">
                    <label htmlFor="packageDiscountPrice" className="block text-sm font-medium text-slate-700 mb-2">
                      Giá khuyến mãi (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="packageDiscountPrice"
                      value={formData.packageDiscountPrice}
                      onChange={handleChange}
                      min="0"
                      placeholder="400000"
                      className="w-full px-4 py-3 border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-orange-50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Images Section */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FaImage className="text-blue-600" />
                Hình ảnh
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="packageImages" className="block text-sm font-medium text-slate-700 mb-2">
                    Chọn hình ảnh <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="packageImages"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition">
                        <FaUpload className="mx-auto text-3xl text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600">
                          Nhấn để chọn hoặc kéo thả hình ảnh
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Tối đa 5 hình, mỗi hình &lt; 2MB
                        </p>
                      </div>
                    </label>
                    <input
                      type="file"
                      id="packageImages"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImages(e.target.files)}
                      className="hidden"
                    />
                  </div>
                </div>

                {(imageUploadError || error) && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{imageUploadError || error}</p>
                  </div>
                )}

                {images.length > 0 && (
                  <button
                    type="button"
                    disabled={uploading || loading}
                    onClick={handleImageSubmit}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                  >
                    <FaUpload />
                    {uploading
                      ? `Đang tải lên... (${imageUploadPercent}%)`
                      : "Tải lên hình ảnh"}
                  </button>
                )}

                {formData.packageImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {formData.packageImages.map((image, i) => (
                      <div
                        key={i}
                        className="relative group rounded-xl overflow-hidden border-2 border-slate-200 hover:border-blue-500 transition"
                      >
                        <img
                          src={image}
                          alt={`Tour image ${i + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(i)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                          Ảnh {i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  packageName: "",
                  packageDescription: "",
                  packageDestination: "",
                  packageDays: 1,
                  packageNights: 1,
                  packageAccommodation: "",
                  packageTransportation: "",
                  packageMeals: "",
                  packageActivities: "",
                  packagePrice: 500,
                  packageDiscountPrice: 0,
                  packageOffer: false,
                  packageImages: [],
                });
                setImages([]);
              }}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-medium"
            >
              Đặt lại
            </button>
            <button
              type="submit"
              disabled={uploading || loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold shadow-lg"
            >
              {loading ? "Đang xử lý..." : "Tạo Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPackages;
