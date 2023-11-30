import axios from "axios";
import { getJWTToken } from "../lib/common/helpers";

const API = axios.create({
  // baseURL: 'http://192.168.145.160:8080/api',
   baseURL: "http://localhost:8081/api",
  // baseURL: "http://123.200.23.98:55443/api",

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${getJWTToken()}`;
  return config;
});

export default API;
