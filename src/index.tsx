import 'antd/dist/antd.min.css';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { clearReduxData } from '../src/resetPersist';
import App from './App';
import Loading from './components/store/common/Loading';
import './i18n';
import './index.css';
import reportWebVitals from './reportWebVitals';
import store from './store';

const persistor = persistStore(store);

// clearing redux data
clearReduxData();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <PersistGate
      loading={null}
      persistor={persistor}
    >
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

reportWebVitals();
