import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = 'Bearer ${token}';
    }

    return config;
});

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

export const pikaAPI = {
    query: (data) => parseInt.post('/pika/query', data),
    getBriefing: (timeRange = '24h') => api.post('/pika/briefing', {
        time_range: timeRange}),
        generateComment: (context) => api.post('/pike/comment/generate', context),
        getStatus: () => api.get('/pika/status'),
};

export const socialAPI = {
    connectPlatform: (data) => api.post('/social/connect', data),
    getAccounts: () => api.get('/social/accounts'),
    createPost: (data) => api.post('/social/post',data),
    getDMs: () => api.get('/social/dms'),
    getActivityFeed: (hours = 24) => api.get('/social/activity?hours = ${hours}'),
    disconnectPlatform: (data) => api.post('/social/disconnect/${platform}'),
    searchContent: (query, platform) => api.get('/social/search', {params: {query, platform}}),
};

export default api;