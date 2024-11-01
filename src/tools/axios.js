import axios from "axios";
import { Toast } from "react-vant";
axios.defaults.baseURL = "https://apif.java.crmeb.net/api/front";
axios.defaults.timeout = 6000;
axios.interceptors.request.use((config) => {
  Toast.loading({
    message: "加载中...",
    forbidClick: true,
  });
  config.headers["authori-zation"] = localStorage.getItem("token");
  return config;
});
axios.interceptors.response.use((res) => {
  Toast.clear();
  // console.log(res);
  if (res.data.code === 401) {
    Toast.info(res.data.message);
    setTimeout(() => {
      window.location.href = "#/login";
    }, 500);
    return res;
  }
  return res;
});
function http(url, method = "get", data = null, headers = "application/json") {
  return axios({
    url,
    method,
    data: method !== "get" ? data : null,
    params: method === "get" ? data : null,
    headers: {
      "Content-Type": headers,
    },
  });
}
export default http;
