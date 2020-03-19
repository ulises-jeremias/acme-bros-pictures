import { reduxForm } from 'redux-form';
import TaskForm from 'app/components/Tasks/Form';

export default reduxForm({
  form: 'taskForm',
})(TaskForm);
