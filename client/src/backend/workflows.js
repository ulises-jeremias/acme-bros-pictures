import moment from 'moment-timezone';
import { request } from 'app/lib/request';

export const fetchWorkflow = (id, token) => request({
  url: `/workflows/${id}`,
}, token);

export const createWorkflow = (data, token) => request({
  url: '/workflows',
  method: 'POST',
  data: {
    ...data,
    expectedStartDate: moment(data.expectedStartDate, 'dd/MM/YYYY').utc(),
  },
}, token);

export default {
  fetchWorkflow,
  createWorkflow,
};
