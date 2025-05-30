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

  // �ʱ� �ε� �� ��ū Ȯ��
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (tokenManager.isTokenValid()) {
          // ��ū���� ����� ID �����Ͽ� ������ ��ȸ
          const token = tokenManager.getToken();
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.sub; // JWT�� subject���� ����� ID ����
          
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

  // �α���
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
          message: response.message || '�α��ο� �����߽��ϴ�.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || '�α��ο� �����߽��ϴ�.' 
      };
    }
  };

  // ȸ������
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.success) {
        return { success: true, message: response.message || 'ȸ�������� �Ϸ�Ǿ����ϴ�.' };
      } else {
        return { 
          success: false, 
          message: response.message || 'ȸ�����Կ� �����߽��ϴ�.' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'ȸ�����Կ� �����߽��ϴ�.' 
      };
    }
  };

  // �α׾ƿ�
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // ����� ���� ������Ʈ
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