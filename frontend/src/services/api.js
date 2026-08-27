const API_URL = "http://127.0.0.1:8000";

export const getRecentPayments = async () => {
  const response = await fetch(
    `${API_URL}/payments/recent`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  return await response.json();
};


export const getPaymentStats = async () => {
  const response = await fetch(
    `${API_URL}/payments/stats`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return await response.json();
};


export const analyzePayment = async (paymentData) => {
  const response = await fetch(
    `${API_URL}/predict`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(paymentData)
    }
  );

  if (!response.ok) {
    throw new Error("Prediction failed");
  }

  return await response.json();
};


export const getAllPayments = async () => {
  const response = await fetch(
    `${API_URL}/payments`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  return await response.json();
};