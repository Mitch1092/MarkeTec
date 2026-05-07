import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8000/api",
});

client.interceptors.request.use((config) => {
  try{
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }catch (err) {
    console.log("ERROR FULL:", err.response?.data);
    console.log("STATUS:", err.response.status);
    console.log("DATA:", err.response.data);
  }
});




export default client;