import axios from "axios";

import { ENV } from "@/config/env";

export const authClient = axios.create({
  baseURL: ENV.AUTH_BASE_URL,

  timeout: ENV.API_TIMEOUT,

  headers: {
    Accept: "application/json",

    "Content-Type": "application/json",
  },
});

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,

  timeout: ENV.API_TIMEOUT,

  headers: {
    Accept: "application/json",

    "Content-Type": "application/json",
  },
});
