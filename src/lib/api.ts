import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const createSubscription = async (plan: "monthly" | "yearly") => {
  const response = await api.post<{
    subscriptionId: string;
    paymentUrl: string;
  }>("/razorpay/create-subscription", { plan });
  return response.data;
};
