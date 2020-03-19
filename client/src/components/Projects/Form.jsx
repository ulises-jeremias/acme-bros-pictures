import _ from 'underscore';
import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import {
  Header,
  Form,
  Button,
  Divider,
} from 'semantic-ui-react';
import { renderInput, renderSelect } from 'app/components/Form';
import { required } from 'app/validations/common';

const ProjectForm = (props) => {
  const {
    translate,
    handleSubmit,
    onSubmit,
    submitting,
    users,
  } = props;

  const options = _.map(users, (user) => ({
    text: `@${user.username} ${user.name} `,
    value: { id: user.id },
    icon: 'user',
  }));

  return (
    <>
      <Header as="h1" color="orange" textAlign="left">
        {translate('create.title')}
      </Header>

      <Divider hidden />
      <Divider hidden />

      <Form size="tiny" onSubmit={handleSubmit(onSubmit)}>
        <Field
          component={renderInput}
          required
          name="name"
          label={translate('create.name.label')}
          placeholder={translate('create.name.placeholder')}
          validate={[required()]}
        />
        <Field
          component={renderSelect}
          required
          name="employees"
          label={translate('create.employees.label')}
          placeholder={translate('create.employees.placeholder')}
          inputProps={{ multiple: true, clearable: true }}
          options={options}
          validate={[required()]}
        />

        <Divider hidden />

        <Button loading={submitting} color="orange" size="large" fluid>
          {translate('create.sendButton')}
        </Button>
      </Form>
    </>
  );
};

ProjectForm.propTypes = {
  translate: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
};

export default ProjectForm;
