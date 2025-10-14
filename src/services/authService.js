import api from './api';

const authService = {
  // 회원가입
  register: async (data) => {
    return await api.post('/auth/register', data);
  },

  // 로그인
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },
};

export default authService;
