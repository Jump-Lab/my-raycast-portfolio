import axios, { AxiosRequestConfig } from "axios";
import { authorize } from "../oauth/google";

const baseURL = "http://127.0.0.1:5001/token-tracker-1cc4f/us-central1/app";
export const request = async (url: string, method = "GET", data?: any, headers?: any) => {
  const idToken = await authorize();

  const apiHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...headers,
  };
  const options: AxiosRequestConfig = {
    method,
    url: baseURL + url,
    params: {
      id_token: idToken,
    },
    headers: apiHeaders,
    withCredentials: true,
  };

  if (method === "GET") {
    if (data) options.params = data;
  } else {
    if (data) options.data = data;
  }

  const response = await axios(options);
  return response.data;
};
