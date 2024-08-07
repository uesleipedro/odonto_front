import axios from "axios";
import "dotenv/config";

const api = axios.create({
  baseURL: 'http://134.122.24.222:3333/', //este para producao
  //baseURL: "http://localhost:3333/",
  // baseURL: `${process.env.NEXT_PUBLIC_PATH}`,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export default api;
