import { reduxForm } from 'redux-form';

import WorkflowCreate from 'app/components/Workflows/Form';

const ConnectedWorkflowForm = reduxForm({
  form: 'workflowCreateForm',
})(WorkflowCreate);

export default ConnectedWorkflowForm;
