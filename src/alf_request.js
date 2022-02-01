// axios
import axios from "axios";

import { alfHeader } from "@/helpers/alf_header.js";

const request = axios.create({
  headers: alfHeader()
});

request.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem("AuthUser");
      location.reload()
    }
    return error;
  }
);

export default request;
