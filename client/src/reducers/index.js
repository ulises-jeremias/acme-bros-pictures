import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import formReducer from './form';
import authReducer from './auth';

export default (history) => combineReducers({
  router: connectRouter(history),
  form: formReducer,
  auth: authReducer,
});
