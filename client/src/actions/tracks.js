import { push } from 'connected-react-router';

import * as tracksBackend from 'app/backend/tracks';
import handleError from 'app/helpers/error-handler';
import {
  TRACKS_TRACK_GET_REQUEST,
  TRACKS_TRACK_GET_SUCCESS,
  TRACKS_TRACK_GET_FAILURE,

  TRACKS_TRACK_CREATE_REQUEST,
  TRACKS_TRACK_CREATE_SUCCESS,
  TRACKS_TRACK_CREATE_FAILURE,
} from 'app/constants';

export const fetchTrack = (id) => async (dispatch, getState) => {
  const { auth: { token } } = getState();
  try {
    dispatch({ type: TRACKS_TRACK_GET_REQUEST });
    const { data } = await tracksBackend.fetchTrack(id, token);
    dispatch({ type: TRACKS_TRACK_GET_SUCCESS, payload: data });
  } catch (err) {
    const [message, redirect] = handleError(err);
    if (redirect) {
      dispatch(push(redirect));
    }
    dispatch({ type: TRACKS_TRACK_GET_FAILURE, payload: message });
  }
};

export const createTrack = (track) => async (dispatch, getState) => {
  const { auth: { token } } = getState();
  try {
    dispatch({ type: TRACKS_TRACK_CREATE_REQUEST });
    await tracksBackend.createTrack(track, token);
    dispatch({ type: TRACKS_TRACK_CREATE_SUCCESS });
    dispatch(push(`/projects/${track.projectId}`));
  } catch (err) {
    const [message, redirect] = handleError(err);
    if (redirect) {
      dispatch(push(redirect));
    }
    dispatch({ type: TRACKS_TRACK_CREATE_FAILURE, payload: message });
  }
};

export default {
  fetchTrack,
  createTrack,
};
