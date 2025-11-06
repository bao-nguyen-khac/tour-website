import React, { useState } from "react";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Cookies from "js-cookie";

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
      alert("You must upload atleast 1 image");
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
      alert("All fields are required!");
      return;
    }
    if (formData.packagePrice < 0) {
      alert("Giá phải lớn hơn 500!");
      return;
    }
    console.log('🤖 ~ handleSubmit ~ formData.packageDiscountPrice:', formData.packageDiscountPrice);
    console.log('🤖 ~ handleSubmit ~ formData.packagePrice:', formData.packagePrice);
    if (formData.packageDiscountPrice >= formData.packagePrice) {
      alert("Giá khuyến mãi phải nhỏ hơn giá thường!");
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
      if (data?.success === false) {
        setError(data?.message);
        setLoading(false);
      }
      setLoading(false);
      setError(false);
      alert(data?.message);
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
    }
  };

  return (
    <>
      <div className="w-full flex justify-center p-3">
        <form
          onSubmit={handleSubmit}
          className="w-4/5 shadow-md rounded-xl p-3 gap-2 flex flex-col items-center"
        >
          <h1 className="text-center text-2xl font-semibold">Thêm Tour</h1>
          <div className="flex flex-col w-full">
            <label htmlFor="packageName">Tên Tour:</label>
            <input
              type="text"
              className="border border-black rounded"
              id="packageName"
              value={formData.packageName}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageDescription">Mô tả:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none w-full min-h-[100px] p-2"
              id="packageDescription"
              value={formData.packageDescription}
              onChange={handleChange}
              rows={5}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageDestination">Điểm đến:</label>
            <input
              type="text"
              className="border border-black rounded"
              id="packageDestination"
              value={formData.packageDestination}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap w-full gap-2">
            <div className="flex flex-col flex-1">
              <label htmlFor="packageDays">Ngày:</label>
              <input
                type="number"
                className="border border-black rounded"
                id="packageDays"
                value={formData.packageDays}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="packageNights">Đêm:</label>
              <input
                type="number"
                className="border border-black rounded"
                id="packageNights"
                value={formData.packageNights}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageAccommodation">Khách sạn:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none w-full min-h-[100px] p-2"
              id="packageAccommodation"
              value={formData.packageAccommodation}
              onChange={handleChange}
              rows={5}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageTransportation">Phương tiện:</label>
            <select
              className="border border-black rounded-lg"
              id="packageTransportation"
              onChange={handleChange}
            >
              <option>Chọn</option>
              <option>Ô tô</option>
              <option>Máy bay</option>
              <option>Tàu</option>
              <option>Thuyền</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageMeals">Ăn uống:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none w-full min-h-[100px] p-2"
              id="packageMeals"
              value={formData.packageMeals}
              onChange={handleChange}
              rows={5}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageActivities">Hoạt động:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none w-full min-h-[100px] p-2"
              id="packageActivities"
              value={formData.packageActivities}
              onChange={handleChange}
              rows={5}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packagePrice">Giá:</label>
            <input
              type="number"
              className="border border-black rounded"
              id="packagePrice"
              value={formData.packagePrice}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2 w-full">
            <label htmlFor="packageOffer">Khuyến mãi:</label>
            <input
              type="checkbox"
              className="border border-black rounded w-4 h-4"
              id="packageOffer"
              checked={formData.packageOffer}
              onChange={handleChange}
            />
          </div>
          <div
            className={`${
              formData.packageOffer ? "flex flex-col w-full" : "hidden"
            }`}
          >
            <label htmlFor="packageDiscountPrice">Giá khuyến mãi:</label>
            <input
              type="number"
              className="border border-black rounded"
              id="packageDiscountPrice"
              value={formData.packageDiscountPrice}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageImages">
              Hình ảnh:
              <span className="text-red-700 text-sm">
                (kích thước hình ảnh nhỏ hơn 2mb và tối đa 5 hình ảnh)
              </span>
            </label>
            <input
              type="file"
              className="border border-black rounded"
              id="packageImages"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
          </div>
          {imageUploadError ||
            (error && (
              <span className="text-red-600 w-full">
                {imageUploadError || error}
              </span>
            ))}
          <button
            hidden={images.length === 0}
            disabled={uploading || loading}
            className="bg-green-700 p-3 rounded text-white hover:opacity-95 disabled:opacity-80 w-full"
            type="button"
            onClick={handleImageSubmit}
          >
            {uploading
              ? `Đang tải lên...(${imageUploadPercent}%)`
              : loading
              ? "Đang tải..."
              : "Tải lên hình ảnh"}
          </button>
          <button
            disabled={uploading || loading}
            className="bg-green-700 p-3 rounded text-white hover:opacity-95 disabled:opacity-80 w-full"
          >
            {uploading
              ? "Đang tải..."
              : loading
              ? "Đang tải..."
              : "Thêm Tour"}
          </button>
          {formData.packageImages.length > 0 && (
            <div className="p-3 w-full flex flex-col justify-center">
              {formData.packageImages.map((image, i) => {
                return (
                  <div
                    key={i}
                    className="shadow-xl rounded-lg p-1 flex flex-wrap my-2 justify-between"
                  >
                    <img src={image} alt="" className="h-20 w-20 rounded" />
                    <button
                      onClick={() => handleDeleteImage(i)}
                      className="p-2 text-red-500 hover:cursor-pointer hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default AddPackages;
