/**
 * plugins/axios.ts
 */
import axios, {AxiosRequestConfig, AxiosResponse, AxiosStatic, InternalAxiosRequestConfig} from "axios";
import {useToast} from "vue-toastification";

// Import Router
import router from "@/router";

// Import Stores
import {useAppStore} from "@/store/app";
import {useUserStore} from "@/store/user";

export interface AxiosStaticWithAvoidance extends AxiosStatic {
  _avoidToast: boolean;
}

export interface AxiosRequestConfigWithAvoidance extends AxiosRequestConfig {
  avoidToast?: boolean;
}

const ax: AxiosStaticWithAvoidance = axios.create({
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

ax.interceptors.response.use(
  (response: AxiosResponse) => response,
  (e): Promise<never> => {
    const app = useAppStore();

    app.componentLoading = false;
    app.loading = false;

    const toast = useToast();

    if (e?.response?.data?.errors) if (e.response.data.errors[0].name === "NOT_SETUP") return Promise.reject(e);
    else if (e.response.data.errors[0].name === "INVALID_TOKEN") {
      const user = useUserStore();

      if (user.user) {
        user.logout();
        router.push("/login");
      }

      return Promise.reject(e);
    } else if (e.response.data.errors[0].name === "SCOPE_REQUIRED") {
      console.warn(
        `[PRIVATEUPLOADER/HTTP] API key scope ${e.response.data.errors[0].requiredScope} is required to access /api/v2${e.response.config.url}.`
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
      console.warn(`[PRIVATEUPLOADER/HTTP] Experimental feature is not allowed.`);

      return Promise.reject(e);
    }
    if (!e.response.config.headers.noToast) for (const error of e.response.data.errors) {
      toast.error(error.message);
    }
    else {
      if (!e?.response?.config?.headers?.noToast) toast.error("An unknown error occurred.");
    }

    return Promise.reject(e);
  }
);

ax.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.Authorization = localStorage.getItem("token");
  return config;
});

export default ax;
