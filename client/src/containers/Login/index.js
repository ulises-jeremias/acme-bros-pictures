import React from 'react';
import PropTypes from 'prop-types';
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

AuthorizedLoginContainer.defaultProps = {
  authOnly: false,
  redirect: '',
};

AuthorizedLoginContainer.propTypes = {
  authOnly: PropTypes.bool,
  redirect: PropTypes.string,
};

export default AuthorizedLoginContainer;
