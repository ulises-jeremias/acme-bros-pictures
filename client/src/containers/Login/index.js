import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from 'app/lib/hooks/auth-hook';
import LoginContainer from './LoginContainer';

const AuthorizedLoginContainer = (props) => {
  const {
    authOnly,
    redirect,
  } = props;

  const { isAuth, nextRoute } = useAuth({ authOnly, redirect });

  if (nextRoute) {
    return <Redirect to={nextRoute} />;
  }

  if (isAuth) {
    return <Redirect to="/" />;
  }

  return <LoginContainer {...props} />;
};

export default AuthorizedLoginContainer;
