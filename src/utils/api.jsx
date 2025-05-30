// utils/api.js
import axios from 'axios';
import { tokenManager } from './token';

const API_BASE_URL = 'api';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
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

// 응답 인터셉터 - 토큰 만료 시 자동 로그아웃
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

// 인증 관련 API
export const authAPI = {
  // 회원가입
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // 로그인
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
  
  // 로그아웃
  logout: () => {
    tokenManager.removeToken();
  },
  
  // 사용자 정보 가져오기 (백엔드에 맞게 수정)
  getProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }
};

// 포스트 관련 API
export const postAPI = {
  // 게시글 생성
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },
  
  // 게시글 목록 조회
  getFeedPosts: async (page = 0, size = 20) => {
    const response = await api.get(`/feed?page=${page}&size=${size}`);
    return response.data;
  },
  
  getFollowingFeedPosts: async (page = 0, size = 20) => {
    const response = await api.get(`/feed/following?page=${page}&size=${size}`);
    return response.data;
  },

  // 사용자 게시글 조회
  getUserPosts: async (userId, page = 0, size = 20) => {
    const response = await api.get(`/users/${userId}/posts?page=${page}&size=${size}`);
    return response.data;
  }
};

// 미디어 관련 API
export const mediaAPI = {
  // 파일 업로드
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
  
  // 파일 다운로드 URL 생성
  getFileUrl: (filename) => {
    return `${API_BASE_URL}/media/${filename}`;
  }
};

// 좋아요 관련 API
export const likeAPI = {
  // 좋아요 토글
  toggleLike: async (targetType, targetId) => {
    const response = await api.post(`/likes/${targetType}/${targetId}`);
    return response.data;
  },
  
  // 좋아요 목록 조회
  getLikes: async (targetType, targetId, page = 0, size = 20) => {
    const response = await api.get(`/likes/${targetType}/${targetId}?page=${page}&size=${size}`);
    return response.data;
  }
};

// 댓글 관련 API
export const commentAPI = {
  // 댓글 작성
  createComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },
  
  // 게시글 댓글 조회
  getPostComments: async (postId, page = 0, size = 20) => {
    const response = await api.get(`/posts/${postId}/comments?page=${page}&size=${size}`);
    return response.data;
  },
  
  // 댓글 수정
  updateComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },
  
  // 댓글 삭제
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }
};

// 팔로우 관련 API
export const followAPI = {
  // 팔로우 토글
  toggleFollow: async (followingId) => {
    const response = await api.post(`/follow/${followingId}`);
    return response.data;
  },
  
  // 팔로워 목록
  getFollowers: async (userId, page = 0, size = 20) => {
    const response = await api.get(`/users/${userId}/followers?page=${page}&size=${size}`);
    return response.data;
  },
  
  // 팔로잉 목록
  getFollowing: async (userId, page = 0, size = 20) => {
    const response = await api.get(`/users/${userId}/following?page=${page}&size=${size}`);
    return response.data;
  }
};

// 북마크 관련 API
export const bookmarkAPI = {
  // 북마크 토글
  toggleBookmark: async (postId, collectionId = null) => {
    const url = collectionId 
      ? `/bookmarks/${postId}?collectionId=${collectionId}` 
      : `/bookmarks/${postId}`;
    const response = await api.post(url);
    return response.data;
  },
  
  // 사용자 북마크 조회
  getUserBookmarks: async (page = 0, size = 20) => {
    const response = await api.get(`/bookmarks?page=${page}&size=${size}`);
    return response.data;
  },
  
  // 컬렉션 생성
  createCollection: async (name) => {
    const response = await api.post('/collections', { name });
    return response.data;
  },
  
  // 사용자 컬렉션 조회
  getUserCollections: async () => {
    const response = await api.get('/collections');
    return response.data;
  }
};

// 검색 관련 API
export const searchAPI = {
  // 사용자 검색
  searchUsers: async (keyword, page = 0, size = 20) => {
    const response = await api.get(`/search/users?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    return response.data;
  },
  
  // 게시글 검색
  searchPosts: async (keyword, page = 0, size = 20) => {
    const response = await api.get(`/search/posts?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
    return response.data;
  },
  
  // 해시태그 검색
  searchHashtags: async (keyword, limit = 10) => {
    const response = await api.get(`/search/hashtags?keyword=${encodeURIComponent(keyword)}&limit=${limit}`);
    return response.data;
  },
  
  // 트렌딩 해시태그
  getTrendingHashtags: async (limit = 10) => {
    const response = await api.get(`/hashtags/trending?limit=${limit}`);
    return response.data;
  }
};

// 메시지 관련 API
export const messageAPI = {
  // 메시지 전송
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },
  
  // 대화 조회
  getConversation: async (otherUserId, page = 0, size = 20) => {
    const response = await api.get(`/messages/users/${otherUserId}?page=${page}&size=${size}`);
    return response.data;
  },
  
  // 최근 대화 목록
  getRecentConversations: async (page = 0, size = 20) => {
    const response = await api.get(`/messages/recent?page=${page}&size=${size}`);
    return response.data;
  },
  
  // 메시지 읽음 처리
  markAsRead: async (messageIds) => {
    const response = await api.put('/messages/read', messageIds);
    return response.data;
  },
  
  // 온라인 사용자 목록
  getOnlineUsers: async () => {
    const response = await api.get('/messages/online-users');
    return response.data;
  },
  
  // 사용자 온라인 상태 확인
  checkUserOnlineStatus: async (userId) => {
    const response = await api.get(`/messages/users/${userId}/online-status`);
    return response.data;
  }
};

// 알림 관련 API
export const notificationAPI = {
  // 알림 목록 조회
  getNotifications: async (page = 0, size = 20) => {
    const response = await api.get(`/notifications?page=${page}&size=${size}`);
    return response.data;
  },
  
  // 읽지 않은 알림 개수
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
  },
  
  // 알림 읽음 처리
  markAsRead: async (notificationIds) => {
    const response = await api.put('/notifications/read', notificationIds);
    return response.data;
  }
};

export default api;