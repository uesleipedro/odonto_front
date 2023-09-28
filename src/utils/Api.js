import axios from "axios"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_PATH,
    // baseURL: 'http://localhost:3333/',
});

export default api;