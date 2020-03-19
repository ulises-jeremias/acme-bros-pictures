import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

export const useAuth = (opt = {}) => {
  const { token, isFetching, user } = useSelector(
    (state) => ({
      token: state.auth.token,
      isFetching: state.auth.isFetching,
      user: state.auth.user,
    }),
    shallowEqual,
  );

  const isAuth = token && !isFetching;

  const [redirect, setRedirect] = useState('');
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    setUserInfo(user);

    if (opt.authOnly && !isAuth) {
      setRedirect('/logout');
    }
  }, [isAuth, token]);

  return {
    isAuth,
    token,
    user: userInfo,
    nextRoute: redirect,
  };
};

export default {
  useAuth,
};
