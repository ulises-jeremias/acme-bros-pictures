import React, { useState } from 'react';
import {
  Segment,
  Responsive,
} from 'semantic-ui-react';

import Navbar from 'app/components/Layout/Navbar';

const HomeContainer = ({ translate, user }) => {
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
        onChangeSizeButtonClick={() => setSmallMenu(!smallMenu)}
        translate={(name, ...args) => translate(`analysis:${name}`, ...args)}
      />
      <div className="container-content">
        <Segment />
      </div>
    </>
  );
};

export default HomeContainer;
