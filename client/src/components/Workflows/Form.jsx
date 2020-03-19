import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import {
  Header,
  Form,
  Button,
  Divider,
} from 'semantic-ui-react';
import { renderInput, renderDateInput } from 'app/components/Form';
import { required } from 'app/validations/common';

const WorkflowForm = (props) => {
  const {
    translate,
    handleSubmit,
    onSubmit,
    submitting,
  } = props;

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
          name="description"
          label={translate('create.description.label')}
          placeholder={translate('create.description.placeholder')}
          validate={[required()]}
        />
        <Field
          component={renderDateInput}
          required
          name="expectedStartDate"
          label={translate('create.expectedStartDate.label')}
          placeholder={translate('create.expectedStartDate.placeholder')}
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

WorkflowForm.propTypes = {
  translate: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  track: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
};

export default WorkflowForm;
