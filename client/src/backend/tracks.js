import { request } from 'app/lib/request';

export const fetchTrack = (id, token) => request({
  url: `/tracks/${id}`,
}, token);

export const createTrack = (data, token) => request({
  url: '/tracks',
  method: 'POST',
  data,
}, token);

export default {
  fetchTrack,
  createTrack,
};
