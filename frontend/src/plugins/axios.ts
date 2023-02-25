/**
 * plugins/axios.ts
 */

import axios, { AxiosStatic } from "axios";
import { useToast } from "vue-toastification";
import { useAppStore } from "@/store/app";

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
    const app = useAppStore();
    app.componentLoading = false;
    app.loading = false;
    const toast = useToast();
    if (e?.response?.data?.errors) {
      if (e.response.data.errors[0].name === "INVALID_TOKEN") {
        localStorage.removeItem("token");
        localStorage.removeItem("userStore");
        return Promise.reject(e);
      } else if (e.response.data.errors[0].name === "SCOPE_REQUIRED") {
        console.warn(
          `[TPU/HTTP] API key scope ${e.response.data.errors[0].requiredScope} is required to access /api/v2${e.response.config.url}.`
        );
        return Promise.reject(e);
      } else if (
        e.response.data.errors[0].message ===
          "You are not allowed to use this experimental feature." ||
        e.response.data.errors[0].message ===
          "The weather service is not responding."
      ) {
        console.warn(`[TPU/HTTP] Experimental feature is not allowed.`);
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
