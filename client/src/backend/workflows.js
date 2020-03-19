import _ from 'underscore';
import moment from 'moment-timezone';
import { request } from 'app/lib/request';

export const fetchWorkflow = (id, token) => request({
  url: `/workflows/${id}`,
}, token)
  .then(({ status, data }) => ({
    status,
    data: {
      ..._.omit(data, '__tasks__'),
      tasks: data.__tasks__,
    },
  }));

export const createWorkflow = (data, token) => request({
  url: '/workflows',
  method: 'POST',
  data: {
    ...data,
    expectedStartDate: moment(data.expectedStartDate, 'dd/MM/YYYY').utc(),
  },
}, token);

export const createTask = (data, token) => request({
  url: '/tasks',
  method: 'POST',
  data,
}, token);

export default {
  fetchWorkflow,
  createWorkflow,
  createTask,
};
