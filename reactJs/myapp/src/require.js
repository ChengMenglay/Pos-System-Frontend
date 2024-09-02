import { Alert, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Config = {
  base_url: "http://localhost:8080/",
};

export const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login"; // Redirect to login page
};

export const request = (url = "", method = "get", data, new_token) => {
  let headers = { "Content-Type": "application/json" };

  if (data instanceof FormData) {
    headers = { "Content-Type": "multipart/form-data" };
  }

  let accessToken = localStorage.getItem("accessToken");
  if (new_token) {
    accessToken = new_token;
  }

  return axios({
    url: Config.base_url + url,
    method: method,
    data: data,
    headers: {
      ...headers,
      Authorization: "Bearer " + accessToken,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      const status = error.response?.status;
      if (status === 404 || status === 500) {
        message.error(error.message);
      } else if (status === 401) {
        if (error?.response?.data?.error?.name === "TokenExpiredError") {
          return refreshToken(url, method, data);
        }
        Alert.error("You don't have permission to access this method!");
        handleLogout();
      }
      return false;
    });
};

export const refreshToken = (url, method, param) => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) {
    handleLogout();
    return false;
  }

  return axios({
    url: Config.base_url + "api/user/refresh_token",
    method: "post",
    data: { refresh_token },
  })
    .then((res) => {
      // Store new access token and refresh token
      localStorage.setItem("accessToken", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      const new_token = res.data.access_token;
      return request(url, method, param, new_token);
    })
    .catch((error) => {
      message.error("Refresh failed");
      handleLogout();
      return false;
    });
};
