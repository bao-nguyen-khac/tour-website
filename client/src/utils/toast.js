import toast from "react-hot-toast";

const DEFAULT_ERROR_MESSAGE = "Đã xảy ra lỗi. Vui lòng thử lại!";
const DEFAULT_SUCCESS_MESSAGE = "Thao tác thành công!";
const DEFAULT_INFO_MESSAGE = "Thông báo";

export const showSuccessToast = (message) =>
  toast.success(message || DEFAULT_SUCCESS_MESSAGE, {
    duration: 4000,
  });

export const showErrorToast = (message) =>
  toast.error(message || DEFAULT_ERROR_MESSAGE, {
    duration: 4500,
  });

export const showInfoToast = (message) =>
  toast(message || DEFAULT_INFO_MESSAGE, {
    duration: 3500,
  });

export const showPromiseToast = (promise, { loading = "Đang xử lý...", success, error }) =>
  toast.promise(
    promise,
    {
      loading,
      success: success || DEFAULT_SUCCESS_MESSAGE,
      error: error || DEFAULT_ERROR_MESSAGE,
    },
    {
      duration: 4000,
    }
  );

