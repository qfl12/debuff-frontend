import axios from 'axios';

// 创建axios实例
const service = axios.create({
    baseURL: '/api', // 使用相对路径以便局域网访问
    timeout: 5000, // 请求超时时间
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加CSRF令牌
    const xsrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$)|^.*$/, '$1');
    if (xsrfToken) {
      config.headers['X-XSRF-TOKEN'] = xsrfToken;
    }
    // 添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对blob类型响应特殊处理
    if (response.config.responseType === 'blob') {
      return response;
    }
    return response.data;
  },
  error => {
    // 统一错误处理
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default service;