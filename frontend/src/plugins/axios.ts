/**
 * plugins/axios.ts
 */

import axios, { AxiosStatic } from "axios";
import { useToast } from "vue-toastification";

const ax = axios.create({
  baseURL: "/api/v2",
  withCredentials: true,
  headers: {
    Authorization: localStorage.getItem("token"),
    Accept: "application/json",
    "X-TPU-Client": "TPUvNEXT"
  }
}) as AxiosStatic;

// if error is thrown
ax.interceptors.response.use(
  (response) => response,
  (e) => {
    const toast = useToast();
    if (e?.response?.data?.errors) {
      if (e.response.data.errors[0].name === "invalidToken") {
        localStorage.removeItem("token");
        localStorage.removeItem("userStore");
        return Promise.reject(e);
      }
      for (const error of e.response.data.errors) {
        toast.error(error.message);
      }
    } else {
      toast.error("An unknown error occurred.");
    }
    return Promise.reject(e);
  }
);

ax.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem("token");
  return config;
});

export default ax;
