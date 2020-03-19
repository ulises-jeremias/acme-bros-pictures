import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { useAuth } from 'app/lib/hooks/auth-hook';

import RegisterContainer from './RegisterContainer';

const AuthorizedRegisterContainer = (props) => {
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

  return <RegisterContainer {...props} />;
};

AuthorizedRegisterContainer.defaultProps = {
  authOnly: false,
  redirect: '',
};

AuthorizedRegisterContainer.propTypes = {
  authOnly: PropTypes.bool,
  redirect: PropTypes.string,
};

export default AuthorizedRegisterContainer;
