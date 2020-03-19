import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
  Grid,
  Message,
} from 'semantic-ui-react';

import { register } from 'app/actions/auth';
import RegisterForm from 'app/containers/Register/RegisterFormContainer';
import { Link } from 'react-router-dom';

const RegisterContainer = (props) => {
  const { translate } = props;
  const error = useSelector((state) => state.auth.error, shallowEqual);
  const dispatch = useDispatch();

  const onSubmit = (values) => dispatch(register(values));

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        {error && (
          <Message negative>
            <Message.Header>{error}</Message.Header>
          </Message>
        )}
        <RegisterForm
          translate={(name, ...args) => translate(`register:${name}`, ...args)}
          onSubmit={onSubmit}
        />
        <Message style={{ borderRadius: 0, textAlign: 'left' }}>
          {translate('register:ask')}
          <Link style={{ marginLeft: '5px' }} to="/login">{translate('register:login')}</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

RegisterContainer.propTypes = {
  translate: PropTypes.func.isRequired,
};

export default RegisterContainer;
