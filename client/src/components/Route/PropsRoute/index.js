import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

export const renderMergedProps = (component, ...rest) => (
  React.createElement(component, Object.assign({}, ...rest))
);

export const PropsRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={(routeProps) => renderMergedProps(component, routeProps, rest)}
  />
);

PropsRoute.propTypes = {
  component: PropTypes.func.isRequired,
};
