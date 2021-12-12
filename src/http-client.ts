import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

axios.interceptors.response.use(
    (response) => response.data,
    (error) => {
        throw error;
    }
);
export const request = async <T>(config: AxiosRequestConfig<T>): Promise<T> =>
    await axios.request({
        ...config,
        paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
    });
