import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import workflowsReducer from './workflows';

const workflowsPersistConfig = {
  key: 'workflows',
  storage,
  whitelist: [],
};

export default persistReducer(workflowsPersistConfig, workflowsReducer);
