import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'semantic-ui-react';

const renderSelect = ({
  meta: { touched, error, warning },
  input,
  label,
  placeholder,
  disabled,
  required,
  inline,
  width,
  options,
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
    <Select
      search
      {...inputProps}
      name={input.name}
      value={input.value}
      placeholder={placeholder}
      options={options}
      onChange={inputProps.readOnly ? undefined : (e, { value }) => input.onChange(value)}
    />
    <div>
      {touched
        && ((error && <span className="error">{error}</span>)
          || (warning && <span className="warn">{warning}</span>))}
    </div>
  </Form.Field>
);

renderSelect.defaultProps = {
  disabled: false,
  required: false,
  inline: false,
  width: undefined,
  placeholder: undefined,
  inputProps: {},
  label: '',
};

renderSelect.propTypes = {
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
    /* Read semantic ui docs at https://react.semantic-ui.com/addons/select */
  }),

  /* Some controlled field and input props */
  label: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  inline: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    text: PropTypes.string,
    value: PropTypes.any,
  })).isRequired,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default renderSelect;
