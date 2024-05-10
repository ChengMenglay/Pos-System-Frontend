import axios from "axios";
export const request = (url, method, data) => {
  return axios({
    url: "http://localhost:8080/" + url,
    method: method,
    data: data,
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("API request failed:", error);
      throw error;
    });
};
