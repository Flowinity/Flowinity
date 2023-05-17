/**
 * plugins/axios.ts
 */

import axios, { AxiosStatic } from "axios";
import { useToast } from "vue-toastification";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import router from "@/router";

export interface AxiosStaticWithAvoidance extends AxiosStatic {
  _avoidToast: boolean;
}

const ax = axios.create({
  baseURL: import.meta.env.CORDOVA
    ? `https://images.flowinity.com/api/v3`
    : `/api/v3`,
  withCredentials: true,
  headers: {
    Authorization: localStorage.getItem("token"),
    Accept: "application/json",
    "X-TPU-Client": "TPUvNEXT"
  }
}) as AxiosStaticWithAvoidance;

// if error is thrown
ax.interceptors.response.use(
  (response) => response,
  (e) => {
    const app = useAppStore();
    app.componentLoading = false;
    app.loading = false;
    const toast = useToast();
    if (e?.response?.data?.errors) {
      if (e.response.data.errors[0].name === "NOT_SETUP") {
        return Promise.reject(e);
      } else if (e.response.data.errors[0].name === "INVALID_TOKEN") {
        const user = useUserStore();
        if (user.user) {
          user.logout();
          router.push("/login");
        }
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
          "The weather service is not responding." ||
        e.response.data.errors[0].message ===
          "Your email address has not been verified."
      ) {
        console.warn(`[TPU/HTTP] Experimental feature is not allowed.`);
        return Promise.reject(e);
      }
      if (!e.response.config.headers.noToast) {
        for (const error of e.response.data.errors) {
          toast.error(error.message);
        }
      }
    } else {
      if (
        e.response?.config?.baseURL?.includes("/api/v3") &&
        e.response.status === 404
      ) {
        console.warn(
          `[TPU/HTTP] APIv3 feature is not implemented. Falling back to APIv2.`
        );
        const config = e.response.config;
        config.baseURL = config.baseURL.replace("/api/v3", "/api/v2");
        return axios.request(config);
      }
      if (!e?.response?.config?.headers?.noToast) {
        toast.error("An unknown error occurred.");
      }
    }
    return Promise.reject(e);
  }
);

ax.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem("token");
  return config;
});

export default ax;
