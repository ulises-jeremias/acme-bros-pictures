import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import projectsReducer from './projects';

const projectsPersistConfig = {
  key: 'projects',
  storage,
  whitelist: [],
};

export default persistReducer(projectsPersistConfig, projectsReducer);
