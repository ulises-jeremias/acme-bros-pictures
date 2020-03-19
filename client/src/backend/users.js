import { request } from 'app/lib/request';

export const fetchUsers = (token) => request({
  url: '/users',
}, token);

export default {
  fetchUsers,
};
