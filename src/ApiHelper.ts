import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { GetUserToken, LogOut } from "./axios/LocalStorageUtility";

class ApiHelper {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create();

    // ✅ Always attach latest token BEFORE every request
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = GetUserToken();

        if (token) {
          config.headers = config.headers || {};
          config.headers.authorization = `Bearer ${token}`; // important
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Handle auth errors globally
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          LogOut();
          console.log("Token expired or invalid");
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url);
    return response.data;
  }

  async patch<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(url);
    return response.data;
  }
}

export default new ApiHelper();