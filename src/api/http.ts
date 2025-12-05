import 'axios';
import axios, { type AxiosInstance } from 'axios';

const ibpvApi: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_IBPV_API_URL,
});

export default ibpvApi;