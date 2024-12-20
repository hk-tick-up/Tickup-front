// src/lib/axios.ts

import axios from 'axios';

const BACKEND_URL=process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
    //localhost
    baseURL: `${BACKEND_URL}/api/v1`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('bearer');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.clear();
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default api;