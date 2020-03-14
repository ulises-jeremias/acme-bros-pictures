import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from 'app/lib/hooks/auth-hook';
import HomeContainer from './HomeContainer';

const AuthorizedHomeContainer = (props) => {
  const {
    authOnly,
    roles,
    redirect,
  } = props;

  const { user, nextRoute } = useAuth({ authOnly, roles, redirect });

  if (nextRoute) {
    return <Redirect to={nextRoute} />;
  }

  return <HomeContainer {...props} user={user} />;
};

export default AuthorizedHomeContainer;
