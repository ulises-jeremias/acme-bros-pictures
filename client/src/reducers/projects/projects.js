import initialState from 'app/state/projects';
import {
  AUTH_LOGOUT_SUCCESS,

  PROJECTS_GET_REQUEST,
  PROJECTS_GET_SUCCESS,
  PROJECTS_GET_FAILURE,

  PROJECTS_PROJECT_GET_REQUEST,
  PROJECTS_PROJECT_GET_SUCCESS,
  PROJECTS_PROJECT_GET_FAILURE,

  PROJECTS_PROJECT_CREATE_REQUEST,
  PROJECTS_PROJECT_CREATE_SUCCESS,
  PROJECTS_PROJECT_CREATE_FAILURE,
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
  [PROJECTS_GET_REQUEST]: request,
  [PROJECTS_GET_FAILURE]: error,
  [PROJECTS_GET_SUCCESS](state, projects) {
    return {
      ...state,
      error: '',
      success: true,
      isFetching: false,
      projects,
    };
  },

  [PROJECTS_PROJECT_GET_REQUEST]: request,
  [PROJECTS_PROJECT_GET_FAILURE]: error,
  [PROJECTS_PROJECT_GET_SUCCESS](state, project) {
    return {
      ...state,
      error: '',
      success: true,
      isFetching: false,
      project,
    };
  },

  [PROJECTS_PROJECT_CREATE_REQUEST]: request,
  [PROJECTS_PROJECT_CREATE_FAILURE]: error,
  [PROJECTS_PROJECT_CREATE_SUCCESS](state) {
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
