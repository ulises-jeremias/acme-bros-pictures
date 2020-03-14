import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { PropsRoute } from 'app/components/Route/PropsRoute';
import AppContainer from 'app/containers/App';

import HomePage from 'app/containers/Home';
import LoginContainer from 'app/containers/Login';
import LogoutContainer from 'app/containers/Logout';

const AppRoutes = (props) => (
  <AppContainer {...props}>
    <Switch>
      <PropsRoute exact path="/" component={HomePage} authOnly {...props} />
      <PropsRoute path="/login" component={LoginContainer} redirect="/" {...props} />
      <PropsRoute path="/logout" component={LogoutContainer} {...props} />
      <Redirect to="/" />
    </Switch>
  </AppContainer>
);

export default AppRoutes;
