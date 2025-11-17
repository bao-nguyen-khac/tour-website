import React, { useEffect, useState } from "react";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate, useParams } from "react-router";
import Cookies from "js-cookie";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHotel,
  FaBus,
  FaUtensils,
  FaHiking,
  FaDollarSign,
  FaTag,
  FaImage,
  FaUpload,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";

const UpdatePackage = () => {
  const params = useParams();
  const navigate = useNavigate();
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

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = Cookies.get("access_token");

  const getPackageData = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/package/get-package-data/${params?.id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (data?.success) {
        // console.log(data);
        setFormData({
          packageName: data?.packageData?.packageName,
          packageDescription: data?.packageData?.packageDescription,
          packageDestination: data?.packageData?.packageDestination,
          packageDays: data?.packageData?.packageDays,
          packageNights: data?.packageData?.packageNights,
          packageAccommodation: data?.packageData?.packageAccommodation,
          packageTransportation: data?.packageData?.packageTransportation,
          packageMeals: data?.packageData?.packageMeals,
          packageActivities: data?.packageData?.packageActivities,
          packagePrice: data?.packageData?.packagePrice,
          packageDiscountPrice: data?.packageData?.packageDiscountPrice,
          packageOffer: data?.packageData?.packageOffer,
          packageImages: data?.packageData?.packageImages,
        });
      } else {
        showErrorToast(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (params.id) getPackageData();
  }, [params.id]);

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
      const fileName = new Date().getTime() + file.name;
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
    if (formData.packageDiscountPrice >= formData.packagePrice) {
      showErrorToast("Giá khuyến mãi phải nhỏ hơn giá thường!");
      return;
    }
    if (formData.packageOffer === false) {
      setFormData({ ...formData, packageDiscountPrice: 0 });
    }
    try {
      setLoading(true);
      setError(false);

      const res2 = await fetch(`${apiUrl}/api/package/update-package/${params?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      const data = await res2.json();
      if (data?.success === false) {
        setError(data?.message);
        setLoading(false);
        showErrorToast(data?.message);
        return;
      }
      setLoading(false);
      setError(false);
      showSuccessToast(data?.message);
      navigate(`/package/${params?.id}`);
    } catch (err) {
      console.log(err);
      showErrorToast();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-10 px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-500">Chỉnh sửa tour du lịch</p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Cập nhật thông tin tour</h1>
            <p className="text-slate-600 mt-2">
              Cập nhật nhanh các thông tin quan trọng để đảm bảo tour luôn nổi bật và chính xác.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-white shadow-sm bg-white/80 backdrop-blur"
          >
            <FaArrowLeft />
            Quay lại
          </button>
        </div>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 space-y-8 border border-white/40"
          >
            {/* Basic Info */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Thông tin cơ bản</h2>
                  <p className="text-sm text-slate-500">Tên tour, điểm đến và mô tả tổng quan</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="packageName">
                    Tên tour <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="packageName"
                    value={formData.packageName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên tour nổi bật..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="packageDescription">
                    Mô tả chi tiết <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="packageDescription"
                    value={formData.packageDescription}
                    onChange={handleChange}
                    rows={10}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Viết mô tả hấp dẫn cho tour..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="packageDestination">
                      Điểm đến <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="packageDestination"
                      value={formData.packageDestination}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ví dụ: Đà Nẵng, Phú Quốc..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="packageDays">
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-600" />
                          Ngày
                        </span>
                      </label>
                      <input
                        type="number"
                        id="packageDays"
                        min={1}
                        value={formData.packageDays}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="packageNights">
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-600" />
                          Đêm
                        </span>
                      </label>
                      <input
                        type="number"
                        id="packageNights"
                        min={0}
                        value={formData.packageNights}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Services */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                  <FaHotel />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Dịch vụ & Tiện ích</h2>
                  <p className="text-sm text-slate-500">Chỗ ở, phương tiện và các tiện ích đi kèm</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="packageAccommodation">
                    Chỗ ở <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="packageAccommodation"
                    value={formData.packageAccommodation}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Thông tin khách sạn, resort..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="packageTransportation">
                    Phương tiện di chuyển <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="packageTransportation"
                    value={formData.packageTransportation || ""}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="packageMeals">
                    Ăn uống <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="packageMeals"
                    value={formData.packageMeals}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Thông tin bữa ăn trong tour..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="packageActivities">
                    Hoạt động nổi bật <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="packageActivities"
                    value={formData.packageActivities}
                    onChange={handleChange}
                    rows={10}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Liệt kê các hoạt động chính..."
                    required
                  />
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-xl">
                  <FaDollarSign />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Giá & Khuyến mãi</h2>
                  <p className="text-sm text-slate-500">Cập nhật giá bán và ưu đãi</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="packagePrice">
                    Giá gốc (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="packagePrice"
                    min={500}
                    value={formData.packagePrice}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <input
                    type="checkbox"
                    id="packageOffer"
                    checked={formData.packageOffer}
                    onChange={handleChange}
                    className="w-5 h-5 accent-green-600"
                  />
                  <label htmlFor="packageOffer" className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <FaTag className="text-orange-500" /> Áp dụng khuyến mãi
                  </label>
                </div>
                {formData.packageOffer && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="packageDiscountPrice">
                      Giá khuyến mãi (VNĐ)
                    </label>
                    <input
                      type="number"
                      id="packageDiscountPrice"
                      value={formData.packageDiscountPrice}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Nhập giá khuyến mãi"
                    />
                  </div>
                )}
              </div>
            </section>

            {(imageUploadError || error) && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {imageUploadError || error}
              </div>
            )}

            <div className="flex flex-col gap-4 md:flex-row md:justify-end">
              <button
                type="button"
                onClick={() => getPackageData()}
                className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                Khôi phục dữ liệu
              </button>
              <button
                type="submit"
                disabled={uploading || loading}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang cập nhật..." : "Lưu cập nhật"}
              </button>
            </div>
          </form>

          {/* Images */}
          <aside className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/40 h-fit space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
                <FaImage />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Quản lý hình ảnh</h3>
                <p className="text-xs text-slate-500">Tối đa 5 hình, mỗi hình &lt; 2MB</p>
              </div>
            </div>

            <label
              htmlFor="packageImages"
              className="block rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center cursor-pointer hover:border-indigo-400 transition bg-white/40"
            >
              <FaUpload className="mx-auto text-3xl text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">Nhấn để chọn hình ảnh</p>
            </label>
            <input
              type="file"
              id="packageImages"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className="hidden"
            />

            <button
              type="button"
              disabled={uploading || loading || images.length === 0}
              onClick={handleImageSubmit}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaUpload />
              {uploading ? `Đang tải... (${imageUploadPercent}%)` : "Tải lên hình mới"}
            </button>

            {formData.packageImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {formData.packageImages.map((image, index) => (
                  <div key={index} className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow">
                    <img src={image} alt={`Tour ${index + 1}`} className="w-full h-28 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTrash />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs text-center py-1">
                      Ảnh {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default UpdatePackage;
