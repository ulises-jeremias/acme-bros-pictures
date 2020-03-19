import initialState from 'app/state/songs';
import {
  AUTH_LOGOUT_SUCCESS,

  SONGS_GET_REQUEST,
  SONGS_GET_SUCCESS,
  SONGS_GET_FAILURE,
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
  [SONGS_GET_REQUEST]: request,
  [SONGS_GET_FAILURE]: error,
  [SONGS_GET_SUCCESS](state, songs) {
    return {
      ...state,
      error: '',
      success: true,
      isFetching: false,
      songs,
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
