import { push } from 'connected-react-router';

import * as workflowsBackend from 'app/backend/workflows';
import handleError from 'app/helpers/error-handler';
import {
  WORKFLOWS_WORKFLOW_GET_REQUEST,
  WORKFLOWS_WORKFLOW_GET_SUCCESS,
  WORKFLOWS_WORKFLOW_GET_FAILURE,

  WORKFLOWS_WORKFLOW_CREATE_REQUEST,
  WORKFLOWS_WORKFLOW_CREATE_SUCCESS,
  WORKFLOWS_WORKFLOW_CREATE_FAILURE,

  WORKFLOWS_TASK_CREATE_REQUEST,
  WORKFLOWS_TASK_CREATE_SUCCESS,
  WORKFLOWS_TASK_CREATE_FAILURE,
} from 'app/constants';

export const fetchWorkflow = (id) => async (dispatch, getState) => {
  const { auth: { token } } = getState();
  try {
    dispatch({ type: WORKFLOWS_WORKFLOW_GET_REQUEST });
    const { data } = await workflowsBackend.fetchWorkflow(id, token);
    dispatch({ type: WORKFLOWS_WORKFLOW_GET_SUCCESS, payload: data });
  } catch (err) {
    const [message, redirect] = handleError(err);
    if (redirect) {
      dispatch(push(redirect));
    }
    dispatch({ type: WORKFLOWS_WORKFLOW_GET_FAILURE, payload: message });
  }
};

export const createWorkflow = (workflow) => async (dispatch, getState) => {
  const { auth: { token } } = getState();
  try {
    dispatch({ type: WORKFLOWS_WORKFLOW_CREATE_REQUEST });
    await workflowsBackend.createWorkflow(workflow, token);
    dispatch({ type: WORKFLOWS_WORKFLOW_CREATE_SUCCESS });
  } catch (err) {
    const [message, redirect] = handleError(err);
    if (redirect) {
      dispatch(push(redirect));
    }
    dispatch({ type: WORKFLOWS_WORKFLOW_CREATE_FAILURE, payload: message });
  }
};

export const createTask = (task) => async (dispatch, getState) => {
  const { auth: { token } } = getState();
  try {
    dispatch({ type: WORKFLOWS_TASK_CREATE_REQUEST });
    await workflowsBackend.createTask(task, token);
    dispatch({ type: WORKFLOWS_TASK_CREATE_SUCCESS });
    await dispatch(fetchWorkflow(task.workflowId));
  } catch (err) {
    const [message, redirect] = handleError(err);
    if (redirect) {
      dispatch(push(redirect));
    }
    dispatch({ type: WORKFLOWS_TASK_CREATE_FAILURE, payload: message });
  }
};

export default {
  fetchWorkflow,
  createWorkflow,
  createTask,
};
