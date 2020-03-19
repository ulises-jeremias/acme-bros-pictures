import { push } from 'connected-react-router';

import * as songsBackend from 'app/backend/songs';
import handleError from 'app/helpers/error-handler';
import {
  SONGS_GET_REQUEST,
  SONGS_GET_SUCCESS,
  SONGS_GET_FAILURE,
} from 'app/constants';

export const fetchSongs = () => async (dispatch, getState) => {
  const { auth: { token } } = getState();
  try {
    dispatch({ type: SONGS_GET_REQUEST });
    const { data } = await songsBackend.fetchSongs(token);
    dispatch({ type: SONGS_GET_SUCCESS, payload: data });
  } catch (err) {
    const [message, redirect] = handleError(err);
    if (redirect) {
      dispatch(push(redirect));
    }
    dispatch({ type: SONGS_GET_FAILURE, payload: message });
  }
};

export default {
  fetchSongs,
};
