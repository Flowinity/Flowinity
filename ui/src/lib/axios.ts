import axios from "axios"

const instance = axios.create({
  baseURL: "/api/v2"
})

instance.defaults.headers.common["Authorization"] =
  localStorage.getItem("token") || ""

export default instance
