import { reduxForm } from 'redux-form';
import RegisterForm from 'app/components/Register/RegisterForm';

export default reduxForm({
  form: 'registerForm',
})(RegisterForm);
