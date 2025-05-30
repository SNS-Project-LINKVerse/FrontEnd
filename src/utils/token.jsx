// utils/token.js
export const tokenManager = {
  // ��ū ����
  setToken: (token) => {
    localStorage.setItem('accessToken', token);
  },
  
  // �������� ��ū ����
  setRefreshToken: (refreshToken) => {
    localStorage.setItem('refreshToken', refreshToken);
  },
  
  // ��ū ��������
  getToken: () => {
    return localStorage.getItem('accessToken');
  },
  
  // �������� ��ū ��������
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },
  
  // ��ū ����
  removeToken: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  
  // ��ū ��ȿ�� �˻� (������ ���� üũ)
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