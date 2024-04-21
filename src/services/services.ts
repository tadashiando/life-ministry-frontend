import axios from "axios";

const api = axios.create({
  baseURL: "https://life-ministry-api.cyclic.app",
});

export default api;