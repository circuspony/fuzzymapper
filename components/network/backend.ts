import axios from "axios";
import router from "next/router"

const isProd = process.env.NODE_ENV === "production"
// const headers = process.env.API_TOKEN ? {
//     common: {
//         "Token": process.env.API_TOKEN,
//     }
// } : {}


const backendAxios = axios.create({
    baseURL: isProd ? process.env.NEXT_PUBLIC_FLASK : "http://localhost:5000",
    // headers: { ...headers }
})


export default backendAxios