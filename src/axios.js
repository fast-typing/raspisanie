import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:3000/",
    //https://timetable-backend-production.up.railway.app/
  //http://localhost:3000/
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");

  return config;
});

export default instance;
