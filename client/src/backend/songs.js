import { request } from 'app/lib/request';

export const fetchSongs = (token) => request({
  url: '/songs',
}, token);

export default {
  fetchSongs,
};
