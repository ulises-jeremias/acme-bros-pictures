import { reduxForm } from 'redux-form';
import LoginForm from 'app/components/Login/LoginForm';

export default reduxForm({
  form: 'loginForm',
})(LoginForm);
