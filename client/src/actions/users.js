import { push } from 'connected-react-router';

import * as usersBackend from 'app/backend/users';
import handleError from 'app/helpers/error-handler';
import {
  USERS_GET_REQUEST,
  USERS_GET_SUCCESS,
  USERS_GET_FAILURE,
} from 'app/constants';

export const fetchUsers = () => async (dispatch, getState) => {
  const { auth: { token } } = getState();
  try {
    dispatch({ type: USERS_GET_REQUEST });
    const { data } = await usersBackend.fetchUsers(token);
    dispatch({ type: USERS_GET_SUCCESS, payload: data });
  } catch (err) {
    const [message, redirect] = handleError(err);
    if (redirect) {
      dispatch(push(redirect));
    }
    dispatch({ type: USERS_GET_FAILURE, payload: message });
  }
};

export default {
  fetchUsers,
};
