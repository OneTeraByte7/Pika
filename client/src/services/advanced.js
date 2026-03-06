import api from './api';

export const analyticsAPI = {
    analyzePosts: (userId, posts) => 
        api.post('/advanced/analytics/posts', { user_id: userId, posts }),
    
    calculateEngagementRate: (likes, comments, shares, followers) =>
        api.get('/advanced/analytics/engagement-rate', { 
            params: { likes, comments, shares, followers } 
        }),
    
    checkVirality: (postId, postData) =>
        api.get(`/advanced/analytics/virality/${postId}`, { params: postData }),
};

export const schedulerAPI = {
    schedulePost: (data) => 
        api.post('/advanced/scheduler/schedule', data),
    
    getUpcomingPosts: (userId, days = 7) =>
        api.get(`/advanced/scheduler/upcoming/${userId}`, { params: { days } }),
    
    cancelPost: (postId) =>
        api.delete(`/advanced/scheduler/cancel/${postId}`),
    
    getAnalytics: (userId) =>
        api.get(`/advanced/scheduler/analytics/${userId}`),
};

export const sentimentAPI = {
    analyzeText: (text) =>
        api.post('/advanced/sentiment/analyze', { text }),
    
    analyzeComments: (comments) =>
        api.post('/advanced/sentiment/analyze', { comments }),
    
    detectToxicity: (text) =>
        api.post('/advanced/sentiment/toxicity', null, { params: { text } }),
    
    analyzeEmotions: (text) =>
        api.get('/advanced/sentiment/emotions', { params: { text } }),
};

export const notificationsAPI = {
    create: (data) =>
        api.post('/advanced/notifications/create', data),
    
    getNotifications: (userId, unreadOnly = false, limit = 50) =>
        api.get(`/advanced/notifications/${userId}`, { 
            params: { unread_only: unreadOnly, limit } 
        }),
    
    getDigest: (userId, hours = 24) =>
        api.get(`/advanced/notifications/digest/${userId}`, { params: { hours } }),
    
    markAsRead: (notificationIds) =>
        api.post('/advanced/notifications/mark-read', notificationIds),
};

export const mediaAPI = {
    validateMedia: (fileName, fileSize) =>
        api.post('/advanced/media/validate', null, { 
            params: { file_name: fileName, file_size: fileSize } 
        }),
    
    getPlatformSpecs: (platform, mediaType) =>
        api.get('/advanced/media/platform-specs', { 
            params: { platform, media_type: mediaType } 
        }),
    
    generateUploadUrl: (fileName, mediaType) =>
        api.post('/advanced/media/upload-url', null, { 
            params: { file_name: fileName, media_type: mediaType } 
        }),
};

export const exportAPI = {
    exportPosts: (posts, formatType) =>
        api.post('/advanced/export/posts', posts, { 
            params: { format_type: formatType } 
        }),
    
    exportUserData: (userId, userData, posts, formatType) =>
        api.post('/advanced/export/user-data', { 
            user_id: userId, 
            user_data: userData, 
            posts, 
            format_type: formatType 
        }),
};

export const recommendationsAPI = {
    getTopicSuggestions: (userId, category = null) =>
        api.post('/advanced/recommendations/topics', { 
            user_id: userId, 
            category 
        }),
    
    getOptimalTimes: (userId) =>
        api.get(`/advanced/recommendations/optimal-times/${userId}`),
    
    getContentIdeas: (userId, platform = null) =>
        api.post('/advanced/recommendations/content-ideas', { 
            user_id: userId, 
            platform 
        }),
};

export const engagementAPI = {
    trackEngagement: (userId, platform, engagementType, value) =>
        api.post('/advanced/engagement/track', { 
            user_id: userId, 
            platform, 
            engagement_type: engagementType, 
            value 
        }),
    
    getEngagementScore: (userId, days = 30) =>
        api.get(`/advanced/engagement/score/${userId}`, { params: { days } }),
    
    getRetentionMetrics: (userId) =>
        api.get(`/advanced/engagement/retention/${userId}`),
};
