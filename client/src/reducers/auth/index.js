import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import authReducer from './auth';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'],
};

export default persistReducer(authPersistConfig, authReducer);
