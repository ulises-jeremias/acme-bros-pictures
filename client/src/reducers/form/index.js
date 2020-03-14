import { reducer as formReducer } from 'redux-form';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const formPersistConfig = {
  key: 'form',
  storage,
  whitelist: [],
};

export default persistReducer(formPersistConfig, formReducer);
