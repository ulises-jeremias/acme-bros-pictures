import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import LoginForm from 'app/components/Login/LoginForm';

const selector = formValueSelector('loginForm');

const LoginFormContainer = reduxForm({
  form: 'loginForm',
})(LoginForm);

export default connect(
  (state) => {
    const username = selector(state, 'username');
    const password = selector(state, 'password');

    return {
      username,
      password,
    };
  },
)(LoginFormContainer);
