import { persistStore } from 'redux-persist';
import currentAppVersion from '../package.json';
import store from './store';

const storedVersion = localStorage.getItem('currentAppVersion');
const persistor = persistStore(store);

export const clearReduxData = () => {
  if (storedVersion !== currentAppVersion.version) {
    localStorage.clear();
    localStorage.removeItem('persist:root');
    persistor.purge().then(() => {
      console.log(
        'Redux Persist data has been reset because of version update'
      );
    });
    localStorage.setItem('currentAppVersion', currentAppVersion.version);
  }
};
