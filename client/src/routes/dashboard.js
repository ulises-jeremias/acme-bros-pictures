import React from 'react';
import { Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import { PropsRoute } from 'app/components/Route/PropsRoute';
import ProjectPage from 'app/containers/Project';
import ProjectsPage from 'app/containers/Projects';
import ProjectCreatePage from 'app/containers/ProjectCreate';
import TrackCreatePage from 'app/containers/TrackCreate';
import WorkflowPage from 'app/containers/Workflow';
import WorkflowCreatePage from 'app/containers/WorkflowCreate';

const DashboardRoutes = (props) => (
  <Switch>
    <PropsRoute path="/projects/create" component={ProjectCreatePage} {...props} />
    <PropsRoute path="/projects/:id/tracks/create" component={TrackCreatePage} {...props} />
    <PropsRoute path="/projects/:id" component={ProjectPage} {...props} />
    <PropsRoute path="/tracks/:id/workflow/create" component={WorkflowCreatePage} {...props} />
    <PropsRoute path="/workflows/:id" component={WorkflowPage} {...props} />
    <PropsRoute path="/" component={ProjectsPage} {...props} />
  </Switch>
);

DashboardRoutes.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
};

export default DashboardRoutes;
