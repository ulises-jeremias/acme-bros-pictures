import { request } from 'app/lib/request';

export const login = (data) => request({
  url: '/auth/login',
  method: 'POST',
  data,
});

export const logout = () => Promise.resolve();

export const register = (data) => request({
  url: '/auth',
  method: 'POST',
  data,
});

export default {
  login,
  logout,
  register,
};
