// utils/token.js
export const tokenManager = {
  // 토큰 저장
  setToken: (token) => {
    localStorage.setItem('accessToken', token);
  },
  
  // 리프레시 토큰 저장
  setRefreshToken: (refreshToken) => {
    localStorage.setItem('refreshToken', refreshToken);
  },
  
  // 토큰 가져오기
  getToken: () => {
    return localStorage.getItem('accessToken');
  },
  
  // 리프레시 토큰 가져오기
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },
  
  // 토큰 삭제
  removeToken: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  
  // 토큰 유효성 검사 (간단한 만료 체크)
  isTokenValid: () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
};