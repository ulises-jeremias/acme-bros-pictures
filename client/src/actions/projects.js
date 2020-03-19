import { push } from 'connected-react-router';

import * as projectsBackend from 'app/backend/projects';
import handleError from 'app/helpers/error-handler';
import {
  PROJECTS_GET_REQUEST,
  PROJECTS_GET_SUCCESS,
  PROJECTS_GET_FAILURE,

  PROJECTS_PROJECT_GET_REQUEST,
  PROJECTS_PROJECT_GET_SUCCESS,
  PROJECTS_PROJECT_GET_FAILURE,

  PROJECTS_PROJECT_CREATE_REQUEST,
  PROJECTS_PROJECT_CREATE_SUCCESS,
  PROJECTS_PROJECT_CREATE_FAILURE,
} from 'app/constants';

export const fetchProjects = () => async (dispatch, getState) => {
  const { auth: { token } } = getState();
  try {
    dispatch({ type: PROJECTS_GET_REQUEST });
    const { data } = await projectsBackend.fetchProjects(token);
    dispatch({ type: PROJECTS_GET_SUCCESS, payload: data });
  } catch (err) {
    const [message, redirect] = handleError(err);
    if (redirect) {
      dispatch(push(redirect));
    }
    dispatch({ type: PROJECTS_GET_FAILURE, payload: message });
  }
};

export const fetchProject = (id) => async (dispatch, getState) => {
  const { auth: { token } } = getState();
  try {
    dispatch({ type: PROJECTS_PROJECT_GET_REQUEST });
    const { data: { watching, project } } = await projectsBackend.fetchProject(id, token);
    dispatch({ type: PROJECTS_PROJECT_GET_SUCCESS, payload: { watching, data: project } });
  } catch (err) {
    const [message, redirect] = handleError(err);
    if (redirect) {
      dispatch(push(redirect));
    }
    dispatch({ type: PROJECTS_PROJECT_GET_FAILURE, payload: message });
  }
};

export const createProject = (project) => async (dispatch, getState) => {
  const { auth: { token } } = getState();
  try {
    dispatch({ type: PROJECTS_PROJECT_CREATE_REQUEST });
    await projectsBackend.createProject(project, token);
    dispatch({ type: PROJECTS_PROJECT_CREATE_SUCCESS });
  } catch (err) {
    const [message, redirect] = handleError(err);
    if (redirect) {
      dispatch(push(redirect));
    }
    dispatch({ type: PROJECTS_PROJECT_CREATE_FAILURE, payload: message });
  }
};

export default {
  fetchProjects,
  fetchProject,
  createProject,
};
