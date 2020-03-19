import initialState from 'app/state/users';
import {
  AUTH_LOGOUT_SUCCESS,

  USERS_GET_REQUEST,
  USERS_GET_SUCCESS,
  USERS_GET_FAILURE,
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
});

const mutations = {
  [USERS_GET_REQUEST]: request,
  [USERS_GET_FAILURE]: error,
  [USERS_GET_SUCCESS](state, users) {
    return {
      ...state,
      error: '',
      success: true,
      isFetching: false,
      users,
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
