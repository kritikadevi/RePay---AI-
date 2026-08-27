export const formatCurrency = (value) => {
  return `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2
    }
  )}`;
};


export const formatPercentage = (value) => {
  return Number(
    value || 0
  ).toFixed(2);
};