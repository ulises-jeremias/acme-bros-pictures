import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { TimeInput } from 'semantic-ui-calendar-react';
import { timeFormat as timeStrFormat } from 'app/helpers/date';

const renderTimeInput = ({
  meta: { touched, error, warning },
  input,
  label,
  placeholder,
  disabled,
  required,
  inline,
  dateFormat,
  width,
  inputProps,
}) => (
  <Form.Field
    width={width}
    required={required}
    inline={inline}
    disabled={disabled}
    error={touched && Boolean(error)}
  >
    <label>
      {label}
    </label>
    <TimeInput
      closable
      clearable={!required}
      {...inputProps}
      name={input.name}
      value={input.value}
      dateFormat={dateFormat}
      placeholder={placeholder}
      onChange={(e, { value }) => input.onChange(timeStrFormat(value))}
    />
    <div>
      {touched
        && ((error && <span className="error">{error}</span>)
          || (warning && <span className="warn">{warning}</span>))}
    </div>
  </Form.Field>
);

renderTimeInput.defaultProps = {
  disabled: false,
  required: false,
  inline: false,
  width: undefined,
  placeholder: undefined,
  inputProps: {},
  dateFormat: 'hh:mm:ss',
  label: '',
};

renderTimeInput.propTypes = {
  /* Redux Form props */
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
    warning: PropTypes.string,
  }).isRequired,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
  }).isRequired,

  /* React Semantic UI props */
  inputProps: PropTypes.shape({
    /* Read semantic ui docs at https://react.semantic-ui.com/elements/input */
  }),

  /* Some controlled field and input props */
  label: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  inline: PropTypes.bool,
  placeholder: PropTypes.string,
  dateFormat: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default renderTimeInput;
