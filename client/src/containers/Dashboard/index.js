import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { useAuth } from 'app/lib/hooks/auth-hook';

import DashboardContainer from './DashboardContainer';

const AuthorizedDashboardContainer = (props) => {
  const {
    authOnly,
    redirect,
  } = props;

  const { nextRoute, user } = useAuth({ authOnly, redirect });

  if (nextRoute) {
    return <Redirect to={nextRoute} />;
  }

  return <DashboardContainer {...props} user={user} />;
};

AuthorizedDashboardContainer.defaultProps = {
  authOnly: false,
  redirect: '',
};

AuthorizedDashboardContainer.propTypes = {
  authOnly: PropTypes.bool,
  redirect: PropTypes.string,
};

export default AuthorizedDashboardContainer;
