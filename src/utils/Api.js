import axios from "axios"

const api = axios.create({
    // baseURL: 'http://134.122.24.222:3333/',
    baseURL: 'http://localhost:3333/',
    headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
    },
});

export default api;