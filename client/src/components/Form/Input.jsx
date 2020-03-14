import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';

const renderInput = ({
  meta: { touched, error, warning },
  input,
  label,
  placeholder,
  type,
  disabled,
  required,
  inline,
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
    <Input
      {...inputProps}
      name={input.name}
      value={input.value}
      placeholder={placeholder}
      type={type}
      onChange={(e, { value }) => input.onChange(value)}
    />
    <div>
      {touched
        && ((error && <span className="error">{error}</span>)
          || (warning && <span className="warn">{warning}</span>))}
    </div>
  </Form.Field>
);

renderInput.defaultProps = {
  disabled: false,
  required: false,
  inline: false,
  width: undefined,
  placeholder: undefined,
  type: 'text',
  inputProps: {},
  label: '',
};

renderInput.propTypes = {
  /* Redux Form props */
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
    warning: PropTypes.string,
  }).isRequired,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
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
  type: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default renderInput;
