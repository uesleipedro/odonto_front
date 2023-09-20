import axios from "axios"

const api = axios.create({
 baseURL: "http://localhost:3333/",
//  baseURL: "http://134.122.24.222:3000/",
});

export default api;