// axios
import axios from "axios";
import router from "@/router";

const header = () => {
  const user = JSON.parse(localStorage.getItem("AuthUser"));

  if (user.ticket) {
    return { Authorization: "Basic " + window.btoa(user.ticket) };
  } else {
    return {};
  }
};

const request = axios.create({
  headers: header()
});

request.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem("AuthUser");
      router.push("/pages/login");
    }
    return error;
  }
);

export default request;
