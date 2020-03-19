import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { PropsRoute } from 'app/components/Route/PropsRoute';
import AppContainer from 'app/containers/App';

import DashboardPage from 'app/containers/Dashboard';
import LoginContainer from 'app/containers/Login';
import LogoutContainer from 'app/containers/Logout';

const AppRoutes = (props) => (
  <AppContainer {...props}>
    <Switch>
      <PropsRoute path="/login" component={LoginContainer} {...props} />
      <PropsRoute path="/logout" component={LogoutContainer} {...props} />
      <PropsRoute path="/" component={DashboardPage} authOnly {...props} />
      <Redirect to="/" />
    </Switch>
  </AppContainer>
);

export default AppRoutes;
