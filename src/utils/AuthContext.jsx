//  utils/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { tokenManager } from './token';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 초기 로딩 시 토큰 확인
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (tokenManager.isTokenValid()) {
          // 토큰에서 사용자 ID 추출하여 프로필 조회
          const token = tokenManager.getToken();
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.sub; // JWT의 subject에서 사용자 ID 추출
          
          const userData = await authAPI.getProfile(userId);
          if (userData.success) {
            setUser(userData.data);
            setIsAuthenticated(true);
          } else {
            throw new Error('Failed to get user profile');
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        tokenManager.removeToken();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 로그인
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      } else {
        return { 
          success: false, 
          message: response.message || '로그인에 실패했습니다.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || '로그인에 실패했습니다.' 
      };
    }
  };

  // 회원가입
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.success) {
        return { success: true, message: response.message || '회원가입이 완료되었습니다.' };
      } else {
        return { 
          success: false, 
          message: response.message || '회원가입에 실패했습니다.' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || '회원가입에 실패했습니다.' 
      };
    }
  };

  // 로그아웃
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // 사용자 정보 업데이트
  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};