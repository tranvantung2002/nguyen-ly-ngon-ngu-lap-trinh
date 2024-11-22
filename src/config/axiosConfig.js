import axios from 'axios';
import { notification } from 'antd';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

const request = axios.create({
  baseURL: API_URL,
  timeout: 50000
});

const userLogout = () => {
  notification.error({ message: 'Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.' })
  localStorage.removeItem('user');
  window.location.href = '/login';
}

const handleError = async error => {
  const originalConfig = error.config;
  if (originalConfig.url.search('/auth/') === -1 && error.response) {
    if ([402, 401].includes(error.response.status) && !originalConfig._retry) {
      originalConfig._retry = true;
      //todo refresh login
      //tạm thời chưa làm refresh login thì cho logout luôn
      userLogout();
    } else if (error.response.status === 401) {
      userLogout();
    }
  }
  return Promise.reject(error?.response || error);
};

const handleSuccess = async res => {
  if (res.data?.code === 404) {
    notification.error({ message: `${res.config.url} ${res.data?.message || 'API not found'}` });
  }
  return res;
};

const handleRequest = async config => {
  const { headers } = config;
  const requestConfig = config;
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const decodeUser = JSON.parse(user);
      requestConfig.headers = { ...headers, Authorization: `Bearer ${decodeUser?.token}` };
    } catch (e) {
      localStorage.removeItem('user');
    }
  }
  return requestConfig;
};

request.interceptors.response.use(handleSuccess, handleError);
request.interceptors.request.use(handleRequest, error => Promise.reject(error));

export default request;
