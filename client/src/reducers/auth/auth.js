import initialState from 'app/state/auth';
import {
  AUTH_DISMISS_ERROR,

  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,

  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
  AUTH_LOGOUT_FAILURE,

  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE,
} from 'app/constants';

const request = (state) => ({
  ...state,
  isFetching: true,
  error: '',
});

const error = (state, err) => ({
  ...state,
  error: err,
  isFetching: false,
  isAuth: false,
});

const mutations = {
  [AUTH_DISMISS_ERROR]: request,

  [AUTH_LOGIN_REQUEST]: request,
  [AUTH_LOGIN_FAILURE]: error,
  [AUTH_LOGIN_SUCCESS](state, data) {
    return {
      ...state,
      error: '',
      isFetching: false,
      isAuth: true,
      token: data.token,
    };
  },

  [AUTH_REGISTER_REQUEST]: request,
  [AUTH_REGISTER_FAILURE]: error,
  [AUTH_REGISTER_SUCCESS](state) {
    return {
      ...state,
      error: '',
      isFetching: false,
      isAuth: false,
    };
  },

  [AUTH_LOGOUT_REQUEST]: request,
  [AUTH_LOGOUT_FAILURE]: error,
  [AUTH_LOGOUT_SUCCESS]() {
    return initialState;
  },
};

/* eslint-disable-next-line */
export default (state = initialState, action) => (mutations.hasOwnProperty(action.type)
  ? mutations[action.type](state, action.payload)
  : state);
