import React from 'react';
import PropTypes from 'prop-types';

import DevTools from 'app/components/DevTools';

const App = (props) => {
  const { children } = props;

  return (
    <div style={{ height: '100%' }}>
      {React.cloneElement(children, { ...props })}
      {process.env.NODE_ENV === 'development' && <DevTools />}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
