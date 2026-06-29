export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "";

export const API_URL = `${API_BASE_URL}/api`;

export const TOKEN_URL = `${API_BASE_URL}/api/token/`;
export const REFRESH_URL = `${API_BASE_URL}/api/token/refresh/`;

export const ACCESS_TOKEN_KEY = "nexus_access";
export const REFRESH_TOKEN_KEY = "nexus_refresh";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  EXPLORE: "/explore",
  CREATE_POST: "/create",
  PROFILE: "/profile/:id",
  POST_DETAIL: "/posts/:id",
  NOT_FOUND: "*",
};