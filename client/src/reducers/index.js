import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import formReducer from './form';
import authReducer from './auth';
import projectsReducer from './projects';
import songsReducer from './songs';
import tracksReducer from './tracks';
import usersReducer from './users';
import workflowsReducer from './workflows';

export default (history) => combineReducers({
  router: connectRouter(history),
  form: formReducer,
  auth: authReducer,
  projects: projectsReducer,
  songs: songsReducer,
  tracks: tracksReducer,
  users: usersReducer,
  workflows: workflowsReducer,
});
