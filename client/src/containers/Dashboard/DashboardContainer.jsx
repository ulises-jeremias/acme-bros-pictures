import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Responsive,
} from 'semantic-ui-react';

import Navbar from 'app/components/Layout/Navbar';
import Sidebar from 'app/components/Layout/Sidebar';
import DashboardRoutes from '../../routes/dashboard';

const DashboardContainer = (props) => {
  const { translate, user, match } = props;

  const [smallMenu, setSmallMenu] = useState(false);
  const [previousWidth, setPreviousWidth] = useState(null);

  return (
    <>
      <Responsive
        fireOnMount
        onUpdate={(e, { width }) => {
          if (width !== previousWidth) {
            setPreviousWidth(width);
            setSmallMenu(width < 976);
          }
        }}
      />
      <Navbar
        user={user}
        logo={null}
        smallMenu={smallMenu}
        showTitle
        showProfilePath={false}
        sidebar
        onChangeSizeButtonClick={() => setSmallMenu(!smallMenu)}
        translate={(name, ...args) => translate(`navbar:${name}`, ...args)}
      />
      <Sidebar
        smallMenu={smallMenu}
        translate={(name, ...args) => translate(`sidebar:${name}`, ...args)}
      >
        <DashboardRoutes match={match} translate={translate} />
      </Sidebar>
    </>
  );
};

DashboardContainer.propTypes = {
  translate: PropTypes.func.isRequired,
  user: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
};

export default DashboardContainer;
