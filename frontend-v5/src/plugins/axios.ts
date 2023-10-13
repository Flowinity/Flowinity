/**
 * plugins/axios.ts
 */

import axios, { type AxiosRequestConfig, type AxiosStatic } from "axios";
import { useToast } from "vue-toastification";
import { useAppStore } from "@/stores/app.store";
import { useUserStore } from "@/stores/user.store";
import router from "@/router";

export interface AxiosStaticWithAvoidance extends AxiosStatic {
  _avoidToast: boolean;
}

export interface AxiosRequestConfigWithAvoidance extends AxiosRequestConfig {
  avoidToast?: boolean;
}

const ax = axios.create({
  baseURL: import.meta.env.CORDOVA
    ? `https://images.flowinity.com/api/v3`
    : `/api/v3`,
  withCredentials: true,
  headers: {
    Authorization: localStorage.getItem("token"),
    Accept: "application/json",
    "X-TPU-Client": "TPUvNEXT",
    "X-TPU-Client-Version": import.meta.env.TPU_VERSION
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
          //user.logout();
          //router.push("/login");
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
      } else if (e.response.data.errors[0].name === "MAINTENANCE") {
        console.warn(`[TPU/HTTP] Maintenance being conducted.`);
        return Promise.reject(e);
      }
      if (!e.response.config.headers.noToast) {
        for (const error of e.response.data.errors) {
          toast.error(error.message);
        }
      }
      return Promise.reject(e);
    } else {
      if (!e?.response?.config?.headers?.noToast) {
        toast.error("An unknown error occurred.");
      }
      return Promise.reject(e);
    }
  }
);

ax.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem("token");
  return config;
});

/*
ax.interceptors.request.use((config) => {
  if (config.url.includes("/gallery/site")) {
    return config;
  } else {
    return Promise.reject(config);
  }
});
*/
export default ax;
