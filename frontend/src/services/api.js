import axios from "axios";

const api = axios.create({
  baseURL: "https://gigflow-backend-cuvy.onrender.com",
  withCredentials: true
});

export default api;
