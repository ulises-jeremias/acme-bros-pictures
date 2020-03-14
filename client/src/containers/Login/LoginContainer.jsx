import React from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
  Grid,
  Message,
  Icon,
} from 'semantic-ui-react';

import { login } from 'app/actions/auth';
import LoginForm from 'app/containers/Login/LoginFormContainer';

const LoginContainer = (props) => {
  const { translate } = props;
  const error = useSelector((state) => state.auth.error, shallowEqual);
  const dispatch = useDispatch();

  const onSubmit = (values) => dispatch(login(values));

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        {error && (
          <Message negative>
            <Message.Header>{error}</Message.Header>
          </Message>
        )}
        <LoginForm
          translate={(name, ...args) => translate(`login:${name}`, ...args)}
          onSubmit={onSubmit}
        />
        <Message style={{ borderRadius: 0 }}>
          {translate('login:contact')}
          <Icon color="green" name="whatsapp" />
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default LoginContainer;
