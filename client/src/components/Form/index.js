import React from 'react';
import { Form } from 'semantic-ui-react';

import renderDateInputComponent from './DateInput';
import renderInputComponent from './Input';
import renderSelectComponent from './Select';
import renderTextAreaComponent from './TextArea';

export const renderDateInput = renderDateInputComponent;
export const renderInput = renderInputComponent;
export const renderSelect = renderSelectComponent;
export const renderTextArea = renderTextAreaComponent;

export const renderCheckbox = (field) => {
  if (field.labelPosition === 'top') {
    return (
      <Form.Field>
        <label>{field.label}</label>
        <Form.Checkbox
          checked={!!field.input.value}
          name={field.input.name}
          onChange={field.inputProps.readOnly ? undefined : (
            (e, { checked }) => field.input.onChange(checked)
          )}
          toggle={field.toggle}
        />
      </Form.Field>
    );
  }

  return (
    <Form.Checkbox
      checked={!!field.input.value}
      name={field.input.name}
      label={field.label}
      onChange={(e, { checked }) => field.input.onChange(checked)}
      toggle={field.toggle}
    />
  );
};

export const renderRadio = (field) => (
  <Form.Radio
    checked={field.input.value === field.radioValue}
    label={field.label}
    name={field.input.name}
    onChange={() => field.input.onChange(field.radioValue)}
  />
);

export default {
  renderDateInput,
  renderInput,
  renderCheckbox,
  renderRadio,
  renderSelect,
  renderTextArea,
};
