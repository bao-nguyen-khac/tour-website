export const formatCurrency = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "0 ₫";
  }

  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(Number(value));
  } catch (error) {
    // Fallback formatting
    const numeric = Number(value) || 0;
    return `${numeric.toLocaleString("vi-VN")} ₫`;
  }
};

