import initialState from 'app/state/tracks';
import {
  AUTH_LOGOUT_SUCCESS,

  TRACKS_TRACK_GET_REQUEST,
  TRACKS_TRACK_GET_SUCCESS,
  TRACKS_TRACK_GET_FAILURE,

  TRACKS_TRACK_CREATE_REQUEST,
  TRACKS_TRACK_CREATE_SUCCESS,
  TRACKS_TRACK_CREATE_FAILURE,
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
  [TRACKS_TRACK_GET_REQUEST]: request,
  [TRACKS_TRACK_GET_FAILURE]: error,
  [TRACKS_TRACK_GET_SUCCESS](state, track) {
    return {
      ...state,
      error: '',
      success: true,
      isFetching: false,
      track,
    };
  },

  [TRACKS_TRACK_CREATE_REQUEST]: request,
  [TRACKS_TRACK_CREATE_FAILURE]: error,
  [TRACKS_TRACK_CREATE_SUCCESS](state) {
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
