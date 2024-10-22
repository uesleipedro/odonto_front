
import axios from "axios"
import "dotenv/config"
import Cookies from 'js-cookie'
let value
try {
  value = localStorage.getItem("token") || ""
} catch (error) { }


const api = axios.create({
  baseURL: 'http://134.122.24.222:3333/', //este para producao
  //baseURL: "http://localhost:3333/",
  //baseURL: `${process.env.NEXT_PUBLIC_PATH}`,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
})

api.interceptors.request.use(config => {

  if (value) {
    config.headers.Authorization = `Bearer ${value}`;
  }
  return config;
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove("user")
      window.open("/login", "_self")
    }

    return Promise.reject(error)
  }
)

export default api
