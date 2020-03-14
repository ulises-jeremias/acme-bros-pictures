import { push } from 'connected-react-router';

import * as authBackend from 'app/backend/auth';
import handleError from 'app/helpers/error-handler';
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,

  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
  AUTH_LOGOUT_FAILURE,
} from 'app/constants';

export const login = (values) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_LOGIN_REQUEST });
    const { data } = await authBackend.login(values);
    dispatch({ type: AUTH_LOGIN_SUCCESS, payload: { token: data } });
  } catch (err) {
    const [message, redirect] = handleError(err, { onUnauthorizedRedirect: false });
    if (redirect) {
      dispatch(push(redirect));
    }
    dispatch({ type: AUTH_LOGIN_FAILURE, payload: message });
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: AUTH_LOGOUT_REQUEST });
    await authBackend.logout();
    dispatch({ type: AUTH_LOGOUT_SUCCESS });
  } catch (err) {
    dispatch({ type: AUTH_LOGOUT_FAILURE });
  }
};

export default {
  login,
  logout,
};
