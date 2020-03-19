import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'semantic-ui-react';
import {
  NOT_WATCHING,
  RELEASES_ONLY,
  WATCHING,
  IGNORING,
} from 'app/config/enums';

const icons = {
  [NOT_WATCHING]: 'eye slash',
  [RELEASES_ONLY]: 'low vision',
  [WATCHING]: 'eye',
  [IGNORING]: 'bell slash outline',
};

export const WatchingIcon = ({ watching, ...props }) => (
  <Icon name={icons[watching]} size="small" color="grey" {...props} />
);

export const WatchingButton = ({ watching, ...props }) => (
  <Button icon={icons[watching]} style={{ color: 'grey' }} size="small" color="grey" {...props} />
);

WatchingIcon.propTypes = {
  watching: PropTypes.oneOf([NOT_WATCHING, RELEASES_ONLY, WATCHING, IGNORING]).isRequired,
};

WatchingButton.propTypes = {
  watching: PropTypes.oneOf([NOT_WATCHING, RELEASES_ONLY, WATCHING, IGNORING]).isRequired,
};

export default {
  WatchingIcon,
  WatchingButton,
};
