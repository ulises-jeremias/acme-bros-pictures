import { request } from 'app/lib/request';

export const login = (data) => request({
  url: '/auth/login',
  method: 'POST',
  data,
});

export const logout = () => Promise.resolve();

export default {
  login,
  logout,
};
