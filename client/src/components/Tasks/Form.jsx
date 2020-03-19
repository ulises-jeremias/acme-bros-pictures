import _ from 'underscore';
import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import {
  Form,
} from 'semantic-ui-react';
import { renderInput, renderSelect } from 'app/components/Form';
import { required } from 'app/validations/common';

import {
  TODO,
  RUNNING,
  SUCCESS,
  FAILED,

  STATUS_COLORS,
  STATUS_ICONS,
} from 'app/config/enums';

const TaskForm = (props) => {
  const {
    translate,
    handleSubmit,
    onSubmit,
    submitting,
  } = props;

  const options = _.map([TODO, RUNNING, SUCCESS, FAILED], (status) => ({
    text: translate(`create.status.options.${status}`),
    value: status,
    icon: { color: STATUS_COLORS[status], name: STATUS_ICONS[status] },
  }));

  return (
    <Form size="tiny" onSubmit={handleSubmit(onSubmit)}>
      <Form.Group>
        <Field
          component={renderInput}
          required
          width={7}
          name="description"
          label={translate('create.description.label')}
          placeholder={translate('create.description.placeholder')}
          validate={[required()]}
        />
        <Field
          component={renderSelect}
          required
          width={7}
          name="status"
          label={translate('create.status.label')}
          placeholder={translate('create.status.placeholder')}
          options={options}
          validate={[required()]}
        />
        <Form.Button
          style={{ marginTop: '26px' }}
          width={2}
          loading={submitting}
          color="orange"
          icon="plus"
        />
      </Form.Group>

    </Form>
  );
};

TaskForm.propTypes = {
  translate: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default TaskForm;
