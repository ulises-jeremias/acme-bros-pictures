import initialState from 'app/state/workflows';
import {
  AUTH_LOGOUT_SUCCESS,

  WORKFLOWS_WORKFLOW_GET_REQUEST,
  WORKFLOWS_WORKFLOW_GET_SUCCESS,
  WORKFLOWS_WORKFLOW_GET_FAILURE,

  WORKFLOWS_WORKFLOW_CREATE_REQUEST,
  WORKFLOWS_WORKFLOW_CREATE_SUCCESS,
  WORKFLOWS_WORKFLOW_CREATE_FAILURE,
} from 'app/constants';

const request = (state) => ({
  ...state,
  isFetching: true,
  error: '',
});

const error = (state, err) => ({
  ...state,
  error: err,
  success: false,
  isFetching: false,
});

const mutations = {
  [WORKFLOWS_WORKFLOW_GET_REQUEST]: request,
  [WORKFLOWS_WORKFLOW_GET_FAILURE]: error,
  [WORKFLOWS_WORKFLOW_GET_SUCCESS](state, workflow) {
    return {
      ...state,
      error: '',
      success: true,
      isFetching: false,
      workflow,
    };
  },

  [WORKFLOWS_WORKFLOW_CREATE_REQUEST]: request,
  [WORKFLOWS_WORKFLOW_CREATE_FAILURE]: error,
  [WORKFLOWS_WORKFLOW_CREATE_SUCCESS](state) {
    return {
      ...state,
      error: '',
      success: true,
      isFetching: false,
    };
  },

  [AUTH_LOGOUT_SUCCESS]() {
    return initialState;
  },
};

/* eslint-disable-next-line */
export default (state = initialState, action) => (mutations.hasOwnProperty(action.type)
  ? mutations[action.type](state, action.payload)
  : state);
