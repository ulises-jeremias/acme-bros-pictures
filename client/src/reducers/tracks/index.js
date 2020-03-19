import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import tracksReducer from './tracks';

const tracksPersistConfig = {
  key: 'tracks',
  storage,
  whitelist: [],
};

export default persistReducer(tracksPersistConfig, tracksReducer);
