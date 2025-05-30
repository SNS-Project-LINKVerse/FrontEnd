// utils/api.js
import axios from 'axios';
import { tokenManager } from './token';

const API_BASE_URL = 'api';

// Axios �ν��Ͻ� ����
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ��û ���ͼ��� - ��ū �ڵ� �߰�
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ���� ���ͼ��� - ��ū ���� �� �ڵ� �α׾ƿ�
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ���� ���� API
export const authAPI = {
  // ȸ������
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // �α���
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      tokenManager.setToken(response.data.data.token);
      if (response.data.data.refreshToken) {
        tokenManager.setRefreshToken(response.data.data.refreshToken);
      }
    }
    return response.data;
  },
  
  // �α׾ƿ�
  logout: () => {
    tokenManager.removeToken();
  },
  
  // ����� ���� �������� (�鿣�忡 �°� ����)
  getProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }
};

// ����Ʈ ���� API
export const postAPI = {
  // �Խñ� ����
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },
  
  // �Խñ� ��� ��ȸ
  getFeedPosts: async (page = 0, size = 20) => {
    const response = await api.get(`/feed?page=${page}&size=${size}`);
    return response.data;
  },
  
  getFollowingFeedPosts: async (page = 0, size = 20) => {
    const response = await api.get(`/feed/following?page=${page}&size=${size}`);
    return response.data;
  },

  // ����� �Խñ� ��ȸ
  getUserPosts: async (userId, page = 0, size = 20) => {
    const response = await api.get(`/users/${userId}/posts?page=${page}&size=${size}`);
    return response.data;
  }
};

// �̵�� ���� API
export const mediaAPI = {
  // ���� ���ε�
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // ���� �ٿ�ε� URL ����
  getFileUrl: (filename) => {
    return `${API_BASE_URL}/media/${filename}`;
  }
};

// ���ƿ� ���� API
export const likeAPI = {
  // ���ƿ� ���
  toggleLike: async (targetType, targetId) => {
    const response = await api.post(`/likes/${targetType}/${targetId}`);
    return response.data;
  },
  
  // ���ƿ� ��� ��ȸ
  getLikes: async (targetType, targetId, page = 0, size = 20) => {
    const response = await api.get(`/likes/${targetType}/${targetId}?page=${page}&size=${size}`);
    return response.data;
  }
};

// ��� ���� API
export const commentAPI = {
  // ��� �ۼ�
  createComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },
  
  // �Խñ� ��� ��ȸ
  getPostComments: async (postId, page = 0, size = 20) => {
    const response = await api.get(`/posts/${postId}/comments?page=${page}&size=${size}`);
    return response.data;
  },
  
  // ��� ����
  updateComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },
  
  // ��� ����
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }
};

// �ȷο� ���� API
export const followAPI = {
  // �ȷο� ���
  toggleFollow: async (followingId) => {
    const response = await api.post(`/follow/${followingId}`);
    return response.data;
  },
  
  // �ȷο� ���
  getFollowers: async (userId, page = 0, size = 20) => {
    const response = await api.get(`/users/${userId}/followers?page=${page}&size=${size}`);
    return response.data;
  },
  
  // �ȷ��� ���
  getFollowing: async (userId, page = 0, size = 20) => {
    const response = await api.get(`/users/${userId}/following?page=${page}&size=${size}`);
    return response.data;
  }
};

// �ϸ�ũ ���� API
export const bookmarkAPI = {
  // �ϸ�ũ ���
  toggleBookmark: async (postId, collectionId = null) => {
    const url = collectionId 
      ? `/bookmarks/${postId}?collectionId=${collectionId}` 
      : `/bookmarks/${postId}`;
    const response = await api.post(url);
    return response.data;
  },
  
  // ����� �ϸ�ũ ��ȸ
  getUserBookmarks: async (page = 0, size = 20) => {
    const response = await api.get(`/bookmarks?page=${page}&size=${size}`);
    return response.data;
  },
  
  // �÷��� ����
  createCollection: async (name) => {
    const response = await api.post('/collections', { name });
    return response.data;
  },
  
  // ����� �÷��� ��ȸ
  getUserCollections: async () => {
    const response = await api.get('/collections');
    return response.data;
  }
};

// �˻� ���� API
export const searchAPI = {
  // ����� �˻�
  searchUsers: async (keyword, page = 0, size = 20) => {
    const response = await api.get(`/search/users?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    return response.data;
  },
  
  // �Խñ� �˻�
  searchPosts: async (keyword, page = 0, size = 20) => {
    const response = await api.get(`/search/posts?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    return response.data;
  },
  
  // �ؽ��±� �˻�
  searchHashtags: async (keyword, limit = 10) => {
    const response = await api.get(`/search/hashtags?keyword=${encodeURIComponent(keyword)}&limit=${limit}`);
    return response.data;
  },
  
  // Ʈ���� �ؽ��±�
  getTrendingHashtags: async (limit = 10) => {
    const response = await api.get(`/hashtags/trending?limit=${limit}`);
    return response.data;
  }
};

// �޽��� ���� API
export const messageAPI = {
  // �޽��� ����
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },
  
  // ��ȭ ��ȸ
  getConversation: async (otherUserId, page = 0, size = 20) => {
    const response = await api.get(`/messages/users/${otherUserId}?page=${page}&size=${size}`);
    return response.data;
  },
  
  // �ֱ� ��ȭ ���
  getRecentConversations: async (page = 0, size = 20) => {
    const response = await api.get(`/messages/recent?page=${page}&size=${size}`);
    return response.data;
  },
  
  // �޽��� ���� ó��
  markAsRead: async (messageIds) => {
    const response = await api.put('/messages/read', messageIds);
    return response.data;
  },
  
  // �¶��� ����� ���
  getOnlineUsers: async () => {
    const response = await api.get('/messages/online-users');
    return response.data;
  },
  
  // ����� �¶��� ���� Ȯ��
  checkUserOnlineStatus: async (userId) => {
    const response = await api.get(`/messages/users/${userId}/online-status`);
    return response.data;
  }
};

// �˸� ���� API
export const notificationAPI = {
  // �˸� ��� ��ȸ
  getNotifications: async (page = 0, size = 20) => {
    const response = await api.get(`/notifications?page=${page}&size=${size}`);
    return response.data;
  },
  
  // ���� ���� �˸� ����
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
  },
  
  // �˸� ���� ó��
  markAsRead: async (notificationIds) => {
    const response = await api.put('/notifications/read', notificationIds);
    return response.data;
  }
};

export default api;