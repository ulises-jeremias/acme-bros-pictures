import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import {
  Header,
  Form,
  Button,
  Divider,
  Segment,
} from 'semantic-ui-react';
import { renderInput } from 'app/components/Form';

const LoginForm = (props) => {
  const {
    translate,
    handleSubmit,
    onSubmit,
    submitting,
  } = props;

  return (
    <Segment stacked padded style={{ borderRadius: 0, paddingTop: '75px' }}>
      <Header as="h1" color="orange" textAlign="center" style={{ fontSize: '3rem' }}>
        {translate('title')}
      </Header>

      <Divider hidden />
      <Divider hidden />
      <Divider hidden />

      <Form size="large" onSubmit={handleSubmit(onSubmit)}>
        <Field
          component={renderInput}
          name="username"
          placeholder={translate('username.placeholder')}
          inputProps={{
            icon: 'user',
            fluid: true,
            iconPosition: 'left',
          }}
        />
        <Field
          component={renderInput}
          name="password"
          placeholder={translate('password.placeholder')}
          type="password"
          inputProps={{
            icon: 'lock',
            fluid: true,
            iconPosition: 'left',
          }}
        />

        <Divider hidden />

        <Button loading={submitting} color="orange" fluid size="big">
          {translate('sendButton')}
        </Button>
      </Form>
    </Segment>
  );
};

LoginForm.propTypes = {
  translate: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default LoginForm;
